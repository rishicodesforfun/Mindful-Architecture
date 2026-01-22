import os
import re

pages_dir = r'c:\Users\rishi\Desktop\mindful-architecture\pages'

files_to_update = [
    'Home.tsx', 'Journey.tsx', 'Dashboard.tsx',  
    'ProfilePage.tsx', 'Library.tsx', 'Programs.tsx', 'Reflection.tsx'
]

for filename in files_to_update:
    filepath = os.path.join(pages_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remove import
        content = re.sub(r"import BottomNav from ['\"]\.\.\/components\/BottomNav['\"];?\s*\n?", '', content)
        # Remove usage
        content = re.sub(r'\s*<BottomNav />\s*\n?', '', content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f'Updated {filename}')
    else:
        print(f'File not found: {filename}')

print('Done!')
