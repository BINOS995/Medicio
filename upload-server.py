#!/usr/bin/env python3
import os
import json
import cgi
import http.server
import socketserver
import urllib.parse
from pathlib import Path

class UploadHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/publications.json':
            self.serve_publications()
        else:
            super().do_GET()
    
    def do_POST(self):
        if self.path == '/upload':
            self.handle_file_upload()
        elif self.path == '/update-publications':
            self.handle_publications_update()
        else:
            self.send_error(404)
    
    def handle_file_upload(self):
        try:
            content_type = self.headers['Content-Type']
            if not content_type or not content_type.startswith('multipart/form-data'):
                self.send_error(400, "Invalid content type")
                return
            
            form = cgi.FieldStorage(
                fp=self.rfile,
                headers=self.headers,
                environ={'REQUEST_METHOD': 'POST'}
            )
            
            if 'file' not in form or 'filename' not in form:
                self.send_error(400, "Missing file or filename")
                return
            
            file_item = form['file']
            filename = form['filename'].value
            
            if not filename.lower().endswith('.pdf'):
                self.send_error(400, "Only PDF files are allowed")
                return
            
            upload_dir = Path('pdfs')
            upload_dir.mkdir(exist_ok=True)
            
            file_path = upload_dir / filename
            
            with open(file_path, 'wb') as f:
                f.write(file_item.file.read())
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True}).encode())
            
        except Exception as e:
            self.send_error(500, str(e))
    
    def handle_publications_update(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            publications = json.loads(post_data.decode('utf-8'))
            
            with open('publications.json', 'w') as f:
                json.dump(publications, f, indent=2, ensure_ascii=False)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'success': True}).encode())
            
        except Exception as e:
            self.send_error(500, str(e))
    
    def do_DELETE(self):
        if self.path == '/delete-publication':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                data = json.loads(post_data.decode('utf-8'))
                
                filename = data.get('filename')
                title = data.get('title')
                
                if not filename or not title:
                    self.send_error(400, 'Missing filename or title')
                    return
                
                # Delete the PDF file
                pdf_path = os.path.join('pdfs', filename)
                if os.path.exists(pdf_path):
                    os.remove(pdf_path)
                
                # Update publications.json
                publications_path = 'publications.json'
                if os.path.exists(publications_path):
                    with open(publications_path, 'r') as f:
                        publications = json.load(f)
                    
                    # Filter out the publication
                    updated_publications = [p for p in publications if p['title'] != title or not p['file'].endswith(filename)]
                    
                    with open(publications_path, 'w') as f:
                        json.dump(updated_publications, f, indent=2)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True}).encode())
                
            except Exception as e:
                self.send_error(500, str(e))
        else:
            self.send_error(404)

    def serve_publications(self):
        try:
            if os.path.exists('publications.json'):
                with open('publications.json', 'r') as f:
                    publications = json.load(f)
            else:
                publications = []
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(publications).encode())
            
        except Exception as e:
            self.send_error(500, str(e))

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, GET, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

if __name__ == '__main__':
    PORT = 8001
    with socketserver.TCPServer(("", PORT), UploadHandler) as httpd:
        print(f"Upload server running at http://localhost:{PORT}")
        httpd.serve_forever()