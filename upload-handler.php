<?php
// Simple upload handler for development
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Handle file upload
if (isset($_FILES['file']) && isset($_POST['filename'])) {
    $uploadDir = __DIR__ . '/pdfs/';
    
    // Create pdfs directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    $filename = basename($_POST['filename']);
    $targetPath = $uploadDir . $filename;
    
    // Validate file type
    $allowedTypes = ['application/pdf'];
    if (!in_array($_FILES['file']['type'], $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Only PDF files are allowed']);
        exit;
    }
    
    // Validate file size (10MB max)
    if ($_FILES['file']['size'] > 10 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(['error' => 'File size exceeds 10MB limit']);
        exit;
    }
    
    // Move uploaded file
    if (move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
        echo json_encode(['success' => true, 'filename' => $filename]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to move uploaded file']);
    }
    exit;
}

// Handle publications.json update
if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data']);
        exit;
    }
    
    $jsonPath = __DIR__ . '/publications.json';
    
    if (file_put_contents($jsonPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES))) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to update publications.json']);
    }
    exit;
}

http_response_code(400);
echo json_encode(['error' => 'Invalid request']);
?>