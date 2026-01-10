from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import base64
from io import BytesIO
from PIL import Image
import torch

app = FastAPI()

# YOLOv8 model (custom fine-tuned)
model = torch.hub.load('ultralytics/yolov8', 'custom', path='best_food.pt', force_reload=True)

class ImageRequest(BaseModel):
    image_base64: str

@app.post("/predict")
async def predict_food(request: ImageRequest):
    try:
        img_bytes = base64.b64decode(request.image_base64)
        img = Image.open(BytesIO(img_bytes)).convert("RGB")
        results = model(img)
        df = results.pandas().xyxy[0]
        if df.empty:
            return {"food": "Unknown", "confidence": 0.0}
        top = df.iloc[0]
        return {"food": top['name'], "confidence": float(top['confidence'])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
