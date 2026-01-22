import os
import re

pages_dir = r'c:\Users\rishi\Desktop\mindful-architecture\pages'

# Replacements to make pages more compact
replacements = [
    # Reduce padding
    (r'px-6', 'px-4'),
    (r'pt-12', 'pt-4'),
    (r'pt-8', 'pt-4'),
    (r'pb-24', 'pb-16'),
    (r'pb-20', 'pb-16'),
    
    # Reduce card padding
    (r'p-6(?![\d])', 'p-4'),
    (r'p-5(?![\d])', 'p-3'),
    
    # Reduce rounded values
    (r'rounded-3xl', 'rounded-xl'),
    (r'rounded-2xl', 'rounded-lg'),
    
    # Reduce spacing
    (r'space-y-6', 'space-y-3'),
    (r'space-y-4', 'space-y-2'),
    (r'gap-6', 'gap-3'),
    (r'gap-4', 'gap-2'),
    
    # Reduce margins
    (r'mt-8', 'mt-4'),
    (r'mt-6', 'mt-3'),
    (r'mb-6', 'mb-3'),
    (r'mb-4', 'mb-2'),
    
    # Reduce font sizes
    (r'text-3xl', 'text-2xl'),
    (r'text-2xl', 'text-xl'),
    
    # Reduce icon containers
    (r'w-14 h-14', 'w-10 h-10'),
    (r'w-12 h-12', 'w-10 h-10'),
    
    # Reduce heights
    (r'h-32', 'h-24'),
    (r'h-24', 'h-20'),
]

files_to_update = [
    'Dashboard.tsx',
    'Journey.tsx', 
    'ProfilePage.tsx',
    'Player.tsx',
    'Library.tsx',
    'Programs.tsx',
    'Reflection.tsx',
    'Pricing.tsx',
    'Task.tsx',
    'DayView.tsx',
]

for filename in files_to_update:
    filepath = os.path.join(pages_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        for pattern, replacement in replacements:
            content = re.sub(pattern, replacement, content)
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f'Updated {filename}')
        else:
            print(f'No changes needed for {filename}')
    else:
        print(f'File not found: {filename}')

print('\nDone! All pages updated with compact styling.')
