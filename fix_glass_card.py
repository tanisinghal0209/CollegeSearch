import os

# 1. Update globals.css to make glass-card solid white
with open("src/app/globals.css", "r") as f:
    css_content = f.read()

old_glass_card = """
.glass-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(226, 232, 240, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(99, 102, 241, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}"""

new_glass_card = """
.glass-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-card:hover {
  background: #ffffff;
  border-color: #cbd5e1;
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}"""

if ".glass-card {" in css_content:
    # use replace but be careful about exact match if I modified it
    import re
    css_content = re.sub(r'\.glass-card \{.*?\n\}', new_glass_card.split('\n}\n')[0] + '\n}', css_content, flags=re.DOTALL)
    css_content = re.sub(r'\.glass-card:hover \{.*?\n\}', new_glass_card.split('\n}\n')[1].strip() + '\n}', css_content, flags=re.DOTALL)
    
    with open("src/app/globals.css", "w") as f:
        f.write(css_content)

# 2. Update specific text colors that are still too light
files_to_check = [
    "src/app/(main)/colleges/[slug]/page.tsx",
    "src/components/CollegeCard.tsx"
]

for filepath in files_to_check:
    with open(filepath, 'r') as f:
        content = f.read()
    
    content = content.replace("text-slate-500", "text-slate-600")
    content = content.replace("text-slate-600", "text-slate-700")
    
    with open(filepath, 'w') as f:
        f.write(content)

print("Fixed card background and text contrast")
