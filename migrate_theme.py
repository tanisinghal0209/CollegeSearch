import os

replacements = {
    # Backgrounds
    "bg-[#060913]": "bg-slate-50",
    "bg-slate-950": "bg-white",
    "bg-slate-900": "bg-white",
    "bg-white/5": "bg-slate-100",
    "bg-white/10": "bg-slate-200",
    "bg-black/60": "bg-slate-900/40",
    "from-[#060913]": "from-slate-50",
    "via-[#060913]/60": "via-slate-50/60",
    
    # Text
    "text-slate-200": "text-slate-800",
    "text-slate-300": "text-slate-600",
    "text-slate-400": "text-slate-500",
    "text-white": "text-slate-900", # Need to be careful with buttons that use text-white with solid backgrounds
    
    # Borders
    "border-white/5": "border-slate-200",
    "border-white/10": "border-slate-200",
    "border-white/20": "border-slate-300",
    "border-slate-800": "border-slate-200",
    
    # Hover states
    "hover:text-white": "hover:text-slate-900",
    "hover:bg-white/5": "hover:bg-slate-100",
    "hover:bg-white/10": "hover:bg-slate-200",
    
    # Shadows
    "shadow-black/10": "shadow-slate-200/50",
    "shadow-black/40": "shadow-slate-200/60",
}

# Fixes for solid buttons/badges that SHOULD have white text
reverts = {
    "text-slate-900 rounded-full font-bold": "text-white rounded-full font-bold",
    "text-slate-900 text-sm": "text-white text-sm", # avatar text
    "text-slate-900 px-4 py-2": "text-white px-4 py-2", # primary btn
    "text-slate-900 py-3": "text-white py-3", # mobile btn
    "text-slate-900 px-5": "text-white px-5", # generic solid btn
}

files_to_migrate = [
    "src/components/Navbar.tsx",
    "src/components/Footer.tsx",
    "src/components/CollegeCard.tsx",
]

for filepath in files_to_migrate:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Special button protection
    content = content.replace("text-white rounded-full font-bold", "TEXT_WHITE_PROTECTED rounded-full font-bold")
    content = content.replace("text-white text-sm", "TEXT_WHITE_PROTECTED text-sm")
    content = content.replace("text-white px-4 py-2", "TEXT_WHITE_PROTECTED px-4 py-2")
    content = content.replace("text-white py-2.5", "TEXT_WHITE_PROTECTED py-2.5")
    content = content.replace("text-white py-3", "TEXT_WHITE_PROTECTED py-3")
    content = content.replace("text-white px-5", "TEXT_WHITE_PROTECTED px-5")
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    # Revert protected strings
    content = content.replace("TEXT_WHITE_PROTECTED", "text-white")
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Migrated {filepath}")

