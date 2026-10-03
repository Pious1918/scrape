#!/usr/bin/env python3
"""
Monthly YouTube Thumbnail & Shorts Cover Overlay Engine (Option A - Fixed)
-------------------------------------------------------------------------
1-Click Automated Batch Generation for 31 Days (62 Assets):
1. YouTube Landscape (16:9, 1376x768)
2. YouTube Shorts Cover (9:16, 768x1376)

Features:
- 100% Clean: Uses pristine blank badge templates so NO previous date ever leaks or overlaps.
- Precise Geometry: Exact bounding boxes and tilt angles tailored specifically for Pose 1 and Pose 2.
- Strict Alternating Poses:
    - Odd Days: Pose 1 (Holding notebook horizontally with both hands)
    - Even Days: Pose 2 (Hand warmly gesturing towards headline)
- Daily Wardrobe & Color Cycling (Sage Green, Denim Jacket, Mustard Kurti, Lavender Sweater, Royal Blue Kurti, Terracotta Jacket).
- On any single day: BOTH Landscape and Shorts share the EXACT SAME POSE and OUTFIT.
- Dynamic Calendar: Auto-formats date badge (e.g. 'OCT 08, 2026') & handles month/year rollovers.
- Completes entire month (62 images) in ~3 seconds on your Mac!

Usage:
    python3 scripts/render_monthly_overlay_thumbnails.py --month=10 --year=2026 --overwrite
    ./scripts/run_monthly_overlay.sh 10 2026
"""

import os
import sys
import argparse
import calendar
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT_IMPACT = "/System/Library/Fonts/Supplemental/Impact.ttf"
TEMPLATES_DIR = os.path.join(PROJECT_ROOT, "reports/thumbnails/clean_templates")

MONTH_ABBRS = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"
]

MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

# Curated Base Portraits Library (Using Pristine Blank-Badge Templates)
BASE_TEMPLATES = {
    # Pose 1 library (Odd Days)
    "pose_1": [
        {
            "name": "Sage Green Oversized Sweatshirt",
            "style": "Gen-Z Casual",
            "landscape": os.path.join(TEMPLATES_DIR, "pose1_sage_green_land.jpg"),
            "shorts": os.path.join(TEMPLATES_DIR, "pose1_sage_green_short.jpg")
        },
        {
            "name": "Mustard Yellow Indian Kurti with White Embroidery",
            "style": "Indian Ethnic Modern",
            "landscape": os.path.join(TEMPLATES_DIR, "pose1_mustard_kurti_land.jpg"),
            "shorts": os.path.join(TEMPLATES_DIR, "pose1_mustard_kurti_short.jpg")
        },
        {
            "name": "Deep Royal Blue Anarkali Kurti with Gold Accents",
            "style": "Indian Ethnic Festive",
            "landscape": os.path.join(TEMPLATES_DIR, "pose1_royal_blue_land.jpg"),
            "shorts": os.path.join(TEMPLATES_DIR, "pose1_royal_blue_short.jpg")
        }
    ],
    # Pose 2 library (Even Days)
    "pose_2": [
        {
            "name": "Light Blue Washed Denim Jacket over Graphic Tee",
            "style": "Modern Smart Casual",
            "landscape": os.path.join(TEMPLATES_DIR, "pose2_denim_jacket_land.jpg"),
            "shorts": os.path.join(TEMPLATES_DIR, "pose2_denim_jacket_short.jpg")
        },
        {
            "name": "Pastel Lavender Ribbed Knit Sweater",
            "style": "Gen-Z Cozy Aesthetic",
            "landscape": os.path.join(TEMPLATES_DIR, "pose2_lavender_sweater_land.jpg"),
            "shorts": os.path.join(TEMPLATES_DIR, "pose2_lavender_sweater_short.jpg")
        },
        {
            "name": "Terracotta Rust Cropped Utility Jacket",
            "style": "Modern Gen-Z Trend",
            "landscape": os.path.join(TEMPLATES_DIR, "pose2_terracotta_jacket_land.jpg"),
            "shorts": os.path.join(TEMPLATES_DIR, "pose2_terracotta_jacket_short.jpg")
        }
    ]
}


