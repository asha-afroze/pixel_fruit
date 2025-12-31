import tensorflow as tf
from tensorflow.keras import layers, models
import pathlib

# ======================
# CONFIG
# ======================
IMG_SIZE = 32
BATCH_SIZE = 32
EPOCHS = 25
DATASET_DIR = pathlib.Path("../fruit-dataset")

# ======================
# LOAD DATA
# ======================
train_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR,
    labels="inferred",
    label_mode="categorical",
    color_mode="grayscale",
    batch_size=BATCH_SIZE,
    image_size=(IMG_SIZE, IMG_SIZE),
    shuffle=True,
    seed=123,
    validation_split=0.2,
    subset="training"
)

val_ds = tf.keras.utils.image_dataset_from_directory(
    DATASET_DIR,
    labels="inferred",
    label_mode="categorical",
    color_mode="grayscale",
    batch_size=BATCH_SIZE,
    image_size=(IMG_SIZE, IMG_SIZE),
    shuffle=True,
    seed=123,
    validation_split=0.2,
    subset="validation"
)

class_names = train_ds.class_names
num_classes = len(class_names)

print("Classes:", class_names)

# ======================
# NORMALIZATION
# ======================
normalization_layer = layers.Rescaling(1.0 / 255)

train_ds = train_ds.map(lambda x, y: (normalization_layer(x), y))
val_ds = val_ds.map(lambda x, y: (normalization_layer(x), y))

# ======================
# MODEL
# ======================
model = models.Sequential([
    layers.Input(shape=(IMG_SIZE, IMG_SIZE, 1)),

    layers.Conv2D(32, 3, activation="relu"),
    layers.MaxPooling2D(),

    layers.Conv2D(64, 3, activation="relu"),
    layers.MaxPooling2D(),

    layers.Flatten(),
    layers.Dense(128, activation="relu"),
    layers.Dense(num_classes, activation="softmax")
])

model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

model.summary()

# ======================
# TRAIN
# ======================
model.fit(
    train_ds,
    validation_data=val_ds,
    epochs=EPOCHS
)

# ======================
# SAVE MODEL
# ======================
model.save("fruit_model.keras")

print("✅ Model saved as fruit_model.keras/")
