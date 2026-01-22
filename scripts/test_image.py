import os
from PIL import Image

path = r"C:\Users\rishi\.gemini\antigravity\brain\07c92c0e-b90c-4f1a-93d7-f9da476df73c\uploaded_image_0_1769079650428.png"
try:
    if os.path.exists(path):
        print(f"File exists: {path}")
        img = Image.open(path)
        print(f"Image opened. Size: {img.size}")
    else:
        print(f"File NOT found: {path}")
except Exception as e:
    print(f"Error: {e}")
