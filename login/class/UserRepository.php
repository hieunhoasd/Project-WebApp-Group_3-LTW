<?php
/**
 * Class UserRepository
 * CRUD Operations cho User
 */
class UserRepository {
    
    private $conn;
    private $table = 'users';
    
    /**
     * Constructor
     * @param mysqli $conn
     */
    public function __construct($conn) {
        $this->conn = $conn;
    }
    
    /**
     * Create Database Table
     */
    public function createTable() {
        $sql = "CREATE TABLE IF NOT EXISTS `users` (
            `id` INT AUTO_INCREMENT PRIMARY KEY,
            `name` VARCHAR(50) NOT NULL,
            `email` VARCHAR(100) UNIQUE NOT NULL,
            `password` VARCHAR(255) NOT NULL,
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        if (!$this->conn->query($sql)) {
            return false;
        }
        return true;
    }
    
    /**
     * Create (Insert) User
     * @param User $user
     * @return int|false
     */
    public function create(User $user) {
        $sql = "INSERT INTO `" . $this->table . "` (name, email, password, created_at, updated_at) 
                VALUES (?, ?, ?, ?, ?)";
        
        $stmt = $this->conn->prepare($sql);
        
        if (!$stmt) {
            return false;
        }
        
        $stmt->bind_param(
            'sssss',
            $user->name,
            $user->email,
            $user->password,
            $user->created_at,
            $user->updated_at
        );
        
        if ($stmt->execute()) {
            $stmt->close();
            return $this->conn->insert_id;
        }
        
        $stmt->close();
        return false;
    }
    
    /**
     * Read (Get) User by ID
     * @param int $id
     * @return User|null
     */
    public function getById($id) {
        $sql = "SELECT * FROM `" . $this->table . "` WHERE id = ?";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('i', $id);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $stmt->close();
        
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            return $this->mapToUser($row);
        }
        
        return null;
    }
    
    /**
     * Get User by Email
     * @param string $email
     * @return User|null
     */
    public function getByEmail($email) {
        $sql = "SELECT * FROM `" . $this->table . "` WHERE email = ?";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('s', $email);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $stmt->close();
        
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            return $this->mapToUser($row);
        }
        
        return null;
    }
    
    /**
     * Get All Users
     * @param int $limit
     * @param int $offset
     * @return array
     */
    public function getAll($limit = 10, $offset = 0) {
        $sql = "SELECT * FROM `" . $this->table . "` LIMIT ? OFFSET ?";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('ii', $limit, $offset);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $stmt->close();
        
        $users = [];
        while ($row = $result->fetch_assoc()) {
            $users[] = $this->mapToUser($row);
        }
        
        return $users;
    }
    
    /**
     * Update User
     * @param int $id
     * @param User $user
     * @return bool
     */
    public function update($id, User $user) {
        $sql = "UPDATE `" . $this->table . "` 
                SET name = ?, email = ?, updated_at = ? 
                WHERE id = ?";
        
        $stmt = $this->conn->prepare($sql);
        
        if (!$stmt) {
            return false;
        }
        
        $user->updated_at = date('Y-m-d H:i:s');
        $stmt->bind_param('sssi', $user->name, $user->email, $user->updated_at, $id);
        
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Delete User
     * @param int $id
     * @return bool
     */
    public function delete($id) {
        $sql = "DELETE FROM `" . $this->table . "` WHERE id = ?";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('i', $id);
        
        $result = $stmt->execute();
        $stmt->close();
        
        return $result;
    }
    
    /**
     * Check Email Exists
     * @param string $email
     * @return bool
     */
    public function emailExists($email) {
        $sql = "SELECT id FROM `" . $this->table . "` WHERE email = ?";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param('s', $email);
        $stmt->execute();
        
        $result = $stmt->get_result();
        $stmt->close();
        
        return $result->num_rows > 0;
    }
    
    /**
     * Get Total Count
     * @return int
     */
    public function getTotalCount() {
        $result = $this->conn->query("SELECT COUNT(*) as total FROM `" . $this->table . "`");
        $row = $result->fetch_assoc();
        return $row['total'];
    }
    
    /**
     * Map Row to User Object
     * @param array $row
     * @return User
     */
    private function mapToUser($row) {
        $user = new User();
        $user->id = $row['id'];
        $user->name = $row['name'];
        $user->email = $row['email'];
        $user->password = $row['password'];
        $user->created_at = $row['created_at'];
        $user->updated_at = $row['updated_at'];
        return $user;
    }
}
?>
