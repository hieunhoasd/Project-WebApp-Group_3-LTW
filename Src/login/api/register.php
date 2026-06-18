<?php
/**
 * Register API
 * POST /api/register
 * 
 * Request:
 * {
 *     "name": "Nguyễn Văn A",
 *     "email": "user@example.com",
 *     "password": "password123",
 *     "password_confirm": "password123"
 * }
 * 
 * Response:
 * {
 *     "status": "success",
 *     "message": "Đăng ký thành công",
 *     "data": {
 *         "id": 1,
 *         "name": "Nguyễn Văn A",
 *         "email": "user@example.com",
 *         "created_at": "2024-01-15 10:30:45"
 *     }
 * }
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200); exit;
}

// Load Config & Classes
require_once '../config/config.php';
require_once '../class/Response.php';
require_once '../class/Validator.php';
require_once '../class/User.php';
require_once '../class/UserRepository.php';

// Check Request Method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(Response::error('Phương thức không được hỗ trợ', null, 405));
    exit;
}

// Get Request Data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(Response::error('Dữ liệu không hợp lệ', null, 400));
    exit;
}

// Validate Input
if (!Validator::validateRegister($input)) {
    echo json_encode(Response::validationError(Validator::getErrors()));
    exit;
}

// Get User Repository
$userRepo = new UserRepository($conn);

// Create Table nếu chưa tồn tại
$userRepo->createTable();

// Check Email Exists
if ($userRepo->emailExists($input['email'])) {
    echo json_encode(Response::error('Email đã được đăng ký', ['email' => 'Email này đã tồn tại trong hệ thống'], 409));
    exit;
}

// Create New User
$user = new User(
    $input['name'],
    $input['email'],
    User::hashPassword($input['password'])
);

// Insert User to Database
$userId = $userRepo->create($user);

if (!$userId) {
    echo json_encode(Response::error('Có lỗi xảy ra khi đăng ký', null, 500));
    exit;
}

// Retrieve Created User
$createdUser = $userRepo->getById($userId);

// Return Success Response
echo json_encode(Response::success(
    $createdUser->toArray(),
    'Đăng ký thành công! Vui lòng đăng nhập',
    201
));
exit;
?>
