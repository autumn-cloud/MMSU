<?php
/**
 * Test Admin Login Credentials
 * Run this file to verify your admin credentials are working
 * Access via: http://localhost/university-apparel-api/test-admin.php
 */

require_once __DIR__ . '/bootstrap.php';

$email = $_GET['email'] ?? 'admin@mmsu.edu.ph';
$password = $_GET['password'] ?? 'admin123';

echo "<h2>Testing Admin Login</h2>";
echo "<p>Testing with email: <strong>$email</strong></p>";
echo "<p>Testing with password: <strong>$password</strong></p>";
echo "<hr>";

try {
    // Check if admin exists
    $stmt = $pdo->prepare('SELECT id, email, password_hash FROM admins WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$admin) {
        echo "<p style='color: red;'>❌ ERROR: No admin found with email: $email</p>";
        echo "<p>Please check:</p>";
        echo "<ul>";
        echo "<li>The email is exactly: <code>admin@mmsu.edu.ph</code> (case-sensitive)</li>";
        echo "<li>The admin record exists in the database</li>";
        echo "</ul>";
        exit;
    }
    
    echo "<p style='color: green;'>✅ Admin record found!</p>";
    echo "<p>Admin ID: " . htmlspecialchars($admin['id']) . "</p>";
    echo "<p>Email: " . htmlspecialchars($admin['email']) . "</p>";
    echo "<p>Password hash (first 20 chars): " . htmlspecialchars(substr($admin['password_hash'], 0, 20)) . "...</p>";
    echo "<hr>";
    
    // Test password verification
    if (password_verify($password, $admin['password_hash'])) {
        echo "<p style='color: green; font-size: 18px; font-weight: bold;'>✅ SUCCESS! Password is correct!</p>";
        echo "<p>You can now log in with:</p>";
        echo "<ul>";
        echo "<li>Email: <code>" . htmlspecialchars($admin['email']) . "</code></li>";
        echo "<li>Password: <code>$password</code></li>";
        echo "</ul>";
    } else {
        echo "<p style='color: red; font-size: 18px; font-weight: bold;'>❌ FAILED! Password does not match the hash in database.</p>";
        echo "<p><strong>To fix this:</strong></p>";
        echo "<ol>";
        echo "<li>Generate a new bcrypt hash for your password using PowerShell:</li>";
        echo "<pre>cd C:\\xampp\\php\nphp.exe -r \"echo password_hash('YOUR_PASSWORD', PASSWORD_BCRYPT);\"</pre>";
        echo "<li>Copy the entire hash (starts with \$2y\$)</li>";
        echo "<li>Go to phpMyAdmin → university_apparel database → admins table</li>";
        echo "<li>Edit the admin record and paste the hash into password_hash field</li>";
        echo "<li>Click 'Go' to save</li>";
        echo "</ol>";
    }
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ ERROR: " . htmlspecialchars($e->getMessage()) . "</p>";
}

echo "<hr>";
echo "<p><small>To test with different credentials, add ?email=your@email.com&password=yourpassword to the URL</small></p>";
?>

