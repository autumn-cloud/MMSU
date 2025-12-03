<?php
/**
 * Generate Bcrypt Hash for Admin Password
 * Simply open this file in your browser to get the hash
 * http://localhost/university-apparel-api/generate-hash.php
 */

$password = 'admin123';
$hash = password_hash($password, PASSWORD_BCRYPT);

header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html>
<head>
    <title>Generate Password Hash</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        .hash-box { background: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0; }
        code { background: #fff; padding: 2px 6px; border-radius: 3px; }
        pre { background: #fff; padding: 15px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <h1>Password Hash Generator</h1>
    <p>Password: <strong><?php echo htmlspecialchars($password); ?></strong></p>
    
    <div class="hash-box">
        <h2>Generated Bcrypt Hash:</h2>
        <pre><?php echo htmlspecialchars($hash); ?></pre>
    </div>
    
    <h2>SQL UPDATE Statement:</h2>
    <p>Copy and paste this into phpMyAdmin SQL tab:</p>
    <pre>UPDATE admins 
SET password_hash = '<?php echo htmlspecialchars($hash); ?>' 
WHERE email = 'admin@mmsu.edu.ph';</pre>
    
    <p><strong>Steps:</strong></p>
    <ol>
        <li>Open phpMyAdmin (http://localhost/phpmyadmin)</li>
        <li>Select the <code>university_apparel</code> database</li>
        <li>Click on the <strong>SQL</strong> tab</li>
        <li>Paste the SQL UPDATE statement above</li>
        <li>Click <strong>Go</strong></li>
        <li>You should see "1 row affected"</li>
    </ol>
    
    <hr>
    <p><small>Or use the <a href="fix-admin-password.php">fix-admin-password.php</a> script to do this automatically.</small></p>
</body>
</html>


