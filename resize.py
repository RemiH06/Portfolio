import os
from PIL import Image

input_dir = "./img/titles_original"
output_dir = "./img/titles"

os.makedirs(output_dir, exist_ok=True)

scale_factor = 0.4

try:
    resample_filter = Image.Resampling.LANCZOS
except AttributeError:
    resample_filter = Image.LANCZOS

for filename in os.listdir(input_dir):
    if filename.lower().endswith(".png"):
        input_path = os.path.join(input_dir, filename)
        output_path = os.path.join(output_dir, filename)

        with Image.open(input_path) as img:
            # Resize
            width, height = img.size
            new_size = (int(width * scale_factor), int(height * scale_factor))

            # Redimension
            img_resized = img.resize(new_size, resample=resample_filter)

            # Save
            img_resized.save(output_path)

        print(f"Procesada: {filename} → {new_size}")