def draw_date_badge(base_img_path: str, is_pose_1: bool, is_landscape: bool, date_str: str) -> Image.Image:
    """Stamps the dynamic date badge onto the clean base template with exact alignment."""
    img = Image.open(base_img_path).convert("RGBA")
    overlay = Image.new("RGBA", img.size, (0, 0, 0, 0))
    
    font_path = FONT_IMPACT if os.path.exists(FONT_IMPACT) else "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

    if is_landscape:
        if is_pose_1:
            # Pose 1 Landscape: x: 91..701, y: 36..173
            bx, by, bw, bh = 91, 36, 610, 137
            cream = (246, 237, 180, 255)
            font_size = 90
            angle = -1.2
            ty_off = -14
        else:
            # Pose 2 Landscape: x: 189..703, y: 97..229
            bx, by, bw, bh = 189, 97, 514, 134
            cream = (238, 231, 180, 255)
            font_size = 86
            angle = -1.2
            ty_off = -12
    else:
        # Shorts (9:16)
        if is_pose_1:
            # Pose 1 Shorts: x: 103..663, y: 34..156
            bx, by, bw, bh = 103, 34, 560, 122
            cream = (242, 233, 175, 255)
            font_size = 78
            angle = -0.8
            ty_off = -10
        else:
            # Pose 2 Shorts: x: 165..602, y: 73..187
            bx, by, bw, bh = 165, 73, 437, 114
            cream = (242, 236, 194, 255)
            font_size = 72
            angle = -0.8
            ty_off = -10

    # Draw rounded cream container
    b_layer = Image.new("RGBA", (bw, bh), (0, 0, 0, 0))
    b_draw = ImageDraw.Draw(b_layer)
    b_draw.rounded_rectangle([0, 0, bw, bh], radius=24, fill=cream)

    # Draw bold centered typography
    font = ImageFont.truetype(font_path, font_size)
    bbox = b_draw.textbbox((0, 0), date_str, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = (bw - tw) // 2
    ty = (bh - th) // 2 + ty_off
    b_draw.text((tx, ty), date_str, fill=(0, 0, 0, 255), font=font)

    # Rotate by tilt angle
    rotated = b_layer.rotate(-angle, resample=Image.BICUBIC, expand=True)

    # Align centered on badge position
    paste_x = bx - (rotated.width - bw) // 2
    paste_y = by - (rotated.height - bh) // 2

    overlay.paste(rotated, (paste_x, paste_y), rotated)
    final_img = Image.alpha_composite(img, overlay)
    return final_img.convert("RGB")


def generate_full_month(year: int, month: int, target_day=None, overwrite_all=False):
    """Generates all days for the target month & year using pristine blank-badge templates."""
    month_abbr = MONTH_ABBRS[month - 1]
    month_full = MONTH_NAMES[month - 1]
    _, total_days = calendar.monthrange(year, month)
    
    out_dir = os.path.join(PROJECT_ROOT, f"reports/thumbnails/{year}-{month:02d}_{month_abbr}")
    os.makedirs(out_dir, exist_ok=True)
    
    days = [target_day] if target_day else list(range(1, total_days + 1))
    
    print("=" * 70)
    print("🎨 OPTION A: 1-CLICK MONTHLY THUMBNAIL & SHORTS COMPOSITOR (FIXED)")
    print(f"📅 Target Month  : {month_full} {year} ({total_days} Days)")
    print(f"📁 Output Folder : {out_dir}")
    print(f"📊 Total Assets  : {len(days) * 2} Images (Landscape + Shorts)")
    print("=" * 70 + "\n")
    
    generated_count = 0
    
    for day in days:
        date_str = f"{month_abbr} {day:02d}, {year}"
        is_odd = (day % 2 != 0)
        pose_key = "pose_1" if is_odd else "pose_2"
        pose_label = "Pose 1 (Holding Notebook)" if is_odd else "Pose 2 (Gesturing)"
        
        # Pick alternating wardrobe from the pose library
        pool = BASE_TEMPLATES[pose_key]
        idx = ((day - 1) // 2) % len(pool)
        wardrobe = pool[idx]
        
        land_filename = f"Day_{day:02d}_Landscape_16x9.jpg"
        shorts_filename = f"Day_{day:02d}_Shorts_9x16.jpg"
        
        land_dest = os.path.join(out_dir, land_filename)
        shorts_dest = os.path.join(out_dir, shorts_filename)
        
        # Days 1 to 6 can keep original AI generations if you wish, or overwrite with clean overlay
        # Since Days 1-6 are the original reference photos, we keep them unless overwrite_all is set
        if day <= 6 and not overwrite_all and os.path.exists(land_dest) and os.path.exists(shorts_dest):
            print(f"[{day:02d}/{total_days}] {date_str} -> [{pose_label}] | Outfit: {wardrobe['name']} -> ⚡ Original Preserved")
            continue
            
        final_land = draw_date_badge(wardrobe["landscape"], is_pose_1=is_odd, is_landscape=True, date_str=date_str)
        final_land.save(land_dest, "JPEG", quality=95)
        
        final_shorts = draw_date_badge(wardrobe["shorts"], is_pose_1=is_odd, is_landscape=False, date_str=date_str)
        final_shorts.save(shorts_dest, "JPEG", quality=95)
        
        generated_count += 2
        print(f"[{day:02d}/{total_days}] {date_str} -> [{pose_label}] | Outfit: {wardrobe['name']} -> ✨ Clean Generated")
        
    print("\n" + "=" * 70)
    print(f"🎉 Complete! Processed {len(days)} Days ({len(days)*2} Images)")
    print(f"📁 All files ready in: {out_dir}")
    print("=" * 70)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate 31-Day Thumbnail & Shorts via Option A Local Compositor")
    parser.add_argument("--month", type=int, default=10, help="Month number (1-12), default: 10")
    parser.add_argument("--year", type=int, default=2026, help="Year, default: 2026")
    parser.add_argument("--day", type=int, default=None, help="Generate single day for testing")
    parser.add_argument("--overwrite", action="store_true", help="Force overwrite all files including Days 1-6")
    
    args = parser.parse_args()
    generate_full_month(args.year, args.month, target_day=args.day, overwrite_all=args.overwrite)
