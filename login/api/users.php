<?php
/**
 * CRUD User API
 * GET /api/users - Lấy danh sách user
 * POST /api/users - Tạo user mới
 * GET /api/users/{id} - Lấy thông tin user
 * PUT /api/users/{id} - Cập nhật user
 * DELETE /api/users/{id} - Xóa user
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Load Config & Classes
require_once '../config/config.php';
require_once '../class/Response.php';
require_once '../class/Validator.php';
require_once '../class/User.php';
require_once '../class/UserRepository.php';

$method = $_SERVER['REQUEST_METHOD'];
$userRepo = new UserRepository($conn);

// Ensure table exists
$userRepo->createTable();

// Parse URL to get ID if present
$pathInfo = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$segments = explode('/', $pathInfo);
$id = isset($segments[count($segments) - 1]) && is_numeric($segments[count($segments) - 1]) 
    ? (int)$segments[count($segments) - 1] 
    : null;

try {
    switch ($method) {
        // Get All Users
        case 'GET':
            if ($id) {
                // Get Single User
                handleGetUser($id, $userRepo);
            } else {
                // Get All Users
                handleGetAllUsers($userRepo);
            }
            break;
        
        // Create User
        case 'POST':
            handleCreateUser($userRepo);
            break;
        
        // Update User
        case 'PUT':
            if (!$id) {
                echo json_encode(Response::error('ID không hợp lệ', null, 400));
                exit;
            }
            handleUpdateUser($id, $userRepo);
            break;
        
        // Delete User
        case 'DELETE':
            if (!$id) {
                echo json_encode(Response::error('ID không hợp lệ', null, 400));
                exit;
            }
            handleDeleteUser($id, $userRepo);
            break;
        
        case 'OPTIONS':
            http_response_code(200);
            exit;
        
        default:
            echo json_encode(Response::error('Phương thức không được hỗ trợ', null, 405));
            break;
    }
} catch (Exception $e) {
    echo json_encode(Response::error('Lỗi: ' . $e->getMessage(), null, 500));
}

/**
 * Handle GET All Users
 */
function handleGetAllUsers($userRepo) {
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
    
    $users = $userRepo->getAll($limit, $offset);
    $total = $userRepo->getTotalCount();
    
    $userData = array_map(function($user) {
        return $user->toArray();
    }, $users);
    
    echo json_encode(Response::success([
        'users' => $userData,
        'total' => $total,
        'limit' => $limit,
        'offset' => $offset
    ], 'Lấy danh sách user thành công'));
}

/**
 * Handle GET Single User
 */
function handleGetUser($id, $userRepo) {
    $user = $userRepo->getById($id);
    
    if (!$user) {
        echo json_encode(Response::notFound('User không tồn tại'));
        exit;
    }
    
    echo json_encode(Response::success($user->toArray(), 'Lấy thông tin user thành công'));
}

/**
 * Handle Create User
 */
function handleCreateUser($userRepo) {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate Input
    if (!isset($input['name']) || !isset($input['email']) || !isset($input['password'])) {
        echo json_encode(Response::error('Dữ liệu không hợp lệ', [
            'required' => ['name', 'email', 'password']
        ], 400));
        exit;
    }
    
    // Check Email Exists
    if ($userRepo->emailExists($input['email'])) {
        echo json_encode(Response::error('Email đã tồn tại', ['email' => 'Email này đã được đăng ký'], 409));
        exit;
    }
    
    // Create User
    $user = new User(
        $input['name'],
        $input['email'],
        User::hashPassword($input['password'])
    );
    
    $userId = $userRepo->create($user);
    
    if (!$userId) {
        echo json_encode(Response::error('Lỗi khi tạo user', null, 500));
        exit;
    }
    
    $createdUser = $userRepo->getById($userId);
    echo json_encode(Response::success($createdUser->toArray(), 'Tạo user thành công', 201));
}

/**
 * Handle Update User
 */
function handleUpdateUser($id, $userRepo) {
    $user = $userRepo->getById($id);
    
    if (!$user) {
        echo json_encode(Response::notFound('User không tồn tại'));
        exit;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate Name
    if (isset($input['name'])) {
        if (!Validator::validateName($input['name'])) {
            echo json_encode(Response::validationError(Validator::getErrors()));
            exit;
        }
        $user->name = $input['name'];
    }
    
    // Validate Email (check if not already in use)
    if (isset($input['email']) && $input['email'] !== $user->email) {
        if (!Validator::validateEmail($input['email'])) {
            echo json_encode(Response::error('Email không hợp lệ', ['email' => 'Email không hợp lệ'], 400));
            exit;
        }
        if ($userRepo->emailExists($input['email'])) {
            echo json_encode(Response::error('Email đã tồn tại', ['email' => 'Email này đã được đăng ký'], 409));
            exit;
        }
        $user->email = $input['email'];
    }
    
    // Update User
    if ($userRepo->update($id, $user)) {
        $updatedUser = $userRepo->getById($id);
        echo json_encode(Response::success($updatedUser->toArray(), 'Cập nhật user thành công'));
    } else {
        echo json_encode(Response::error('Lỗi khi cập nhật user', null, 500));
    }
}

/**
 * Handle Delete User
 */
function handleDeleteUser($id, $userRepo) {
    $user = $userRepo->getById($id);
    
    if (!$user) {
        echo json_encode(Response::notFound('User không tồn tại'));
        exit;
    }
    
    if ($userRepo->delete($id)) {
        echo json_encode(Response::success(['id' => $id], 'Xóa user thành công'));
    } else {
        echo json_encode(Response::error('Lỗi khi xóa user', null, 500));
    }
}
?>
