<?php
/**
 * Login API
 * POST /api/login
 * 
 * Request:
 * {
 *     "email": "user@example.com",
 *     "password": "password123"
 * }
 * 
 * Response:
 * {
 *     "status": "success",
 *     "message": "Đăng nhập thành công",
 *     "data": {
 *         "id": 1,
 *         "name": "Nguyễn Văn A",
 *         "email": "user@example.com",
 *         "token": "jwt_token_here"
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
if (!Validator::validateLogin($input)) {
    echo json_encode(Response::validationError(Validator::getErrors()));
    exit;
}

// Get User Repository
$userRepo = new UserRepository($conn);

// Find User by Email
$user = $userRepo->getByEmail($input['email']);

// Check User Exists
if (!$user) {
    echo json_encode(Response::error('Email hoặc mật khẩu không đúng', null, 401));
    exit;
}

// Verify Password
if (!User::verifyPassword($input['password'], $user->password)) {
    echo json_encode(Response::error('Email hoặc mật khẩu không đúng', null, 401));
    exit;
}

// Login Success - Generate Token (Simple JWT)
$token = generateSimpleToken($user);

// Prepare Response Data
$responseData = [
    'id' => $user->id,
    'name' => $user->name,
    'email' => $user->email,
    'token' => $token,
    'login_at' => date('Y-m-d H:i:s')
];

// Return Success Response
echo json_encode(Response::success($responseData, 'Đăng nhập thành công', 200));
exit;

/**
 * Generate Simple JWT Token
 * Trong thực tế, nên sử dụng thư viện JWT chuyên dụng
 */
function generateSimpleToken($user) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'id' => $user->id,
        'email' => $user->email,
        'name' => $user->name,
        'iat' => time(),
        'exp' => time() + (24 * 60 * 60) // Token hết hạn sau 24 giờ
    ]);
    
    $base64UrlHeader = rtrim(strtr(base64_encode($header), '+/', '-_'), '=');
    $base64UrlPayload = rtrim(strtr(base64_encode($payload), '+/', '-_'), '=');
    
    $signature = hash_hmac('sha256', $base64UrlHeader . '.' . $base64UrlPayload, JWT_SECRET, true);
    $base64UrlSignature = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');
    
    return $base64UrlHeader . '.' . $base64UrlPayload . '.' . $base64UrlSignature;
}
?>
