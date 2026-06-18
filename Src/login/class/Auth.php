<?php
/**
 * Auth Helper Functions
 * Hỗ trợ authentication trong các trang khác
 */

/**
 * Check if Token is Valid
 * @param string $token
 * @return bool|array
 */
function verifyToken($token) {
    if (!$token) {
        return false;
    }
    
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return false;
    }
    
    // Verify Signature
    $header = $parts[0];
    $payload = $parts[1];
    $signature = $parts[2];
    
    $expectedSignature = hash_hmac('sha256', $header . '.' . $payload, JWT_SECRET, true);
    $expectedSignature = rtrim(strtr(base64_encode($expectedSignature), '+/', '-_'), '=');
    
    if ($signature !== $expectedSignature) {
        return false;
    }
    
    // Decode Payload
    $payload = base64_decode(strtr($payload, '-_', '+/'));
    $decoded = json_decode($payload, true);
    
    // Check Expiration
    if (isset($decoded['exp']) && $decoded['exp'] < time()) {
        return false;
    }
    
    return $decoded;
}

/**
 * Get Bearer Token from Headers
 * @return string|null
 */
function getBearerToken() {
    $headers = getallheaders();
    
    if (!isset($headers['Authorization'])) {
        return null;
    }
    
    $authHeader = $headers['Authorization'];
    if (preg_match('/Bearer\s+(\S+)/', $authHeader, $matches)) {
        return $matches[1];
    }
    
    return null;
}

/**
 * Require Authentication
 * @return array|false
 */
function requireAuth() {
    $token = getBearerToken();
    
    if (!$token) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Token không tồn tại',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit;
    }
    
    $user = verifyToken($token);
    
    if (!$user) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Token không hợp lệ hoặc hết hạn',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
        exit;
    }
    
    return $user;
}

/**
 * Get Current User from Token
 * @return array|null
 */
function getCurrentUser() {
    $token = getBearerToken();
    
    if (!$token) {
        return null;
    }
    
    return verifyToken($token);
}

/**
 * Check User Permission
 * @param int $userId
 * @param int $resourceUserId
 * @return bool
 */
function checkPermission($userId, $resourceUserId) {
    return $userId == $resourceUserId;
}
?>
