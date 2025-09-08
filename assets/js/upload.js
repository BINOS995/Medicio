class PublicationUploader {
    constructor() {
        this.files = [];
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.uploadForm = document.getElementById('uploadForm');
        this.fileForms = document.getElementById('fileForms');
        this.uploadBtn = document.getElementById('uploadBtn');
        this.uploadStatus = document.getElementById('uploadStatus');

        this.initEventListeners();
    }

    initEventListeners() {
        // Drag and drop events
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        this.uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        this.uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        this.fileInput.addEventListener('change', this.handleFileSelect.bind(this));
        this.uploadBtn.addEventListener('click', this.handleUpload.bind(this));
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
        this.processFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }

    processFiles(files) {
        this.files = files;
        this.generateForms();
        this.uploadArea.style.display = 'none';
        this.uploadForm.style.display = 'block';
    }

    generateForms() {
        this.fileForms.innerHTML = '';
        this.files.forEach((file, index) => {
            const form = this.createFileForm(file, index);
            this.fileForms.appendChild(form);
        });
    }

    createFileForm(file, index) {
        const formGroup = document.createElement('div');
        formGroup.className = 'mb-4 p-3 border rounded';
        formGroup.innerHTML = `
            <h6 class="mb-3"><i class="fas fa-file-pdf text-danger"></i> ${file.name}</h6>
            <div class="row">
                <div class="col-md-8 mb-3">
                    <label class="form-label">Publication Title</label>
                    <input type="text" class="form-control title-input" data-index="${index}" 
                           value="${this.generateTitleFromFilename(file.name)}" required>
                </div>
                <div class="col-md-4 mb-3">
                    <label class="form-label">Year</label>
                    <select class="form-select year-input" data-index="${index}" required>
                        ${this.generateYearOptions()}
                    </select>
                </div>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Category</label>
                    <select class="form-select category-input" data-index="${index}" required>
                        <option value="Research Report">Research Report</option>
                        <option value="Policy Brief">Policy Brief</option>
                        <option value="Policy Document">Policy Document</option>
                        <option value="Assessment Report">Assessment Report</option>
                        <option value="Survey Report">Survey Report</option>
                        <option value="Legislation">Legislation</option>
                        <option value="Civil Society Report">Civil Society Report</option>
                        <option value="Community Report">Community Report</option>
                        <option value="Literature Review">Literature Review</option>
                        <option value="Guidelines">Guidelines</option>
                        <option value="Industry Report">Industry Report</option>
                        <option value="Index Report">Index Report</option>
                        <option value="Investment Case">Investment Case</option>
                        <option value="Information Material">Information Material</option>
                        <option value="Policy Statement">Policy Statement</option>
                        <option value="Needs Assessment">Needs Assessment</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label">Summary</label>
                    <textarea class="form-control summary-input" data-index="${index}" rows="2" 
                              placeholder="Brief description of the publication..." required></textarea>
                </div>
            </div>
        `;
        return formGroup;
    }

    generateTitleFromFilename(filename) {
        return filename
            .replace(/\.pdf$/, '')
            .replace(/[-_]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/\b\w/g, l => l.toUpperCase());
    }

    generateYearOptions() {
        const currentYear = new Date().getFullYear();
        let options = '<option value="">Select Year</option>';
        for (let year = currentYear; year >= 2010; year--) {
            options += `<option value="${year}">${year}</option>`;
        }
        return options;
    }

    async handleUpload() {
        if (!this.validateForms()) {
            this.showMessage('Please fill in all required fields', 'error');
            return;
        }

        this.uploadBtn.disabled = true;
        this.uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

        try {
            await this.uploadFiles();
            this.showMessage('Publications uploaded successfully!', 'success');
            setTimeout(() => this.resetForm(), 2000);
        } catch (error) {
            this.showMessage('Upload failed: ' + error.message, 'error');
        } finally {
            this.uploadBtn.disabled = false;
            this.uploadBtn.innerHTML = '<i class="fas fa-upload"></i> Upload All Publications';
        }
    }

    validateForms() {
        const titles = document.querySelectorAll('.title-input');
        const years = document.querySelectorAll('.year-input');
        const categories = document.querySelectorAll('.category-input');
        const summaries = document.querySelectorAll('.summary-input');

        return [...titles, ...years, ...categories, ...summaries].every(input => input.value.trim());
    }

    async uploadFiles() {
        const publications = [];
        
        // Prepare publication data
        this.files.forEach((file, index) => {
            const title = document.querySelector(`.title-input[data-index="${index}"]`).value;
            const year = document.querySelector(`.year-input[data-index="${index}"]`).value;
            const category = document.querySelector(`.category-input[data-index="${index}"]`).value;
            const summary = document.querySelector(`.summary-input[data-index="${index}"]`).value;

            publications.push({
                title,
                year: parseInt(year),
                category,
                summary,
                file: `pdfs/${file.name}`
            });
        });

        // Upload files and update publications
        await this.performUpload(publications);
    }

    async performUpload(newPublications) {
        try {
            // Upload each file
            for (const file of this.files) {
                await this.uploadFile(file);
            }

            // Update publications.json
            await this.updatePublicationsJson(newPublications);
            
            this.showMessage('Publications uploaded and added successfully!', 'success');
            
            // Redirect to publications page after 2 seconds
            setTimeout(() => {
                window.location.href = 'publication.html';
            }, 2000);
            
        } catch (error) {
            this.showMessage('Upload failed: ' + error.message, 'error');
        }
    }

    async uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name);

        const response = await fetch('http://localhost:8001/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Failed to upload ${file.name}`);
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error || 'Upload failed');
        }
    }

    async updatePublicationsJson(newPublications) {
        // Get current publications
        let currentPublications = [];
        try {
            const response = await fetch('publications.json');
            currentPublications = await response.json();
        } catch (error) {
            console.log('Creating new publications.json');
        }

        // Merge new publications
        const updatedPublications = [...currentPublications, ...newPublications];

        // Send to server for file update
        const response = await fetch('http://localhost:8001/update-publications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPublications)
        });

        if (!response.ok) {
            throw new Error('Failed to update publications.json');
        }
    }

    showMessage(message, type) {
        this.uploadStatus.innerHTML = `
            <div class="${type === 'success' ? 'success-message' : 'error-message'}">
                ${message}
            </div>
        `;
    }

    async loadExistingPublications() {
        try {
            const response = await fetch('http://localhost:8001/publications.json');
            const publications = await response.json();
            this.displayExistingPublications(publications);
        } catch (error) {
            this.existingPublications.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-triangle"></i> Failed to load publications: ${error.message}
                </div>
            `;
        }
    }

    displayExistingPublications(publications) {
        if (publications.length === 0) {
            this.existingPublications.innerHTML = `
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> No publications found.
                </div>
            `;
            return;
        }

        let html = '<div class="row">';
        publications.forEach(pub => {
            const filename = pub.file.split('/').pop().replace('.pdf', '');
            const thumbnailPath = `thumbnails/${filename}_thumb.png`;
            
            html += `
                <div class="col-md-6 mb-3">
                    <div class="card">
                        <div class="row g-0">
                            <div class="col-md-4">
                                <img src="${thumbnailPath}" 
                                     class="img-fluid rounded-start" 
                                     alt="${pub.title} thumbnail"
                                     style="height: 120px; object-fit: cover; width: 100%;"
                                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDE1MCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik02NSA0MEg4NVY4MEg2NVY0MFoiIGZpbGw9IiNEQ0RDREMiLz4KPHBhdGggZD0iTTQ1IDYwSDU1VjgwSDQ1VjYwWiIgZmlsbD0iI0RDRENEQyIvPgo8cGF0aCBkPSJNMTAwIDYwSDExMFY4MEgxMDBWNjBaIiBmaWxsPSIjRENEQ0RDIi8+Cjx0ZXh0IHg9Ijc1IiB5PSIxMDUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiIGZvbnQtc2l6ZT0iMTAiPk5vIFByZXZpZXc8L3RleHQ+Cjwvc3ZnPgo='">">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h6 class="card-title">${pub.title}</h6>
                                    <p class="card-text">
                                        <small class="text-muted">
                                            <i class="fas fa-calendar"></i> ${pub.year} | 
                                            <i class="fas fa-folder"></i> ${pub.category}
                                        </small>
                                    </p>
                                    <div class="d-flex gap-2">
                                        <a href="http://localhost:8000/${pub.file}" target="_blank" class="btn btn-sm btn-outline-primary">
                                            <i class="fas fa-eye"></i> View
                                        </a>
                                        <button class="btn btn-sm btn-danger" onclick="uploader.deletePublication('${pub.title}', '${pub.file}')">
                                            <i class="fas fa-trash"></i> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        this.existingPublications.innerHTML = html;
    }

    async deletePublication(title, filename) {
        if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch('http://localhost:8001/delete-publication', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, filename })
            });

            const result = await response.json();
            
            if (response.ok) {
                this.showMessage(`Publication "${title}" deleted successfully!`, 'success');
                // Reload the publications list
                setTimeout(() => {
                    this.loadExistingPublications();
                    this.uploadStatus.innerHTML = '';
                }, 2000);
            } else {
                throw new Error(result.error || 'Failed to delete publication');
            }
        } catch (error) {
            this.showMessage(`Delete failed: ${error.message}`, 'error');
        }
    }

    resetForm() {
        this.files = [];
        this.uploadArea.style.display = 'block';
        this.uploadForm.style.display = 'none';
        this.fileForms.innerHTML = '';
        this.uploadStatus.innerHTML = '';
        this.fileInput.value = '';
        this.loadExistingPublications(); // Reload publications after upload
    }
}

// Initialize uploader when DOM is loaded
let uploader;
document.addEventListener('DOMContentLoaded', () => {
    uploader = new PublicationUploader();
});