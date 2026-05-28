import os

replacements = {
    # Backgrounds
    "bg-[#060913]": "bg-slate-50",
    "bg-slate-950": "bg-white",
    "bg-slate-900": "bg-white",
    "bg-slate-800": "bg-slate-200",
    "bg-white/5": "bg-slate-100",
    "bg-white/10": "bg-slate-200",
    "bg-black/60": "bg-slate-900/40",
    "from-[#060913]": "from-slate-50",
    "via-[#060913]/60": "via-slate-50/60",
    
    # Text
    "text-slate-200": "text-slate-800",
    "text-slate-300": "text-slate-600",
    "text-slate-400": "text-slate-500",
    "text-white": "text-slate-900",
    
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
    "shadow-black/20": "shadow-slate-200/40",
}

files_to_migrate = [
    "src/app/(main)/page.tsx",
    "src/app/(main)/colleges/page.tsx",
    "src/app/(main)/colleges/[slug]/page.tsx",
    "src/app/(main)/predictor/page.tsx",
    "src/app/(main)/compare/page.tsx",
    "src/app/(main)/dashboard/page.tsx",
    "src/app/(auth)/login/page.tsx",
    "src/app/(auth)/signup/page.tsx",
]

for filepath in files_to_migrate:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Protect specific buttons
    content = content.replace("text-white px-", "TEXT_WHITE_PROTECTED px-")
    content = content.replace("text-white py-", "TEXT_WHITE_PROTECTED py-")
    content = content.replace("text-white w-", "TEXT_WHITE_PROTECTED w-")
    content = content.replace("text-white rounded", "TEXT_WHITE_PROTECTED rounded")
    content = content.replace("text-white font-", "TEXT_WHITE_PROTECTED font-")
    content = content.replace("text-white flex", "TEXT_WHITE_PROTECTED flex")
    
    for old, new in replacements.items():
        content = content.replace(old, new)
        
    # Revert protected strings
    content = content.replace("TEXT_WHITE_PROTECTED", "text-white")
    
    with open(filepath, 'w') as f:
        f.write(content)
    
    print(f"Migrated {filepath}")

