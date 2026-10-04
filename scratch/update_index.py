import re

with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure icon uses logo.png
content = re.sub(r'<link rel="icon" type="image/png" href="/[^"]*" />', '<link rel="icon" type="image/png" href="/logo.png" />', content)

# Update og:image
content = re.sub(r'<meta property="og:image" content="[^"]*" />', '<meta property="og:image" content="https://fortunefoodz.vercel.app/og-image.jpg" />', content)

# Update twitter:image
content = re.sub(r'<meta name="twitter:image" content="[^"]*" />', '<meta name="twitter:image" content="https://fortunefoodz.vercel.app/og-image.jpg" />', content)

# Add some recommended Open Graph tags for WhatsApp
if 'og:image:width' not in content:
    content = content.replace('<meta property="og:image" content="https://fortunefoodz.vercel.app/og-image.jpg" />', 
                              '<meta property="og:image" content="https://fortunefoodz.vercel.app/og-image.jpg" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta property="og:image:type" content="image/jpeg" />')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated index.html successfully")
