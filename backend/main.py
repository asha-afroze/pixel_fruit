from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from transformers import ViTFeatureExtractor, ViTForImageClassification
from PIL import Image, ImageFilter
import io

# Initialize FastAPI app
app = FastAPI()

# --- CORS Middleware ---
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://127.0.0.1",
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

# --- Model Loading ---
model_name = 'google/vit-base-patch16-224'
feature_extractor = ViTFeatureExtractor.from_pretrained(model_name)
model = ViTForImageClassification.from_pretrained(model_name)

print(f"Model '{model_name}' loaded successfully!")

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the Etch-A-Sketch AI Guesser API"}

@app.post("/guess")
async def guess_drawing(file: UploadFile = File(...)):
    """
    Receives an image file, pre-processes it for better accuracy,
    and returns the model's top guess.
    """
    contents = await file.read()
    
    try:
        image = Image.open(io.BytesIO(contents))
        if image.mode != "RGB":
            image = image.convert("RGB")

        # --- Pre-processing for Pixelated Drawings ---
        # 1. Upscale the image to the model's expected size (224x224)
        #    using a high-quality filter to start the smoothing process.
        image = image.resize((224, 224), Image.Resampling.LANCZOS)

        # 2. Apply a gentle Gaussian blur to soften the hard pixel edges,
        #    making the drawing look more like the data the model was trained on.
        image = image.filter(ImageFilter.GaussianBlur(radius=1.5))
        # --- End of Pre-processing ---

    except Exception as e:
        return {"error": f"Failed to open or process image: {str(e)}"}

    # Use the feature extractor to prepare the image for the model
    inputs = feature_extractor(images=image, return_tensors="pt")

    # Make a prediction
    outputs = model(**inputs)
    logits = outputs.logits

    # Get the top prediction
    predicted_class_idx = logits.argmax(-1).item()
    prediction = model.config.id2label[predicted_class_idx]

    return {"guess": prediction}
