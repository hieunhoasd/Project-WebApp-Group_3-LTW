# LTWeb - Backend API Documentation

## 📋 Tổng Quan
Hệ thống Backend hoàn chỉnh cho LTWeb với các tính năng:
- ✓ Đăng ký (Register) với validation
- ✓ Đăng nhập (Login) với JWT token
- ✓ CRUD User đầy đủ
- ✓ Validation dữ liệu toàn diện
- ✓ Mã hóa mật khẩu BCRYPT
- ✓ Xử lý lỗi chuẩn

## 📁 Cấu Trúc Thư Mục
```
login/
├── api/
│   ├── login.php          # Login endpoint
│   ├── register.php       # Register endpoint
│   └── users.php          # CRUD User endpoint
├── class/
│   ├── Response.php       # Định dạng Response chuẩn
│   ├── Validator.php      # Validation logic
│   ├── User.php           # User Entity
│   └── UserRepository.php # CRUD operations
├── config/
│   └── config.php         # Database configuration
├── demo.php               # Demo API
└── logic.php              # (File chính)
```

## 🔐 1. REGISTER (Đăng Ký)

### Endpoint
```
POST /api/register.php
Content-Type: application/json
```

### Request
```json
{
    "name": "Nguyễn Văn A",
    "email": "user@example.com",
    "password": "password123",
    "password_confirm": "password123"
}
```

### Response Success (201)
```json
{
    "status": "success",
    "message": "Đăng ký thành công! Vui lòng đăng nhập",
    "data": {
        "id": 1,
        "name": "Nguyễn Văn A",
        "email": "user@example.com",
        "created_at": "2024-01-15 10:30:45",
        "updated_at": "2024-01-15 10:30:45"
    },
    "timestamp": "2024-01-15 10:30:45"
}
```

### Response Error - Validation (422)
```json
{
    "status": "error",
    "message": "Dữ liệu không hợp lệ",
    "errors": {
        "password": "Xác nhận mật khẩu không khớp"
    },
    "timestamp": "2024-01-15 10:30:45"
}
```

### Response Error - Email Exists (409)
```json
{
    "status": "error",
    "message": "Email đã được đăng ký",
    "errors": {
        "email": "Email này đã tồn tại trong hệ thống"
    },
    "timestamp": "2024-01-15 10:30:45"
}
```

### Validation Rules
- **name**: Bắt buộc, 3-50 ký tự
- **email**: Bắt buộc, định dạng email hợp lệ
- **password**: Bắt buộc, ít nhất 6 ký tự
- **password_confirm**: Bắt buộc, phải khớp với password

---

## 🔓 2. LOGIN (Đăng Nhập)

### Endpoint
```
POST /api/login.php
Content-Type: application/json
```

### Request
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

### Response Success (200)
```json
{
    "status": "success",
    "message": "Đăng nhập thành công",
    "data": {
        "id": 1,
        "name": "Nguyễn Văn A",
        "email": "user@example.com",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "login_at": "2024-01-15 10:35:20"
    },
    "timestamp": "2024-01-15 10:35:20"
}
```

### Response Error - Wrong Credentials (401)
```json
{
    "status": "error",
    "message": "Email hoặc mật khẩu không đúng",
    "timestamp": "2024-01-15 10:35:20"
}
```

### Validation Rules
- **email**: Bắt buộc, định dạng email hợp lệ
- **password**: Bắt buộc

### Token Info
- Format: JWT (JSON Web Token)
- Expiry: 24 giờ
- Sử dụng: Thêm vào header `Authorization: Bearer {token}`

---

## 👥 3. CRUD USER

### 3.1 Get All Users
```
GET /api/users.php?limit=10&offset=0
```

**Response (200)**
```json
{
    "status": "success",
    "message": "Lấy danh sách user thành công",
    "data": {
        "users": [
            {
                "id": 1,
                "name": "Nguyễn Văn A",
                "email": "user@example.com",
                "created_at": "2024-01-15 10:30:45",
                "updated_at": "2024-01-15 10:30:45"
            }
        ],
        "total": 1,
        "limit": 10,
        "offset": 0
    },
    "timestamp": "2024-01-15 10:40:00"
}
```

### 3.2 Get User by ID
```
GET /api/users.php/1
```

**Response (200)**
```json
{
    "status": "success",
    "message": "Lấy thông tin user thành công",
    "data": {
        "id": 1,
        "name": "Nguyễn Văn A",
        "email": "user@example.com",
        "created_at": "2024-01-15 10:30:45",
        "updated_at": "2024-01-15 10:30:45"
    },
    "timestamp": "2024-01-15 10:40:00"
}
```

