"""
Script to convert PPTX files to slide images.
Uses pdf2image and comtypes for Windows PowerPoint automation.

Install requirements:
  pip install pdf2image comtypes Pillow

For pdf2image, also install poppler:
  Download from: https://github.com/oschwartz10612/poppler-windows/releases
  Add to PATH or specify poppler_path in the script.

Alternatively, if PowerPoint is installed, we use COM automation directly.
"""

import json
import os
import sys
from pathlib import Path

# Try to import optional dependencies
try:
    import comtypes.client
    HAS_COMTYPES = True
except ImportError:
    HAS_COMTYPES = False

try:
    from pdf2image import convert_from_path
    HAS_PDF2IMAGE = True
except ImportError:
    HAS_PDF2IMAGE = False

from PIL import Image


def export_slides_with_powerpoint(pptx_path: str, output_dir: str) -> int:
    """Export slides using PowerPoint COM automation (Windows only)."""
    if not HAS_COMTYPES:
        raise RuntimeError("comtypes not installed. Run: pip install comtypes")
    
    pptx_path = os.path.abspath(pptx_path)
    output_dir = os.path.abspath(output_dir)
    os.makedirs(output_dir, exist_ok=True)
    
    powerpoint = comtypes.client.CreateObject("PowerPoint.Application")
    powerpoint.Visible = 1
    
    try:
        presentation = powerpoint.Presentations.Open(pptx_path, WithWindow=False)
        slide_count = presentation.Slides.Count
        
        for i in range(1, slide_count + 1):
            slide_path = os.path.join(output_dir, f"slide-{i}.jpg")
            presentation.Slides(i).Export(slide_path, "JPG", 1280, 720)
            print(f"  Exported slide {i}/{slide_count}")
        
        presentation.Close()
        return slide_count
    finally:
        powerpoint.Quit()


def create_placeholder_slides(output_dir: str, slide_count: int = 10):
    """Create placeholder slide images when no conversion method is available."""
    os.makedirs(output_dir, exist_ok=True)
    
    for i in range(1, slide_count + 1):
        img = Image.new('RGB', (1280, 720), color='#1c1917')
        slide_path = os.path.join(output_dir, f"slide-{i}.jpg")
        img.save(slide_path, 'JPEG', quality=90)
    
    return slide_count


def convert_presentation(pres: dict, public_dir: str) -> int:
    """Convert a single presentation to slide images."""
    slug = pres["slug"]
    source_path = pres["sourcePath"]
    output_dir = os.path.join(public_dir, slug)
    
    # Check if already generated
    if os.path.exists(output_dir):
        existing = [f for f in os.listdir(output_dir) if f.endswith('.jpg')]
        if existing:
            print(f"✓ Slides for '{slug}' already exist ({len(existing)} slides)")
            return len(existing)
    
    print(f"\nConverting: {pres['title']}")
    
    if not os.path.exists(source_path):
        print(f"  ✗ Source file not found: {source_path}")
        return 0
    
    os.makedirs(output_dir, exist_ok=True)
    
    # Try PowerPoint COM automation first (Windows)
    if HAS_COMTYPES and sys.platform == 'win32':
        try:
            print("  → Using PowerPoint COM automation...")
            count = export_slides_with_powerpoint(source_path, output_dir)
            print(f"  ✓ Generated {count} slides")
            return count
        except Exception as e:
            print(f"  → PowerPoint automation failed: {e}")
    
    print(f"  ✗ No conversion method available")
    return 0


def main():
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent
    data_path = project_dir / "src" / "data" / "presentations.json"
    public_dir = project_dir / "public" / "presentations"
    
    print("=== Generating Presentation Slides ===\n")
    
    with open(data_path, 'r') as f:
        presentations = json.load(f)
    
    # Convert each presentation
    for pres in presentations:
        count = convert_presentation(pres, str(public_dir))
        pres["slideCount"] = count
        pres["thumbnail"] = f"/presentations/{pres['slug']}/slide-1.jpg"
    
    # Update presentations.json with slide counts
    with open(data_path, 'w') as f:
        json.dump(presentations, f, indent=2)
    
    print("\n✓ Updated presentations.json with slide counts")
    print("\n=== Done! ===")


if __name__ == "__main__":
    main()
