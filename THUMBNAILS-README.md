# PDF Thumbnail Generation

This script generates thumbnail images from PDF files in the `pdfs/` directory.

## Installation

### Option 1: Using pdf2image (Recommended)
1. Install pdf2image:
   ```bash
   pip3 install pdf2image
   ```

2. Install system dependencies:
   - **macOS**: Install poppler using Homebrew
     ```bash
     brew install poppler
     ```
   - **Linux**: Install poppler-utils
     ```bash
     sudo apt-get install poppler-utils
     ```
   - **Windows**: Download from https://github.com/oschwartz10612/poppler-windows/releases/

### Option 2: Using PyMuPDF (Alternative)
1. Install PyMuPDF:
   ```bash
   pip3 install PyMuPDF
   ```

## Usage

Run the thumbnail generation script:
```bash
python3 generate_thumbnails.py
```

This will:
- Create a `thumbnails/` directory if it doesn't exist
- Generate PNG thumbnails for all PDF files in the `pdfs/` directory
- Save thumbnails as `[filename]_thumb.png` in the thumbnails directory

## Output

Thumbnails are 150x200 pixel PNG images that can be used for preview purposes in web applications.

## Troubleshooting

- If you get "poppler not found" errors, make sure poppler is installed and in your system PATH
- For permission issues on macOS, you may need to allow Terminal to access files in Security & Privacy settings