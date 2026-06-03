<?php
/**
 * Class Response
 * Định dạng Response chuẩn cho API
 */
class Response {
    
    /**
     * Success Response
     * @param mixed $data - Dữ liệu trả về
     * @param string $message - Thông báo
     * @param int $code - HTTP Status Code
     */
    public static function success($data = null, $message = 'Thành công', $code = 200) {
        http_response_code($code);
        return [
            'status' => 'success',
            'message' => $message,
            'data' => $data,
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
    
    /**
     * Error Response
     * @param string $message - Thông báo lỗi
     * @param mixed $errors - Chi tiết lỗi
     * @param int $code - HTTP Status Code
     */
    public static function error($message = 'Có lỗi xảy ra', $errors = null, $code = 400) {
        http_response_code($code);
        return [
            'status' => 'error',
            'message' => $message,
            'errors' => $errors,
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
    
    /**
     * Validation Error Response
     * @param array $errors - Danh sách lỗi validation
     */
    public static function validationError($errors) {
        http_response_code(422);
        return [
            'status' => 'error',
            'message' => 'Dữ liệu không hợp lệ',
            'errors' => $errors,
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
    
    /**
     * Unauthorized Response
     */
    public static function unauthorized($message = 'Chưa xác thực') {
        http_response_code(401);
        return [
            'status' => 'error',
            'message' => $message,
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
    
    /**
     * Forbidden Response
     */
    public static function forbidden($message = 'Không có quyền truy cập') {
        http_response_code(403);
        return [
            'status' => 'error',
            'message' => $message,
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
    
    /**
     * Not Found Response
     */
    public static function notFound($message = 'Không tìm thấy') {
        http_response_code(404);
        return [
            'status' => 'error',
            'message' => $message,
            'timestamp' => date('Y-m-d H:i:s')
        ];
    }
}
?>
