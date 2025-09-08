#!/usr/bin/env python3
"""
Generate thumbnails from PDF files in the pdfs directory
Using pdf2image library as fallback
"""

import os
from pathlib import Path

def generate_pdf_thumbnails():
    """Generate thumbnails for all PDF files in the pdfs directory"""
    
    try:
        from pdf2image import convert_from_path
        use_pdf2image = True
    except ImportError:
        print("pdf2image not available. Please install with: pip3 install pdf2image")
        return
    
    # Create thumbnails directory if it doesn't exist
    thumbnails_dir = Path("thumbnails")
    thumbnails_dir.mkdir(exist_ok=True)
    
    # Get all PDF files
    pdfs_dir = Path("pdfs")
    pdf_files = list(pdfs_dir.glob("*.pdf"))
    
    print(f"Found {len(pdf_files)} PDF files")
    
    for pdf_file in pdf_files:
        try:
            # Convert first page to image
            images = convert_from_path(
                str(pdf_file),
                dpi=50,  # Low DPI for thumbnails
                first_page=1,
                last_page=1
            )
            
            if images:
                # Save thumbnail
                thumbnail_path = thumbnails_dir / f"{pdf_file.stem}_thumb.png"
                images[0].save(str(thumbnail_path), 'PNG')
                
                print(f"Generated thumbnail: {thumbnail_path}")
            
        except Exception as e:
            print(f"Error processing {pdf_file}: {e}")
    
    print("Thumbnail generation complete!")

if __name__ == "__main__":
    generate_pdf_thumbnails()