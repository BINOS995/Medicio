#!/usr/bin/env python3
"""
Automatic PDF thumbnail generator
This script can be run to generate thumbnails for all PDF files in the pdfs directory
"""

import os
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

def generate_thumbnail_for_pdf(pdf_path, output_dir="thumbnails"):
    """Generate a thumbnail for a single PDF file"""
    
    # Create thumbnails directory if it doesn't exist
    thumbnails_dir = Path(output_dir)
    thumbnails_dir.mkdir(exist_ok=True)
    
    # Get filename without extension
    filename = pdf_path.stem
    thumbnail_path = thumbnails_dir / f"{filename}_thumb.png"
    
    try:
        # Create a placeholder thumbnail with PDF icon
        width, height = 150, 200
        img = Image.new('RGB', (width, height), color='white')
        draw = ImageDraw.Draw(img)
        
        # Draw PDF icon representation
        draw.rectangle([10, 10, width-10, height-10], outline='#007bff', width=2)
        draw.rectangle([20, 20, width-20, height-20], outline='#0056b3', width=1)
        
        # Add PDF icon
        draw.rectangle([width//2-20, height//3-10, width//2+20, height//3+10], fill='#dc3545')
        draw.text((width//2-15, height//3-5), "PDF", fill='white')
        
        # Add filename
        font_size = 10
        try:
            font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
        except:
            font = ImageFont.load_default()
        
        text = filename[:20] + "..." if len(filename) > 20 else filename
        draw.text((15, height//2 + 20), text, fill='black', font=font)
        
        # Save thumbnail
        img.save(str(thumbnail_path))
        print(f"Generated: {thumbnail_path}")
        return True
        
    except Exception as e:
        print(f"Error generating thumbnail for {pdf_path}: {e}")
        return False

def generate_all_thumbnails():
    """Generate thumbnails for all PDF files in the pdfs directory"""
    
    pdfs_dir = Path("pdfs")
    if not pdfs_dir.exists():
        print("pdfs directory not found!")
        return
       
    pdf_files = list(pdfs_dir.glob("*.pdf"))
    
    if not pdf_files:
        print("No PDF files found in pdfs directory")
        return
    
    print(f"Generating thumbnails for {len(pdf_files)} PDF files...")
    
    success_count = 0
    for pdf_file in pdf_files:
        if generate_thumbnail_for_pdf(pdf_file):
            success_count += 1
    
    print(f"\nThumbnail generation complete!")
    print(f"Successfully generated {success_count} thumbnails")
    print(f"Thumbnails saved in: {Path('thumbnails').absolute()}")

if __name__ == "__main__":
    generate_all_thumbnails()