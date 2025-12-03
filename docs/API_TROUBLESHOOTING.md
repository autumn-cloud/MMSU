# API Connection Troubleshooting Guide

If you see "Unable to reach the API. Showing bundled catalog instead.", follow these steps:

## Step 1: Verify XAMPP is Running ✅

1. Open **XAMPP Control Panel**
2. Make sure **Apache** is running (green "Running" status)
3. Make sure **MySQL** is running (green "Running" status)

## Step 2: Verify PHP API Files Location 📁

Your PHP API files should be in:
```
C:\xampp\htdocs\university-apparel-api\
```

**Check if these files exist:**
- `bootstrap.php`
- `config.php`
- `database.php`
- `products.php`
- `orders.php`
- `admin-login.php`
- `test-connection.php`

**If files are missing:**
1. Copy the entire `php-api` folder from your project
2. Paste it into `C:\xampp\htdocs\`
3. Rename it to `university-apparel-api` (if needed)

## Step 3: Test API Connection in Browser 🌐

Open your browser and test these URLs:

### Test 1: Simple Connection Test
```
http://localhost/university-apparel-api/test-connection.php
```
**Expected:** Should show JSON with "status": "success"

### Test 2: Products Endpoint
```
http://localhost/university-apparel-api/products.php
```
**Expected:** Should show JSON array of products from database

### Test 3: Database Connection Test
```
http://localhost/university-apparel-api/test-admin.php
```
**Expected:** Should show admin login test results

**If you get 404 errors:**
- Files are in wrong location OR
- Apache is not running OR
- Folder name doesn't match

## Step 4: Check Database Connection 🔌

1. Open **phpMyAdmin** (http://localhost/phpmyadmin)
2. Verify database `university_apparel` exists
3. Check if `products` table has data
4. Check `config.php` has correct database credentials:
   ```php
   const DB_HOST = 'localhost';
   const DB_NAME = 'university_apparel';
   const DB_USER = 'root';
   const DB_PASS = ''; // Empty if no password set
   ```

## Step 5: Check Frontend Configuration ⚙️

1. In your project root, create `.env` file (if it doesn't exist)
2. Add this line:
   ```
   VITE_API_BASE=http://localhost/university-apparel-api
   ```
3. **Restart your Vite dev server** after creating/updating `.env`

## Step 6: Check Browser Console 🔍

1. Open your app in browser (http://localhost:3000 or :5173)
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for errors like:
   - `Failed to fetch`
   - `CORS error`
   - `404 Not Found`

## Step 7: Common Issues & Fixes 🔧

### Issue: "404 Not Found" when accessing API
**Fix:** 
- Verify files are in `C:\xampp\htdocs\university-apparel-api\`
- Check Apache is running
- Try accessing: `http://localhost/university-apparel-api/test-connection.php`

### Issue: CORS Error
**Fix:**
- Check `config.php` has correct `ALLOWED_ORIGINS`
- Should include: `http://localhost:3000` and `http://localhost:5173`

### Issue: Database Connection Error
**Fix:**
- Check MySQL is running in XAMPP
- Verify `config.php` database credentials
- Make sure database `university_apparel` exists (import schema.sql if needed)

### Issue: PHP Errors
**Fix:**
- Check `C:\xampp\apache\logs\error.log` for detailed errors
- Verify PHP version (should be 7.4+)
- Make sure `bootstrap.php`, `database.php` are in same folder

## Quick Fix Checklist ✅

- [ ] XAMPP Apache is running
- [ ] XAMPP MySQL is running
- [ ] PHP files are in `C:\xampp\htdocs\university-apparel-api\`
- [ ] Database `university_apparel` exists
- [ ] Products table has data
- [ ] Test URLs work in browser
- [ ] `.env` file exists with correct API_BASE
- [ ] Vite dev server restarted after `.env` changes
- [ ] No errors in browser console

## Still Not Working? 🆘

1. Copy the exact error from browser console (F12)
2. Check `C:\xampp\apache\logs\error.log`
3. Test each endpoint individually in browser
4. Verify you can access http://localhost/ in browser (basic XAMPP test)

