<?php
/**
 * Class Validator
 * Xử lý validation dữ liệu
 */
class Validator {
    
    private static $errors = [];
    
    /**
     * Validate Email
     * @param string $email
     * @return bool
     */
    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
    
    /**
     * Validate Password
     * @param string $password
     * @return bool
     */
    public static function validatePassword($password) {
        if (strlen($password) < MIN_PASSWORD_LENGTH) {
            self::$errors['password'] = 'Mật khẩu phải có ít nhất ' . MIN_PASSWORD_LENGTH . ' ký tự';
            return false;
        }
        if (strlen($password) > MAX_PASSWORD_LENGTH) {
            self::$errors['password'] = 'Mật khẩu không được vượt quá ' . MAX_PASSWORD_LENGTH . ' ký tự';
            return false;
        }
        return true;
    }
    
    /**
     * Validate Name
     * @param string $name
     * @return bool
     */
    public static function validateName($name) {
        $name = trim($name);
        if (strlen($name) < MIN_NAME_LENGTH) {
            self::$errors['name'] = 'Tên phải có ít nhất ' . MIN_NAME_LENGTH . ' ký tự';
            return false;
        }
        if (strlen($name) > MAX_NAME_LENGTH) {
            self::$errors['name'] = 'Tên không được vượt quá ' . MAX_NAME_LENGTH . ' ký tự';
            return false;
        }
        return true;
    }
    
    /**
     * Validate Required Field
     * @param mixed $value
     * @param string $fieldName
     * @return bool
     */
    public static function required($value, $fieldName) {
        if (empty($value) || trim($value) === '') {
            self::$errors[$fieldName] = ucfirst($fieldName) . ' không được để trống';
            return false;
        }
        return true;
    }
    
    /**
     * Validate Match Fields
     * @param string $field1
     * @param string $field2
     * @param string $fieldName
     * @return bool
     */
    public static function match($field1, $field2, $fieldName = 'Xác nhận') {
        if ($field1 !== $field2) {
            self::$errors[$fieldName] = $fieldName . ' không khớp';
            return false;
        }
        return true;
    }
    
    /**
     * Validate Register Data
     * @param array $data
     * @return bool
     */
    public static function validateRegister($data) {
        self::$errors = [];
        
        // Validate Name
        if (!self::required($data['name'] ?? '', 'name')) {
            return false;
        }
        if (!self::validateName($data['name'])) {
            return false;
        }
        
        // Validate Email
        if (!self::required($data['email'] ?? '', 'email')) {
            return false;
        }
        if (!self::validateEmail($data['email'])) {
            self::$errors['email'] = 'Email không hợp lệ';
            return false;
        }
        
        // Validate Password
        if (!self::required($data['password'] ?? '', 'password')) {
            return false;
        }
        if (!self::validatePassword($data['password'])) {
            return false;
        }
        
        // Validate Password Confirm
        if (!self::required($data['password_confirm'] ?? '', 'password_confirm')) {
            return false;
        }
        if (!self::match($data['password'], $data['password_confirm'], 'password_confirm')) {
            self::$errors['password_confirm'] = 'Xác nhận mật khẩu không khớp';
            return false;
        }
        
        return true;
    }
    
    /**
     * Validate Login Data
     * @param array $data
     * @return bool
     */
    public static function validateLogin($data) {
        self::$errors = [];
        
        // Validate Email
        if (!self::required($data['email'] ?? '', 'email')) {
            return false;
        }
        if (!self::validateEmail($data['email'])) {
            self::$errors['email'] = 'Email không hợp lệ';
            return false;
        }
        
        // Validate Password
        if (!self::required($data['password'] ?? '', 'password')) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Get Errors
     * @return array
     */
    public static function getErrors() {
        return self::$errors;
    }
    
    /**
     * Has Errors
     * @return bool
     */
    public static function hasErrors() {
        return !empty(self::$errors);
    }
}
?>
