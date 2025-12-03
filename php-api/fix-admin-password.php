<?php
/**
 * Fix Admin Password Hash
 * This script generates a proper bcrypt hash for the admin password and updates the database
 * Run this once after setting up the database: http://localhost/university-apparel-api/fix-admin-password.php
 */

require_once __DIR__ . '/bootstrap.php';

$email = 'admin@mmsu.edu.ph';
$password = 'admin123';

echo "<h2>Fixing Admin Password</h2>";
echo "<p>Email: <strong>$email</strong></p>";
echo "<p>Password: <strong>$password</strong></p>";
echo "<hr>";

try {
    // Generate bcrypt hash
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    
    echo "<p style='color: green;'>✅ Generated bcrypt hash:</p>";
    echo "<pre style='background: #f0f0f0; padding: 10px; word-break: break-all;'>" . htmlspecialchars($passwordHash) . "</pre>";
    echo "<hr>";
    
    // Check if admin exists
    $stmt = $pdo->prepare('SELECT id, email, password_hash FROM admins WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$admin) {
        // Create admin if doesn't exist
        echo "<p style='color: orange;'>⚠️ Admin not found. Creating new admin account...</p>";
        $stmt = $pdo->prepare('INSERT INTO admins (email, password_hash) VALUES (:email, :password_hash)');
        $stmt->execute([
            ':email' => $email,
            ':password_hash' => $passwordHash
        ]);
        echo "<p style='color: green;'>✅ Admin account created successfully!</p>";
    } else {
        // Update existing admin
        echo "<p style='color: blue;'>ℹ️ Admin found. Updating password hash...</p>";
        $stmt = $pdo->prepare('UPDATE admins SET password_hash = :password_hash WHERE email = :email');
        $stmt->execute([
            ':email' => $email,
            ':password_hash' => $passwordHash
        ]);
        echo "<p style='color: green;'>✅ Password hash updated successfully!</p>";
    }
    
    echo "<hr>";
    echo "<p style='color: green; font-size: 18px; font-weight: bold;'>✅ SUCCESS! Admin credentials are now set up.</p>";
    echo "<p>You can now log in with:</p>";
    echo "<ul>";
    echo "<li>Email: <code>" . htmlspecialchars($email) . "</code></li>";
    echo "<li>Password: <code>$password</code></li>";
    echo "</ul>";
    echo "<hr>";
    echo "<p><a href='test-admin.php'>Test the login credentials here</a></p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ ERROR: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
}

