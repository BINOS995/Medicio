// Publications Portal JavaScript
document.addEventListener('DOMContentLoaded', function() {
    let publications = [];
    let filteredPublications = [];

    // DOM elements
    const searchInput = document.getElementById('searchInput');
    const yearFilter = document.getElementById('yearFilter');
    const publicationsList = document.getElementById('publicationsList');
    const noResultsMessage = document.getElementById('noResults');

    // Load publications data
    async function loadPublications() {
        try {
            const response = await fetch('publications.json');
            publications = await response.json();
            filteredPublications = [...publications];
            populateYearFilter();
            renderPublications();
        } catch (error) {
            console.error('Error loading publications:', error);
            publicationsList.innerHTML = '<p class="text-center text-danger">Error loading publications. Please try again later.</p>';
        }
    }

    // Populate year filter dropdown
    function populateYearFilter() {
        const years = [...new Set(publications.map(pub => pub.year))].sort((a, b) => b - a);
        yearFilter.innerHTML = '<option value="">All Years</option>';
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearFilter.appendChild(option);
        });
    }

    // Render publications
    function renderPublications() {
        if (filteredPublications.length === 0) {
            publicationsList.innerHTML = '';
            noResultsMessage.style.display = 'block';
            return;
        }

        noResultsMessage.style.display = 'none';
        publicationsList.innerHTML = filteredPublications.map(publication => {
            const filename = publication.file.split('/').pop().replace('.pdf', '');
            const thumbnailPath = `thumbnails/${filename}_thumb.png`;
            
            return `
            <div class="publication-card" data-aos="fade-up" data-title="${publication.title}" data-filename="${publication.file.split('/').pop()}">
                <div class="card-header">
                    <h3 class="publication-title">${publication.title}</h3>
                    <div class="publication-meta">
                        <span class="year-badge">${publication.year}</span>
                        <span class="category-badge">${publication.category}</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <img src="${thumbnailPath}" 
                                 class="img-fluid rounded publication-thumbnail" 
                                 alt="${publication.title} thumbnail"
                                 style="width: 100%; height: 150px; object-fit: cover; border: 1px solid #ddd;"
                                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik00NSA2MEgxMDVWMTIwSDQ1VjYwWiIgZmlsbD0iI0RDRENEQyIvPgo8cGF0aCBkPSJNNTUgNzVNOTVWNTE1SDU1Vjc1WiIgZmlsbD0iIzk5OSIvPgo8dGV4dCB4PSI3NSIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjEwIj5QREYgUHJldmlldzwvdGV4dD4KPC9zdmc+Cg=='">
                        </div>
                        <div class="col-md-9">
                            <p class="publication-summary">${publication.summary}</p>
                        </div>
                    </div>
                </div>
                <div class="card-footer">
                    <a href="${publication.file}" class="btn btn-primary" target="_blank" rel="noopener">
                        <i class="bi bi-file-earmark-pdf"></i> View / Download PDF
                    </a>
                </div>
            </div>
            `;
        }).join('');
    }

    // Filter publications
    function filterPublications() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedYear = yearFilter.value;

        filteredPublications = publications.filter(publication => {
            const matchesSearch = publication.title.toLowerCase().includes(searchTerm) || 
                                publication.summary.toLowerCase().includes(searchTerm);
            const matchesYear = !selectedYear || publication.year.toString() === selectedYear;
            
            return matchesSearch && matchesYear;
        });

        renderPublications();
    }

    // Event listeners
    searchInput.addEventListener('input', filterPublications);
    yearFilter.addEventListener('change', filterPublications);

    // Initialize
    loadPublications();

    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});