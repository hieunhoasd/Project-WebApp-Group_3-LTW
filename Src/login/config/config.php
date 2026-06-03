<?php
// Database Configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'ltweb');

// API Response
define('API_SUCCESS', 'success');
define('API_ERROR', 'error');

// Validation Rules
define('MIN_PASSWORD_LENGTH', 6);
define('MAX_PASSWORD_LENGTH', 50);
define('MIN_NAME_LENGTH', 3);
define('MAX_NAME_LENGTH', 50);

// Connect to Database
try {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        die(json_encode([
            'status' => API_ERROR,
            'message' => 'Kết nối database thất bại: ' . $conn->connect_error
        ]));
    }
    
    $conn->set_charset("utf8");
} catch (Exception $e) {
    die(json_encode([
        'status' => API_ERROR,
        'message' => 'Lỗi: ' . $e->getMessage()
    ]));
}
?>
