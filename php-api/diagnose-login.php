<?php
/**
 * Comprehensive Admin Login Diagnostic Tool
 * This script checks all aspects of the admin login system
 * Access via: http://localhost/university-apparel-api/diagnose-login.php
 */

require_once __DIR__ . '/bootstrap.php';

header('Content-Type: text/html; charset=utf-8');

$email = 'admin@mmsu.edu.ph';
$password = 'admin123';

echo "<!DOCTYPE html><html><head><title>Admin Login Diagnostic</title>";
echo "<style>
    body { font-family: Arial, sans-serif; max-width: 900px; margin: 20px auto; padding: 20px; }
    .success { color: green; font-weight: bold; }
    .error { color: red; font-weight: bold; }
    .warning { color: orange; font-weight: bold; }
    .info { color: blue; }
    pre { background: #f0f0f0; padding: 10px; border-radius: 5px; overflow-x: auto; }
    .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    h2 { margin-top: 0; color: #333; }
</style></head><body>";

echo "<h1>🔍 Admin Login Diagnostic Tool</h1>";

// Test 1: Database Connection
echo "<div class='section'>";
echo "<h2>1. Database Connection Test</h2>";
try {
    $testQuery = $pdo->query("SELECT 1");
    echo "<p class='success'>✅ Database connection successful</p>";
    echo "<p class='info'>Database: " . htmlspecialchars(DB_NAME) . "</p>";
    echo "<p class='info'>Host: " . htmlspecialchars(DB_HOST) . "</p>";
} catch (Exception $e) {
    echo "<p class='error'>❌ Database connection failed: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "</div></body></html>";
    exit;
}
echo "</div>";

// Test 2: Check if admins table exists
echo "<div class='section'>";
echo "<h2>2. Admins Table Check</h2>";
try {
    $stmt = $pdo->query("SHOW TABLES LIKE 'admins'");
    if ($stmt->rowCount() > 0) {
        echo "<p class='success'>✅ Admins table exists</p>";
    } else {
        echo "<p class='error'>❌ Admins table does not exist. Please import the database schema.</p>";
        echo "</div></body></html>";
        exit;
    }
} catch (Exception $e) {
    echo "<p class='error'>❌ Error checking table: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "</div></body></html>";
    exit;
}
echo "</div>";

// Test 3: Check if admin record exists
echo "<div class='section'>";
echo "<h2>3. Admin Record Check</h2>";
try {
    $stmt = $pdo->prepare('SELECT id, email, password_hash, LENGTH(password_hash) as hash_length FROM admins WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$admin) {
        echo "<p class='error'>❌ No admin found with email: " . htmlspecialchars($email) . "</p>";
        echo "<p class='info'>Creating admin account...</p>";
        
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare('INSERT INTO admins (email, password_hash) VALUES (:email, :password_hash)');
        $stmt->execute([
            ':email' => $email,
            ':password_hash' => $passwordHash
        ]);
        echo "<p class='success'>✅ Admin account created!</p>";
        
        // Fetch again
        $stmt = $pdo->prepare('SELECT id, email, password_hash, LENGTH(password_hash) as hash_length FROM admins WHERE email = :email LIMIT 1');
        $stmt->execute([':email' => $email]);
        $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    } else {
        echo "<p class='success'>✅ Admin record found</p>";
        echo "<p class='info'>Admin ID: " . htmlspecialchars($admin['id']) . "</p>";
        echo "<p class='info'>Email: " . htmlspecialchars($admin['email']) . "</p>";
        echo "<p class='info'>Password hash length: " . htmlspecialchars($admin['hash_length']) . " characters</p>";
        
        // Check if hash is placeholder
        if (strpos($admin['password_hash'], 'your_bcrypt_hash_here') !== false) {
            echo "<p class='error'>❌ Password hash is still a placeholder!</p>";
            echo "<p class='info'>Updating password hash...</p>";
            
            $passwordHash = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $pdo->prepare('UPDATE admins SET password_hash = :password_hash WHERE email = :email');
            $stmt->execute([
                ':email' => $email,
                ':password_hash' => $passwordHash
            ]);
            echo "<p class='success'>✅ Password hash updated!</p>";
            
            // Fetch again
            $stmt = $pdo->prepare('SELECT id, email, password_hash, LENGTH(password_hash) as hash_length FROM admins WHERE email = :email LIMIT 1');
            $stmt->execute([':email' => $email]);
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);
        }
    }
} catch (Exception $e) {
    echo "<p class='error'>❌ Error: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "</div></body></html>";
    exit;
}
echo "</div>";

// Test 4: Password verification
echo "<div class='section'>";
echo "<h2>4. Password Verification Test</h2>";
echo "<p class='info'>Testing password: <strong>" . htmlspecialchars($password) . "</strong></p>";

if (password_verify($password, $admin['password_hash'])) {
    echo "<p class='success'>✅ Password verification successful!</p>";
} else {
    echo "<p class='error'>❌ Password verification failed!</p>";
    echo "<p class='info'>Regenerating password hash...</p>";
    
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare('UPDATE admins SET password_hash = :password_hash WHERE email = :email');
    $stmt->execute([
        ':email' => $email,
        ':password_hash' => $passwordHash
    ]);
    
    // Test again
    if (password_verify($password, $passwordHash)) {
        echo "<p class='success'>✅ Password hash regenerated and verified!</p>";
    } else {
        echo "<p class='error'>❌ Still failing after regeneration. This is unusual.</p>";
    }
}
echo "</div>";

// Test 5: API Endpoint Test
echo "<div class='section'>";
echo "<h2>5. API Endpoint Simulation</h2>";
echo "<p class='info'>Simulating admin-login.php request...</p>";

$testData = ['email' => $email, 'password' => $password];
$stmt = $pdo->prepare('SELECT id, email, password_hash FROM admins WHERE email = :email LIMIT 1');
$stmt->execute([':email' => $email]);
$testAdmin = $stmt->fetch(PDO::FETCH_ASSOC);

if ($testAdmin && password_verify($password, $testAdmin['password_hash'])) {
    echo "<p class='success'>✅ API simulation successful!</p>";
    echo "<p class='info'>Expected API response:</p>";
    echo "<pre>" . json_encode([
        'id' => (int) $testAdmin['id'],
        'email' => $testAdmin['email'],
    ], JSON_PRETTY_PRINT) . "</pre>";
} else {
    echo "<p class='error'>❌ API simulation failed!</p>";
}
echo "</div>";

// Test 6: CORS Configuration
echo "<div class='section'>";
echo "<h2>6. CORS Configuration</h2>";
echo "<p class='info'>Allowed origins:</p>";
echo "<ul>";
foreach (ALLOWED_ORIGINS as $origin) {
    echo "<li>" . htmlspecialchars($origin) . "</li>";
}
echo "</ul>";
echo "<p class='warning'>⚠️ Make sure your frontend URL is in this list!</p>";
echo "<p class='info'>Frontend should be running on: <strong>http://localhost:3000</strong> or <strong>http://localhost:5173</strong></p>";
echo "</div>";

// Test 7: Summary and Instructions
echo "<div class='section'>";
echo "<h2>7. Summary & Next Steps</h2>";

if (password_verify($password, $admin['password_hash'])) {
    echo "<p class='success' style='font-size: 18px;'>✅ All checks passed! Admin login should work.</p>";
    echo "<p><strong>Login Credentials:</strong></p>";
    echo "<ul>";
    echo "<li>Email: <code>" . htmlspecialchars($email) . "</code></li>";
    echo "<li>Password: <code>" . htmlspecialchars($password) . "</code></li>";
    echo "</ul>";
    
    echo "<p><strong>If you still can't log in, check:</strong></p>";
    echo "<ol>";
    echo "<li>Open browser Developer Tools (F12) → Console tab</li>";
    echo "<li>Look for CORS errors or network errors</li>";
    echo "<li>Check Network tab to see the actual API request/response</li>";
    echo "<li>Verify the API URL is correct: <code>http://localhost/university-apparel-api/admin-login.php</code></li>";
    echo "<li>Make sure XAMPP Apache is running</li>";
    echo "</ol>";
} else {
    echo "<p class='error' style='font-size: 18px;'>❌ Some checks failed. Please review the errors above.</p>";
}

echo "</div>";

echo "<hr>";
echo "<p><a href='test-admin.php'>Test Admin Login</a> | <a href='fix-admin-password.php'>Fix Admin Password</a></p>";
echo "</body></html>";


