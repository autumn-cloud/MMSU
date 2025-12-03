<?php
/**
 * VERIFY AND FIX Admin Password - One-Click Solution
 * This script will check and fix everything automatically
 * http://localhost/university-apparel-api/VERIFY_AND_FIX.php
 */

require_once __DIR__ . '/bootstrap.php';

header('Content-Type: text/html; charset=utf-8');

$email = 'admin@mmsu.edu.ph';
$password = 'admin123';

?>
<!DOCTYPE html>
<html>
<head>
    <title>Verify and Fix Admin Password</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .success { color: #28a745; font-weight: bold; background: #d4edda; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .error { color: #dc3545; font-weight: bold; background: #f8d7da; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .info { color: #0056b3; background: #d1ecf1; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .warning { color: #856404; background: #fff3cd; padding: 10px; border-radius: 5px; margin: 10px 0; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; border: 1px solid #dee2e6; }
        h1 { color: #333; border-bottom: 3px solid #28a745; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        .btn { display: inline-block; padding: 10px 20px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        .btn:hover { background: #218838; }
        .step { margin: 20px 0; padding: 15px; background: #f8f9fa; border-left: 4px solid #28a745; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔧 Verify and Fix Admin Password</h1>
        
        <?php
        $fixed = false;
        $issues = [];
        
        try {
            // Step 1: Check if admin exists
            echo "<div class='step'>";
            echo "<h2>Step 1: Checking Admin Record</h2>";
            $stmt = $pdo->prepare('SELECT id, email, password_hash FROM admins WHERE email = :email LIMIT 1');
            $stmt->execute([':email' => $email]);
            $admin = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if (!$admin) {
                echo "<div class='warning'>⚠️ Admin record not found. Creating it now...</div>";
                $passwordHash = password_hash($password, PASSWORD_BCRYPT);
                $stmt = $pdo->prepare('INSERT INTO admins (email, password_hash) VALUES (:email, :password_hash)');
                $stmt->execute([
                    ':email' => $email,
                    ':password_hash' => $passwordHash
                ]);
                echo "<div class='success'>✅ Admin account created!</div>";
                $fixed = true;
                
                // Fetch again
                $stmt = $pdo->prepare('SELECT id, email, password_hash FROM admins WHERE email = :email LIMIT 1');
                $stmt->execute([':email' => $email]);
                $admin = $stmt->fetch(PDO::FETCH_ASSOC);
            } else {
                echo "<div class='success'>✅ Admin record found (ID: {$admin['id']})</div>";
            }
            echo "</div>";
            
            // Step 2: Check password hash
            echo "<div class='step'>";
            echo "<h2>Step 2: Checking Password Hash</h2>";
            
            $hashValid = true;
            if (empty($admin['password_hash'])) {
                echo "<div class='error'>❌ Password hash is empty!</div>";
                $hashValid = false;
            } elseif (strpos($admin['password_hash'], 'your_bcrypt_hash_here') !== false) {
                echo "<div class='error'>❌ Password hash is still a placeholder!</div>";
                $hashValid = false;
            } elseif (!password_verify($password, $admin['password_hash'])) {
                echo "<div class='error'>❌ Password hash does not match 'admin123'!</div>";
                $hashValid = false;
            } else {
                echo "<div class='success'>✅ Password hash is valid!</div>";
            }
            
            // Step 3: Fix if needed
            if (!$hashValid) {
                echo "<div class='info'>🔧 Fixing password hash...</div>";
                $passwordHash = password_hash($password, PASSWORD_BCRYPT);
                $stmt = $pdo->prepare('UPDATE admins SET password_hash = :password_hash WHERE email = :email');
                $stmt->execute([
                    ':email' => $email,
                    ':password_hash' => $passwordHash
                ]);
                echo "<div class='success'>✅ Password hash updated!</div>";
                $fixed = true;
                
                // Update admin record
                $stmt = $pdo->prepare('SELECT id, email, password_hash FROM admins WHERE email = :email LIMIT 1');
                $stmt->execute([':email' => $email]);
                $admin = $stmt->fetch(PDO::FETCH_ASSOC);
            }
            echo "</div>";
            
            // Step 4: Final verification
            echo "<div class='step'>";
            echo "<h2>Step 3: Final Verification</h2>";
            
            $finalCheck = password_verify($password, $admin['password_hash']);
            if ($finalCheck) {
                echo "<div class='success' style='font-size: 18px; padding: 20px;'>";
                echo "✅ <strong>SUCCESS! Admin login is now working!</strong><br><br>";
                echo "Login Credentials:<br>";
                echo "Email: <code>{$email}</code><br>";
                echo "Password: <code>{$password}</code>";
                echo "</div>";
            } else {
                echo "<div class='error' style='font-size: 18px; padding: 20px;'>";
                echo "❌ <strong>VERIFICATION FAILED!</strong><br>";
                echo "Something went wrong. Please try running this script again.";
                echo "</div>";
            }
            echo "</div>";
            
        } catch (Exception $e) {
            echo "<div class='error'>";
            echo "❌ ERROR: " . htmlspecialchars($e->getMessage());
            echo "</div>";
            echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
        }
        ?>
        
        <div class="step">
            <h2>Next Steps</h2>
            <?php if ($fixed): ?>
                <div class="info">
                    <strong>The password has been fixed!</strong> Now try logging in again from your frontend application.
                </div>
            <?php endif; ?>
            <p>
                <a href="test-login-endpoint.php" class="btn">Test Login Endpoint</a>
                <a href="test-admin.php" class="btn">Test Admin Credentials</a>
            </p>
        </div>
        
        <hr>
        <p><small>If you still can't log in after this, check the browser console (F12) for CORS or network errors.</small></p>
    </div>
</body>
</html>


