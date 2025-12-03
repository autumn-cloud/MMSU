# PHP API (XAMPP)

This folder contains a lightweight PHP API that exposes products and orders from the `university_apparel` MySQL database.

## Setup
1. Copy the entire `php-api` folder into `C:\xampp\htdocs\university-apparel-api`.
2. Ensure the database is created and seeded (`database/schema.sql`).
3. Start Apache & MySQL in XAMPP Control Panel.
4. Visit `http://localhost/university-apparel-api/products.php` to test.

## Endpoints
| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/products.php` | List all products |
| POST | `/products.php` | Create new product (JSON body) |
| PUT | `/products.php?id=ID` | Update product |
| DELETE | `/products.php?id=ID` | Delete product |
| GET | `/orders.php` | List all orders (with items & representative) |
| POST | `/orders.php` | Create new order |
| PUT/PATCH | `/orders.php?id=ID` | Update order status |
| POST | `/admin-login.php` | Verify admin credentials |

All endpoints return JSON and accept JSON bodies.

## CORS
Allowed origins default to `http://localhost:5173`. Update `ALLOWED_ORIGINS` in `config.php` if needed.


