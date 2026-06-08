<?php
/**
 * Project Structure Summary
 * Chứa hướng dẫn sử dụng hệ thống
 */
?>

# 📚 LTWeb Backend - Project Structure

## ✅ Đã Hoàn Thành

### 1️⃣ Format Response (Response.php)
- ✅ Success response format
- ✅ Error response format
- ✅ Validation error response
- ✅ Unauthorized, Forbidden, Not Found responses

### 2️⃣ Entity & Fake Data (User.php)
- ✅ User Entity class với properties
- ✅ Password hashing (BCRYPT)
- ✅ Password verification
- ✅ toArray() method
- ✅ generateFakeData() method

### 3️⃣ Login Logic (api/login.php) ⭐
**Validation Rules:**
- Email: Bắt buộc, định dạng email
- Password: Bắt buộc

**Response:**
```json
{
    "status": "success",
    "message": "Đăng nhập thành công",
    "data": {
        "id": 1,
        "name": "User Name",
        "email": "user@example.com",
        "token": "jwt_token...",
        "login_at": "2024-01-15 10:30:00"
    }
}
```

### 4️⃣ Register Logic (api/register.php) ⭐
**Validation Rules:**
- Name: 3-50 ký tự
- Email: Định dạng hợp lệ, duy nhất
- Password: ≥6 ký tự, ≤50 ký tự
- Password Confirm: Phải khớp

**Response:**
```json
{
    "status": "success",
    "message": "Đăng ký thành công",
    "data": {
        "id": 1,
        "name": "User Name",
        "email": "user@example.com",
        "created_at": "2024-01-15 10:30:00"
    }
}
```

### 5️⃣ CRUD User (api/users.php)
- ✅ GET /users.php - Lấy tất cả
- ✅ GET /users.php/{id} - Lấy theo ID
- ✅ POST /users.php - Tạo mới
- ✅ PUT /users.php/{id} - Cập nhật
- ✅ DELETE /users.php/{id} - Xóa

### 6️⃣ Validation (class/Validator.php)
- ✅ validateEmail()
- ✅ validatePassword()
- ✅ validateName()
- ✅ required()
- ✅ match()
- ✅ validateRegister()
- ✅ validateLogin()
- ✅ getErrors()
- ✅ hasErrors()

## 📁 File Structure

```
login/
├── api/
│   ├── login.php           # Login endpoint
│   ├── register.php        # Register endpoint  
│   └── users.php           # CRUD User endpoint
│
├── class/
│   ├── Response.php        # Response format
│   ├── Validator.php       # Validation logic
│   ├── User.php            # User Entity
│   ├── UserRepository.php  # CRUD operations
│   └── Auth.php            # Auth helpers
│
├── config/
│   └── config.php          # Database config
│
├── test.html               # Web-based API Tester
├── demo.php                # API Demo
├── README.md               # Documentation
└── STRUCTURE.php           # This file
```

## 🚀 Quick Start

### 1. Database Setup
Database và table sẽ tự động tạo khi chạy lần đầu.

### 2. Register New User
```bash
curl -X POST http://localhost/LTWeb/login/api/register.php \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "password_confirm": "password123"
  }'
```

### 3. Login
```bash
curl -X POST http://localhost/LTWeb/login/api/login.php \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. Get Token & Use in Requests
Response từ login chứa `token`. Sử dụng để yêu cầu protected:
```bash
curl -X GET http://localhost/LTWeb/login/api/users.php/1 \
  -H "Authorization: Bearer {token}"
```

## 🔧 Configuration

File: `config/config.php`
```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'ltweb');
```

## 📊 Database Schema

```sql
CREATE TABLE `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);
```

## 🛡️ Security Features

1. **Password Hashing**: BCRYPT (cost=10)
2. **Input Validation**: Tất cả input được validate
3. **Prepared Statements**: Chống SQL Injection
4. **JWT Token**: Token hết hạn sau 24 giờ
5. **Error Handling**: Xử lý lỗi toàn diện
6. **CORS Support**: Cho phép cross-origin requests

## 📱 Testing

### Option 1: Web UI
Mở file `test.html` trong trình duyệt để test tất cả endpoints.

### Option 2: Postman
Import các requests vào Postman hoặc tương tự.

### Option 3: cURL
Sử dụng các lệnh cURL được cung cấp trong README.md

### Option 4: PHP
```php
require 'config/config.php';
require 'class/UserRepository.php';

$userRepo = new UserRepository($conn);
$users = $userRepo->getAll();
```

## 🎯 API Response Format

### Success (2xx)
```json
{
    "status": "success",
    "message": "Thông báo thành công",
    "data": { /* data */ },
    "timestamp": "2024-01-15 10:30:00"
}
```

### Validation Error (422)
```json
{
    "status": "error",
    "message": "Dữ liệu không hợp lệ",
    "errors": {
        "email": "Email không hợp lệ",
        "password": "Mật khẩu quá ngắn"
    },
    "timestamp": "2024-01-15 10:30:00"
}
```

### Error (4xx, 5xx)
```json
{
    "status": "error",
    "message": "Thông báo lỗi",
    "errors": null,
    "timestamp": "2024-01-15 10:30:00"
}
```

## 💡 Usage Examples

### Example 1: Toàn bộ Flow Register → Login → Get User

```javascript
// Step 1: Register
const registerRes = await fetch('/api/register.php', {
    method: 'POST',
    body: JSON.stringify({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        password_confirm: 'password123'
    })
});

// Step 2: Login
const loginRes = await fetch('/api/login.php', {
    method: 'POST',
    body: JSON.stringify({
        email: 'john@example.com',
        password: 'password123'
    })
});
const loginData = await loginRes.json();
const token = loginData.data.token;

// Step 3: Get User
const userRes = await fetch('/api/users.php/1', {
    headers: { 'Authorization': `Bearer ${token}` }
});
```

### Example 2: CRUD Operations

```javascript
// Create
const createRes = await fetch('/api/users.php', {
    method: 'POST',
    body: JSON.stringify({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123'
    })
});

// Read
const readRes = await fetch('/api/users.php/1');

// Update
const updateRes = await fetch('/api/users.php/1', {
    method: 'PUT',
    body: JSON.stringify({
        name: 'Jane Updated'
    })
});

// Delete
const deleteRes = await fetch('/api/users.php/1', {
    method: 'DELETE'
});
```

## 📝 Notes

- Tất cả endpoint đều trả về JSON
- Token JWT hết hạn sau 24 giờ
- Email phải duy nhất trong hệ thống
- Mật khẩu được mã hóa bằng BCRYPT
- Không lưu mật khẩu plain text
- CORS được kích hoạt cho tất cả endpoint

## 🐛 Troubleshooting

**Issue: Database connection failed**
- Kiểm tra kết nối MySQL
- Kiểm tra credentials trong config.php
- Đảm bảo database `ltweb` tồn tại

**Issue: Email already exists**
- Email phải duy nhất
- Thử email khác khi register

**Issue: Token expired**
- Đăng nhập lại để lấy token mới
- Token hết hạn sau 24 giờ

**Issue: CORS error**
- CORS headers đã được cấu hình
- Kiểm tra browser console untuk chi tiết

## 📞 Support

Tất cả API endpoint đều có response format chuẩn.
Kiểm tra status code và message để debug.

---
**Version**: 1.0.0  
**Last Updated**: 2024-01-15  
**Status**: ✅ Production Ready
