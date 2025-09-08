# Publications Upload System

## Overview
This system allows you to easily upload new PDF publications to the VAST-Ghana website and automatically update the publications portal.

## How to Use

### Starting the Servers
1. **Main website server** (port 8000):
   ```bash
   python3 -m http.server 8000
   ```

2. **Upload server** (port 8001):
   ```bash
   python3 upload-server.py
   ```

### Uploading Publications
1. Open the upload page: http://localhost:8001/upload.html
2. Drag and drop PDF files or click to browse
3. Fill in the required details for each publication:
   - Title (auto-generated from filename)
   - Publication year
   - Category
   - Summary/description
4. Click "Upload All Publications"
5. You'll be automatically redirected to the publications page to see your new uploads

### File Structure
- **PDF files**: Automatically saved to `/pdfs/` folder
- **Metadata**: Automatically added to `publications.json`
- **Display**: Immediately visible on the publications portal

### Navigation
- **Main site**: http://localhost:8000/publication.html
- **Upload page**: http://localhost:8001/upload.html

## Features
- ✅ Drag & drop file upload
- ✅ Automatic file validation (PDF only, max 10MB)
- ✅ Dynamic form generation for metadata
- ✅ Automatic updates to publications.json
- ✅ Responsive design for mobile devices
- ✅ Success/error feedback
- ✅ Automatic redirect after upload

## Troubleshooting
- If upload fails, check that both servers are running
- Ensure PDF files are under 10MB
- Make sure you have write permissions to the pdfs folder
- Check browser console for any JavaScript errors