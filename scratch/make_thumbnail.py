from PIL import Image, ImageDraw, ImageFilter
import os

bg_path = r"C:\Users\HP\.gemini\antigravity\brain\867bd2ef-bb3f-46ac-8a76-db60e5ac0049\fortune_foodz_thumbnail_1788797748662.jpg"
logo_path = "public/logo.png"
output_path = "public/og-image.jpg"

# 1. Open images
bg = Image.open(bg_path).convert("RGBA")
logo = Image.open(logo_path).convert("RGBA")

# 2. Resize logo (make it occupy about 30% of the image width)
target_logo_width = int(bg.width * 0.35)
aspect_ratio = logo.height / logo.width
target_logo_height = int(target_logo_width * aspect_ratio)
logo = logo.resize((target_logo_width, target_logo_height), Image.Resampling.LANCZOS)

# 3. Create a subtle dark overlay on the background to make the logo pop
overlay = Image.new('RGBA', bg.size, (0, 0, 0, 100)) # 40% black
bg = Image.alpha_composite(bg, overlay)

# 4. Create a glow/shadow behind the logo
shadow = Image.new('RGBA', bg.size, (0,0,0,0))
shadow_x = (bg.width - target_logo_width) // 2
shadow_y = (bg.height - target_logo_height) // 2

# Paste a solid black version of the logo for shadow
logo_alpha = logo.split()[3]
shadow_logo = Image.new('RGBA', logo.size, (0, 0, 0, 150))
shadow_logo.putalpha(logo_alpha)
shadow.paste(shadow_logo, (shadow_x, shadow_y + 10), shadow_logo)

# Blur the shadow
shadow = shadow.filter(ImageFilter.GaussianBlur(15))
bg = Image.alpha_composite(bg, shadow)

# 5. Paste the logo in the center
bg.paste(logo, (shadow_x, shadow_y), logo)

# 6. Save as compressed JPEG
bg = bg.convert("RGB")
bg.save(output_path, "JPEG", optimize=True, quality=75)

print(f"Created {output_path} with size {os.path.getsize(output_path) // 1024} KB")
