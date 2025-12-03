<?php
/**
 * Test Admin Login Endpoint Directly
 * This simulates exactly what the frontend does
 * http://localhost/university-apparel-api/test-login-endpoint.php
 */

require_once __DIR__ . '/bootstrap.php';

header('Content-Type: text/html; charset=utf-8');

$email = 'admin@mmsu.edu.ph';
$password = 'admin123';

echo "<!DOCTYPE html><html><head><title>Test Login Endpoint</title>";
echo "<style>
    body { font-family: Arial, sans-serif; max-width: 900px; margin: 20px auto; padding: 20px; }
    .success { color: green; font-weight: bold; }
    .error { color: red; font-weight: bold; }
    .info { color: blue; }
    pre { background: #f0f0f0; padding: 10px; border-radius: 5px; overflow-x: auto; }
    .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
    h2 { margin-top: 0; color: #333; }
</style></head><body>";

echo "<h1>🔐 Test Admin Login Endpoint</h1>";

// Test 1: Check database connection and admin record
echo "<div class='section'>";
echo "<h2>1. Database Check</h2>";
try {
    $stmt = $pdo->prepare('SELECT id, email, password_hash, LENGTH(password_hash) as hash_len FROM admins WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$admin) {
        echo "<p class='error'>❌ No admin found with email: " . htmlspecialchars($email) . "</p>";
        echo "<p>Run <a href='fix-admin-password.php'>fix-admin-password.php</a> to create the admin account.</p>";
        echo "</div></body></html>";
        exit;
    }
    
    echo "<p class='success'>✅ Admin found in database</p>";
    echo "<p class='info'>ID: " . htmlspecialchars($admin['id']) . "</p>";
    echo "<p class='info'>Email: " . htmlspecialchars($admin['email']) . "</p>";
    echo "<p class='info'>Hash length: " . htmlspecialchars($admin['hash_len']) . " characters</p>";
    echo "<p class='info'>Hash preview: " . htmlspecialchars(substr($admin['password_hash'], 0, 30)) . "...</p>";
    
    // Check if it's a placeholder
    if (strpos($admin['password_hash'], 'your_bcrypt_hash_here') !== false) {
        echo "<p class='error'>❌ Password hash is still a placeholder!</p>";
        echo "<p>Run <a href='fix-admin-password.php'>fix-admin-password.php</a> to fix it.</p>";
        echo "</div></body></html>";
        exit;
    }
    
} catch (Exception $e) {
    echo "<p class='error'>❌ Database error: " . htmlspecialchars($e->getMessage()) . "</p>";
    echo "</div></body></html>";
    exit;
}
echo "</div>";

// Test 2: Password verification
echo "<div class='section'>";
echo "<h2>2. Password Verification</h2>";
echo "<p class='info'>Testing password: <strong>" . htmlspecialchars($password) . "</strong></p>";

$passwordValid = password_verify($password, $admin['password_hash']);

if ($passwordValid) {
    echo "<p class='success'>✅ Password verification PASSED!</p>";
} else {
    echo "<p class='error'>❌ Password verification FAILED!</p>";
    echo "<p>The password hash in the database does not match 'admin123'.</p>";
    echo "<p><strong>Solution:</strong> Run <a href='fix-admin-password.php'>fix-admin-password.php</a> to update the hash.</p>";
    echo "</div></body></html>";
    exit;
}
echo "</div>";

// Test 3: Simulate the actual API endpoint
echo "<div class='section'>";
echo "<h2>3. API Endpoint Simulation</h2>";
echo "<p class='info'>Simulating POST request to admin-login.php...</p>";

// Simulate what admin-login.php does
$testData = ['email' => $email, 'password' => $password];
$testStmt = $pdo->prepare('SELECT id, email, password_hash FROM admins WHERE email = :email LIMIT 1');
$testStmt->execute([':email' => $email]);
$testAdmin = $testStmt->fetch(PDO::FETCH_ASSOC);

if ($testAdmin && password_verify($password, $testAdmin['password_hash'])) {
    echo "<p class='success'>✅ API simulation successful!</p>";
    echo "<p class='info'>Expected response:</p>";
    $response = [
        'id' => (int) $testAdmin['id'],
        'email' => $testAdmin['email'],
    ];
    echo "<pre>" . json_encode($response, JSON_PRETTY_PRINT) . "</pre>";
} else {
    echo "<p class='error'>❌ API simulation failed!</p>";
}
echo "</div>";

// Test 4: Check CORS and API accessibility
echo "<div class='section'>";
echo "<h2>4. API Accessibility Check</h2>";
echo "<p class='info'>API Base URL should be: <code>http://localhost/university-apparel-api</code></p>";
echo "<p class='info'>Login endpoint: <code>http://localhost/university-apparel-api/admin-login.php</code></p>";

$apiUrl = 'http://localhost/university-apparel-api/admin-login.php';
echo "<p>Test the endpoint manually:</p>";
echo "<ol>";
echo "<li>Open browser Developer Tools (F12)</li>";
echo "<li>Go to Console tab</li>";
echo "<li>Run this JavaScript:</li>";
echo "</ol>";
echo "<pre>fetch('http://localhost/university-apparel-api/admin-login.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@mmsu.edu.ph', password: 'admin123' })
})
.then(r => r.json())
.then(data => console.log('Success:', data))
.catch(err => console.error('Error:', err));</pre>";
echo "</div>";

// Test 5: Summary
echo "<div class='section'>";
echo "<h2>5. Summary</h2>";

if ($passwordValid) {
    echo "<p class='success' style='font-size: 18px;'>✅ All backend checks passed!</p>";
    echo "<p><strong>If you still can't log in from the frontend, check:</strong></p>";
    echo "<ol>";
    echo "<li><strong>Browser Console (F12)</strong> - Look for errors</li>";
    echo "<li><strong>Network Tab (F12)</strong> - Check if the request is being sent</li>";
    echo "<li><strong>CORS errors</strong> - Make sure your frontend URL is in ALLOWED_ORIGINS</li>";
    echo "<li><strong>API URL</strong> - Verify .env file has: <code>VITE_API_BASE=http://localhost/university-apparel-api</code></li>";
    echo "<li><strong>Restart Vite</strong> - After changing .env, restart the dev server</li>";
    echo "</ol>";
    
    echo "<p><strong>Login Credentials:</strong></p>";
    echo "<ul>";
    echo "<li>Email: <code>" . htmlspecialchars($email) . "</code></li>";
    echo "<li>Password: <code>" . htmlspecialchars($password) . "</code></li>";
    echo "</ul>";
} else {
    echo "<p class='error' style='font-size: 18px;'>❌ Password verification failed. Please fix the password hash first.</p>";
}

echo "</div>";

echo "<hr>";
echo "<p><a href='diagnose-login.php'>Full Diagnostic</a> | <a href='fix-admin-password.php'>Fix Password</a> | <a href='test-admin.php'>Test Admin</a></p>";
echo "</body></html>";


