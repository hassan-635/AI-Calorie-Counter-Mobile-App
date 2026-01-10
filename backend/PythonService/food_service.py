from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
from io import BytesIO
from PIL import Image
from ultralytics import YOLO
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# YOLOv8 model (custom fine-tuned with fallback)
model = None
model_type = "unknown"

def load_model():
    """Load YOLOv8 model with fallback logic"""
    global model, model_type
    
    model_path = 'best_food.pt'
    
    # Check if custom model exists and is valid
    if os.path.exists(model_path) and os.path.getsize(model_path) > 1000:
        try:
            logger.info(f"Loading custom model from {model_path}")
            model = YOLO(model_path)
            model_type = "custom"
            logger.info("✅ Custom food detection model loaded successfully")
            return
        except Exception as e:
            logger.error(f"❌ Failed to load custom model: {e}")
    else:
        logger.warning(f"⚠️ Custom model not found or invalid (size: {os.path.getsize(model_path) if os.path.exists(model_path) else 0} bytes)")
    
    # Fallback to pre-trained YOLOv8n model
    try:
        logger.info("Loading fallback YOLOv8n model (will auto-download)")
        model = YOLO('yolov8n.pt')
        model_type = "pretrained-yolov8n"
        logger.info("✅ Pre-trained YOLOv8n model loaded successfully")
    except Exception as e:
        logger.error(f"❌ Failed to load fallback model: {e}")
        raise

# Load model on startup
load_model()

class ImageRequest(BaseModel):
    image_base64: str

@app.get("/")
async def root():
    """Root endpoint with service info"""
    return {
        "service": "Food Recognition API",
        "version": "1.0.0",
        "model_type": model_type,
        "status": "ready" if model is not None else "error"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {
        "status": "healthy",
        "model_type": model_type,
        "model_loaded": True
    }

@app.post("/predict")
async def predict_food(request: ImageRequest):
    """Predict food from base64 encoded image"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    try:
        # Decode base64 image
        img_bytes = base64.b64decode(request.image_base64)
        img = Image.open(BytesIO(img_bytes)).convert("RGB")
        
        # Run inference
        results = model(img)
        
        # Get the first result
        if len(results) > 0 and len(results[0].boxes) > 0:
            # Get the box with highest confidence
            boxes = results[0].boxes
            confidences = boxes.conf.cpu().numpy()
            class_ids = boxes.cls.cpu().numpy()
            
            # Get the top detection
            top_idx = confidences.argmax()
            top_confidence = float(confidences[top_idx])
            top_class_id = int(class_ids[top_idx])
            top_class_name = results[0].names[top_class_id]
            
            return {
                "food": top_class_name,
                "confidence": top_confidence,
                "model_type": model_type
            }
        else:
            return {
                "food": "Unknown",
                "confidence": 0.0,
                "model_type": model_type
            }
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
