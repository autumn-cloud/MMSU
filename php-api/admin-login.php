<?php

require_once __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['error' => 'Method not allowed'], 405);
}

$data = read_json_body();
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Debug mode - set to false in production
$debug = false; // Set to true to see detailed error messages

try {
    $stmt = $pdo->prepare('SELECT id, email, password_hash FROM admins WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email]);
    $admin = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$admin) {
        if ($debug) {
            send_json(['error' => 'Admin not found', 'email' => $email], 401);
        } else {
            send_json(['error' => 'Invalid credentials'], 401);
        }
        exit;
    }
    
    // Check if password hash is valid
    if (empty($admin['password_hash']) || strpos($admin['password_hash'], 'your_bcrypt_hash_here') !== false) {
        if ($debug) {
            send_json(['error' => 'Password hash is invalid or placeholder. Run fix-admin-password.php'], 401);
        } else {
            send_json(['error' => 'Invalid credentials'], 401);
        }
        exit;
    }
    
    // Verify password
    $passwordValid = password_verify($password, $admin['password_hash']);
    
    if (!$passwordValid) {
        if ($debug) {
            send_json([
                'error' => 'Password verification failed',
                'email' => $email,
                'hash_preview' => substr($admin['password_hash'], 0, 20) . '...',
                'note' => 'Run fix-admin-password.php to update the password hash'
            ], 401);
        } else {
            send_json(['error' => 'Invalid credentials'], 401);
        }
        exit;
    }
    
    // Success
    send_json([
        'id' => (int) $admin['id'],
        'email' => $admin['email'],
    ]);
    
} catch (Exception $e) {
    if ($debug) {
        send_json(['error' => 'Database error', 'message' => $e->getMessage()], 500);
    } else {
        send_json(['error' => 'Internal server error'], 500);
    }
}

