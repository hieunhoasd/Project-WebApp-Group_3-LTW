<?php
/**
 * Test & Demo API
 * File để test tất cả API endpoints
 */

header('Content-Type: application/json; charset=utf-8');

require_once 'config/config.php';
require_once 'class/User.php';
require_once 'class/UserRepository.php';

$userRepo = new UserRepository($conn);

// Create table
$userRepo->createTable();

echo json_encode([
    'title' => 'LTWeb - Backend API Demo',
    'version' => '1.0.0',
    'endpoints' => [
        'register' => [
            'method' => 'POST',
            'url' => '/api/register.php',
            'description' => 'Đăng ký tài khoản mới',
            'body' => [
                'name' => 'string (bắt buộc, 3-50 ký tự)',
                'email' => 'string (bắt buộc, định dạng email)',
                'password' => 'string (bắt buộc, ít nhất 6 ký tự)',
                'password_confirm' => 'string (bắt buộc, khớp với password)'
            ]
        ],
        'login' => [
            'method' => 'POST',
            'url' => '/api/login.php',
            'description' => 'Đăng nhập',
            'body' => [
                'email' => 'string (bắt buộc)',
                'password' => 'string (bắt buộc)'
            ]
        ],
        'get_all_users' => [
            'method' => 'GET',
            'url' => '/api/users.php?limit=10&offset=0',
            'description' => 'Lấy danh sách tất cả user',
            'params' => [
                'limit' => 'int (tùy chọn, mặc định 10)',
                'offset' => 'int (tùy chọn, mặc định 0)'
            ]
        ],
        'get_user' => [
            'method' => 'GET',
            'url' => '/api/users.php/{id}',
            'description' => 'Lấy thông tin user theo ID',
            'params' => [
                'id' => 'int (bắt buộc)'
            ]
        ],
        'create_user' => [
            'method' => 'POST',
            'url' => '/api/users.php',
            'description' => 'Tạo user mới',
            'body' => [
                'name' => 'string (bắt buộc)',
                'email' => 'string (bắt buộc)',
                'password' => 'string (bắt buộc)'
            ]
        ],
        'update_user' => [
            'method' => 'PUT',
            'url' => '/api/users.php/{id}',
            'description' => 'Cập nhật thông tin user',
            'body' => [
                'name' => 'string (tùy chọn)',
                'email' => 'string (tùy chọn)'
            ]
        ],
        'delete_user' => [
            'method' => 'DELETE',
            'url' => '/api/users.php/{id}',
            'description' => 'Xóa user'
        ]
    ],
    'fake_data' => User::generateFakeData(),
    'features' => [
        '✓ Đăng ký với validation',
        '✓ Đăng nhập với JWT token',
        '✓ CRUD User đầy đủ',
        '✓ Validation dữ liệu',
        '✓ Mã hóa mật khẩu BCRYPT',
        '✓ Xử lý lỗi toàn diện'
    ]
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>