**Response Error (404)**
```json
{
    "status": "error",
    "message": "User không tồn tại",
    "timestamp": "2024-01-15 10:40:00"
}
```

### 3.3 Create User
```
POST /api/users.php
Content-Type: application/json
```

**Request**
```json
{
    "name": "Trần Thị B",
    "email": "tranb@example.com",
    "password": "password123"
}
```

**Response (201)**
```json
{
    "status": "success",
    "message": "Tạo user thành công",
    "data": {
        "id": 2,
        "name": "Trần Thị B",
        "email": "tranb@example.com",
        "created_at": "2024-01-15 10:45:00",
        "updated_at": "2024-01-15 10:45:00"
    },
    "timestamp": "2024-01-15 10:45:00"
}
```

### 3.4 Update User
```
PUT /api/users.php/1
Content-Type: application/json
```

**Request** (cập nhật name và/hoặc email)
```json
{
    "name": "Nguyễn Văn A (Updated)",
    "email": "newemail@example.com"
}
```

**Response (200)**
```json
{
    "status": "success",
    "message": "Cập nhật user thành công",
    "data": {
        "id": 1,
        "name": "Nguyễn Văn A (Updated)",
        "email": "newemail@example.com",
        "created_at": "2024-01-15 10:30:45",
        "updated_at": "2024-01-15 10:50:00"
    },
    "timestamp": "2024-01-15 10:50:00"
}
```

### 3.5 Delete User
```
DELETE /api/users.php/1
```

**Response (200)**
```json
{
    "status": "success",
    "message": "Xóa user thành công",
    "data": {
        "id": 1
    },
    "timestamp": "2024-01-15 10:55:00"
}
```

---

## ✅ Validation Rules

### Email
- Bắt buộc
- Phải định dạng hợp lệ (user@domain.com)
- Duy nhất trong database

### Password
- Bắt buộc khi register/create
- Tối thiểu 6 ký tự
- Tối đa 50 ký tự
- Được mã hóa bằng BCRYPT

### Name
- Bắt buộc
- Tối thiểu 3 ký tự
- Tối đa 50 ký tự

---

## 🔒 Security Features

1. **Password Hashing**: BCRYPT với cost = 10
2. **Input Validation**: Kiểm tra tất cả input trước khi xử lý
3. **Prepared Statements**: Chống SQL Injection
4. **JWT Token**: Cho phép authentication
5. **CORS Headers**: Cho phép truy cập từ các domain khác
6. **Error Handling**: Xử lý lỗi toàn diện

---

## 📝 Fake Data

Hệ thống cung cấp fake data cho test:

```php
User::generateFakeData(5);
```

Output:
```
ID | Name | Email | Password Hash
1  | Nguyễn Văn A | user1@example.com | hash...
2  | Trần Thị B | user2@example.com | hash...
3  | Phạm Minh C | user3@example.com | hash...
4  | Đoàn Hồng D | user4@example.com | hash...
5  | Vũ Thế E | user5@example.com | hash...
```

---

## 🛠️ Setup Database

Chạy lại bất kỳ API nào, bảng `users` sẽ tự động được tạo:

```sql
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) UNIQUE NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
```

---

## 📦 Dependencies
- PHP 7.0+
- MySQL/MariaDB
- Không cần thư viện bên ngoài

---

## ✨ Features
- ✅ Đăng ký với validation đầy đủ
- ✅ Đăng nhập với JWT token
- ✅ CRUD User hoàn chỉnh
- ✅ Mã hóa mật khẩu an toàn (BCRYPT)
- ✅ Response format chuẩn
- ✅ Validation toàn diện
- ✅ Error handling tốt
- ✅ CORS support
- ✅ Fake data generator
- ✅ Auto-create database table

---

## 🚀 Testing

Sử dụng Postman, cURL hoặc bất kỳ HTTP client nào:

```bash
# Register
curl -X POST http://localhost/LTWeb/login/api/register.php \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","password_confirm":"password123"}'

# Login
curl -X POST http://localhost/LTWeb/login/api/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get All Users
curl -X GET "http://localhost/LTWeb/login/api/users.php?limit=10&offset=0"

# Get User by ID
curl -X GET "http://localhost/LTWeb/login/api/users.php/1"

# Create User
curl -X POST http://localhost/LTWeb/login/api/users.php \
  -H "Content-Type: application/json" \
  -d '{"name":"New User","email":"newuser@example.com","password":"password123"}'

# Update User
curl -X PUT http://localhost/LTWeb/login/api/users.php/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'

# Delete User
curl -X DELETE http://localhost/LTWeb/login/api/users.php/1
```

---

**Version**: 1.0.0  
**Last Updated**: 2024-01-15  
**Author**: Backend Development Team
