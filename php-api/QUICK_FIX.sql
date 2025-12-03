-- QUICK FIX: Update Admin Password Hash
-- Copy and paste this entire file into phpMyAdmin SQL tab
-- This will set the password to "admin123"

USE university_apparel;

-- Update the admin password hash
UPDATE admins 
SET password_hash = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
WHERE email = 'admin@mmsu.edu.ph';

-- If admin doesn't exist, create it
INSERT INTO admins (email, password_hash)
SELECT 'admin@mmsu.edu.ph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE NOT EXISTS (SELECT 1 FROM admins WHERE email = 'admin@mmsu.edu.ph');

-- Verify the update
SELECT id, email, 
       CASE 
         WHEN password_hash LIKE '$2y$10$%' THEN 'Valid bcrypt hash'
         ELSE 'Invalid hash'
       END as hash_status
FROM admins 
WHERE email = 'admin@mmsu.edu.ph';


