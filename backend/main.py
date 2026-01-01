from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import tensorflow as tf
import io

# -----------------------
# FastAPI app
# -----------------------
app = FastAPI()

origins = [
    "http://localhost",
    "http://127.0.0.1:5500",
    "null",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# Load your trained model
# -----------------------
model = tf.keras.models.load_model("fruit_model.keras", compile=False)

# Recompile with current Keras version
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)
print("✅ Fruit model loaded")

CLASS_NAMES = [
    "apple",
    "banana",
    "cherry",
    "pear",
    "strawberry",
]

# -----------------------
# Health check
# -----------------------
@app.get("/")
def root():
    return {"status": "Fruit AI backend running 🍓"}

# -----------------------
# Prediction endpoint
# -----------------------
@app.post("/guess")
async def guess_drawing(file: UploadFile = File(...)):
    contents = await file.read()

    try:
        # Open image
        image = Image.open(io.BytesIO(contents)).convert("L")

        # Resize to EXACT training size
        image = image.resize((32, 32), Image.Resampling.NEAREST)

        # Convert to numpy
        img_array = np.array(image)

        # Normalize
        img_array = img_array / 255.0

        # Shape: (1, 32, 32, 1)
        img_array = img_array.reshape(1, 32, 32, 1)

    except Exception as e:
        return {"error": f"Image processing failed: {str(e)}"}

    # Run prediction
    predictions = model.predict(img_array)[0]
    print(predictions)

    max_index = int(np.argmax(predictions))
    confidence = float(predictions[max_index])

    if confidence < 0.6:
        return {
            "guess": "Not sure",
            "confidence": confidence
        }
    print({
        "guess": CLASS_NAMES[max_index],
        "confidence": confidence
    })
    return {
        "guess": CLASS_NAMES[max_index],
        "confidence": confidence
    }
