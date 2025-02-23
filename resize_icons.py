from PIL import Image
import os

def resize_icon(input_path, output_path, size):
    with Image.open(input_path) as img:
        img_resized = img.resize((size, size), Image.Resampling.LANCZOS)
        img_resized.save(output_path, "PNG", optimize=True)

if not os.path.exists("icons"):
    os.makedirs("icons")

# 從 192x192 生成小尺寸圖示
source_icon = "icons/icon-192x192.png"
sizes = [16, 32]

for size in sizes:
    output_path = f"icons/icon-{size}x{size}.png"
    resize_icon(source_icon, output_path, size)
    print(f"Created {size}x{size} icon") 