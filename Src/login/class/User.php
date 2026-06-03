<?php
/**
 * Class User
 * Entity User
 */
class User {
    
    public $id;
    public $name;
    public $email;
    public $password;
    public $created_at;
    public $updated_at;
    
    /**
     * Constructor
     */
    public function __construct($name = '', $email = '', $password = '') {
        $this->name = $name;
        $this->email = $email;
        $this->password = $password;
        $this->created_at = date('Y-m-d H:i:s');
        $this->updated_at = date('Y-m-d H:i:s');
    }
    
    /**
     * Hash Password
     * @param string $password
     * @return string
     */
    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 10]);
    }
    
    /**
     * Verify Password
     * @param string $password
     * @param string $hash
     * @return bool
     */
    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }
    
    /**
     * Convert to Array
     * @return array
     */
    public function toArray() {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
    
    /**
     * Fake Data
     * @param int $count
     * @return array
     */
    public static function generateFakeData($count = 5) {
        $fakeUsers = [];
        $names = ['Nguyễn Văn A', 'Trần Thị B', 'Phạm Minh C', 'Đoàn Hồng D', 'Vũ Thế E'];
        
        for ($i = 1; $i <= $count; $i++) {
            $user = new User();
            $user->id = $i;
            $user->name = $names[$i - 1];
            $user->email = 'user' . $i . '@example.com';
            $user->password = self::hashPassword('password123');
            $fakeUsers[] = $user->toArray();
        }
        
        return $fakeUsers;
    }
}
?>
