# 🍎 AI Calorie Counter Mobile App

> **Your personal nutrition assistant powered by Artificial Intelligence.**

Welcome to the **AI Calorie Counter**! This application combines the power of React Native, Node.js, and Advanced Computer Vision (YOLOv8) to help you track your nutrition with just a photo.

---

## 🚀 Project Architecture

This project consists of three main components that need to run simultaneously:

1.  **🧠 Python AI Service**: Runs the YOLOv8 model for food recognition.
2.  **⚙️ Backend API**: Node.js/Express server handling data, authentication, and communication.
3.  **📱 Mobile App**: The React Native Expo frontend interface.

---

## 🛠️ Setup & Installation

Follow these steps to get everything running perfectly.

### 1️⃣ Python AI Service (Food Recognition)

This service must be running for the "Snap & Track" feature to work.

**Prerequisites:** Python 3.8+

1.  Navigate to the service directory:
    ```bash
    cd backend/PythonService
    ```
2.  **Virtual Environment Setup:**
    It is highly recommended to use a virtual environment to avoid dependency conflicts.

    - **Installation:**
      If you don't have the `venv` module, you can install it (usually included with Python):
      ```bash
      python -m pip install --user virtualenv
      ```
    - **Creation:**
      Create the environment named `food_env`:
      ```bash
      python -m venv food_env
      ```
    - **Activation:**
      - **Windows (PowerShell):**
        ```powershell
        .\food_env\Scripts\Activate.ps1
        ```
      - **Windows (Command Prompt):**
        ```cmd
        food_env\Scripts\activate
        ```
      - **Mac/Linux:**
        ```bash
        source food_env/bin/activate
        ```

3.  Install Python dependencies:
    ```bash
    pip install fastapi uvicorn ultralytics pillow pydantic
    ```
4.  **Configuration:**
    - Ensure `yolov8n.pt` or `best_food.pt` is present in the folder. The system will auto-download the fallback model if needed.

---

### 2️⃣ Backend Server (Node.js)

The core logic of the application.

1.  Navigate to the `backend` folder:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Environment Variables:**
    - Ensure you have a `.env` file in the `backend` folder with:
      - `MONGO_URI`: Your MongoDB connection string.
      - `JWT_SECRET`: Secret for user authentication.
      - `YOLO_API_URL`: URL of the Python AI service e.g, http://localhost:8000
      - `PORT`: (Optional, default is 5001)

---

### 3️⃣ Frontend Application (Expo)

The mobile interface you interact with.

1.  Navigate to the app folder:
    ```bash
    cd CalorieCounterApp
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

---

## ▶️ How to Run (The "Magic" Commands)

To run the entire system, you need **3 separate terminals**.

#### Terminal 1: Python AI Service 🧠

```powershell
cd backend
npm run uvicorn
```

_Wait until you see: "Application startup complete"_

#### Terminal 2: Backend API ⚙️

```powershell
cd backend
npm run dev
```

_Wait until you see: "🚀 Server on port 5001"_

#### Terminal 3: Mobile App 📱

```powershell
cd CalorieCounterApp
npx expo start
```

_Scan the QR code with your phone or press 'a' for Android Emulator._

---

## 🐛 Troubleshooting

| Issue                            | Solution                                                                                            |
| :------------------------------- | :-------------------------------------------------------------------------------------------------- |
| **"Model not loaded" Error**     | Ensure Terminal 1 is running and didn't crash. Check if `best_food.pt` exists.                      |
| **App Network Error / API Fail** | Ensure your phone/emulator is on the **same Wi-Fi** as your PC. Update base URL in frontend config. |
| **"Unknown Food"**               | The AI might be unsure. Try taking a clearer photo with better lighting.                            |

---

## ✨ Features

- 📸 **Snap & Track**: Instant calorie estimation from photos.
- 📊 **History Logging**: Keep track of your daily intake.
- 🥗 **Nutrient Breakdown**: Detailed macros (Carbs, Protein, Fat).

Made with ❤️ by Hassan Ali Abrar
