import os

files_to_migrate = [
    "src/app/(main)/page.tsx",
    "src/app/(main)/colleges/page.tsx",
    "src/app/(main)/colleges/[slug]/page.tsx",
    "src/app/(main)/predictor/page.tsx",
    "src/app/(main)/compare/page.tsx",
    "src/app/(main)/dashboard/page.tsx",
    "src/components/Navbar.tsx",
    "src/components/Footer.tsx",
    "src/components/CollegeCard.tsx",
]

for filepath in files_to_migrate:
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Text contrast fixes
    content = content.replace("text-white", "text-slate-900")
    # Restore text-white for primary buttons/badges that MUST be white on indigo
    content = content.replace("text-slate-900 px-4 py-2", "text-white px-4 py-2")
    content = content.replace("text-slate-900 py-3", "text-white py-3")
    content = content.replace("text-slate-900 px-5", "text-white px-5")
    content = content.replace("text-slate-900 rounded-full", "text-white rounded-full")
    content = content.replace("bg-indigo-600 text-slate-900", "bg-indigo-600 text-white")
    content = content.replace("from-indigo-600 to-sky-500 text-slate-900", "from-indigo-600 to-sky-500 text-white")
    content = content.replace("from-indigo-500 to-sky-500 text-slate-900", "from-indigo-500 to-sky-500 text-white")
    content = content.replace("bg-gradient-to-r from-indigo-500 to-sky-500 text-slate-900", "bg-gradient-to-r from-indigo-500 to-sky-500 text-white")
    
    # Fix CollegeCard explore button text
    content = content.replace("text-slate-900 font-bold px-4 py-2", "text-slate-700 font-bold px-4 py-2")
    
    # Also adjust some slate shades that are still too light for a white background
    content = content.replace("text-slate-400", "text-slate-500")
    content = content.replace("text-slate-300", "text-slate-600")
    content = content.replace("text-slate-200", "text-slate-800")
    content = content.replace("bg-slate-800", "bg-slate-200") # Ranges/sliders
    content = content.replace("bg-white/5", "bg-slate-100")
    
    with open(filepath, 'w') as f:
        f.write(content)

print("Contrast fixed!")

