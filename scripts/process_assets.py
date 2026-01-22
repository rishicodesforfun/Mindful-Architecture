import os
import sys

# Setup logging
log_file = r"C:\Users\rishi\Desktop\mindful-architecture\assets_log.txt"
def log(msg):
    with open(log_file, "a") as f:
        f.write(msg + "\n")

log("Script started")

try:
    from PIL import Image, ImageEnhance
    log("PIL imported successfully")
except ImportError as e:
    log(f"PIL Import Error: {e}")
    sys.exit(1)

def process_image(image_path, start_day, output_dir):
    try:
        if not os.path.exists(image_path):
            log(f"Image not found: {image_path}")
            return

        log(f"Processing: {image_path} -> Day {start_day}")
        img = Image.open(image_path)
        width, height = img.size
        log(f"Image size: {width}x{height}")

        # Updated to 5x2 Grid based on "cutting" feedback
        # 10 items per image fits perfectly in 5 columns x 2 rows
        margin_x = int(width * 0.02) # Smaller margin
        margin_y = int(height * 0.02)
        content_w = width - 2*margin_x
        content_h = height - 2*margin_y
        
        cell_w = content_w // 5
        cell_h = content_h // 2
        
        rows = [(margin_y + r*cell_h, margin_y + (r+1)*cell_h) for r in range(2)]
        cols = [(margin_x + c*cell_w, margin_x + (c+1)*cell_w) for c in range(5)]
        
        current_day = start_day
        for r_idx, (y1, y2) in enumerate(rows):
            for c_idx, (x1, x2) in enumerate(cols):
                # Skip if beyond max for this image (10 days per image)
                days_processed = current_day - start_day
                if days_processed >= 10:
                    continue

                crop_box = (x1, y1, x2, y2)
                card = img.crop(crop_box)
                
                # ENHANCEMENT: Attempt to improve quality
                # 1. Sharpen
                enhancer = ImageEnhance.Sharpness(card)
                card = enhancer.enhance(1.5) # Increase sharpness
                
                # 2. Contrast check (optional, but might help legibility)
                enhancer = ImageEnhance.Contrast(card)
                card = enhancer.enhance(1.1)
                
                # 3. Resize with high-quality filter if we want to "upscale" slightly for UI smoothing
                # (Doesn't add detail, but reduces pixelation artifacts on some screens)
                new_size = (int(card.width * 2), int(card.height * 2))
                card = card.resize(new_size, Image.Resampling.LANCZOS)
                
                filename = f"day-{current_day:02d}.png"
                save_path = os.path.join(output_dir, filename)
                card.save(save_path)
                log(f"Saved {filename}")
                
                current_day += 1

    except Exception as e:
        log(f"Error processing {image_path}: {e}")

def main():
    base_dir = r"C:\Users\rishi\Desktop\mindful-architecture"
    assets_dir = os.path.join(base_dir, "public", "assets", "images", "tasks")
    brain_dir = r"C:\Users\rishi\.gemini\antigravity\brain\07c92c0e-b90c-4f1a-93d7-f9da476df73c"
    
    os.makedirs(assets_dir, exist_ok=True)
    
    images = [
        ("uploaded_image_0_1769079650428.png", 1),
        ("uploaded_image_1_1769079650428.png", 11),
        ("uploaded_image_2_1769079650428.png", 21)
    ]
    
    for filename, start_day in images:
        full_path = os.path.join(brain_dir, filename)
        process_image(full_path, start_day, assets_dir)
        
    log("Script finished")

if __name__ == "__main__":
    main()
