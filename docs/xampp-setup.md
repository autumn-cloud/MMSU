# XAMPP Database Setup

Follow these steps to load the MySQL database for the University Apparel system using XAMPP on Windows.

## 1. Start MySQL in XAMPP
1. Launch **XAMPP Control Panel**.
2. Click **Start** next to **Apache** (optional, only if you need phpMyAdmin) and **MySQL**.
3. Click **Admin** next to **MySQL** to open phpMyAdmin in your browser.

## 2. Import the schema and seed data
1. In phpMyAdmin, click **Import** in the left sidebar.
2. Click **Choose File** and select  
   `database/schema.sql` from this project folder.
3. Leave the format as **SQL** and click **Go**.  
   This will create the `university_apparel` database, tables, sample admin record, and 20 product entries (including image paths).

> **Tip:** If phpMyAdmin times out, split the script into two files (schema + seed) and import separately.

## 3. Store images
The SQL seeds store the relative image paths (for example `/assets/7e2430f5830668b6971707f76a70211cd435640d.png`).  
To make them available to a backend:
1. Copy the images from `src/assets` into a folder that the server can serve, e.g. `server/public/assets`.
2. Update the `image_url` column to match the public URL (e.g. `http://localhost:4000/assets/<filename>`).
3. Alternatively, you can upload actual image blobs:
   - In phpMyAdmin, edit the `product_images` row.
   - Use the “Upload” option for `image_data` to store the binary content.

## 4. Connect via backend code
- Use the connection string:
  ```
  DB_HOST=localhost
  DB_PORT=3306
  DB_USER=root
  DB_PASSWORD=           # leave empty unless you set one
  DB_NAME=university_apparel
  ```
- Configure your backend (Node/Express, PHP, etc.) to query the `products`, `orders`, and `order_items` tables.

## 5. Initial admin credentials
- Default seed creates `admin@mmsu.edu.ph` with placeholder hash (`$2y$10$your_bcrypt_hash_here`).
- Replace it with a real bcrypt hash:
  ```sql
  UPDATE admins SET password_hash='$2y$10$actualHashHere' WHERE email='admin@mmsu.edu.ph';
  ```
  You can generate one via PHP’s `password_hash('admin123', PASSWORD_BCRYPT);` or an online bcrypt generator.

## 6. Backups / sharing
- To share with teammates, export the database from phpMyAdmin (Export tab) after you’ve added real orders.
- Keep the `database/schema.sql` file under version control for easy re-creation.

