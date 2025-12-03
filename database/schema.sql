-- University Apparel Database Schema
-- Compatible with MySQL 8.x (XAMPP default)

DROP DATABASE IF EXISTS university_apparel;
CREATE DATABASE university_apparel CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE university_apparel;

-- Admin accounts
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admins (email, password_hash)
VALUES ('admin@mmsu.edu.ph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Products master list
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  legacy_id VARCHAR(50),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(120),
  department VARCHAR(180),
  image_url VARCHAR(255),
  in_stock TINYINT(1) DEFAULT 1,
  stock_count INT DEFAULT 0,
  sizes JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Product images (optional file blobs)
CREATE TABLE product_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  filename VARCHAR(255),
  mime_type VARCHAR(100),
  image_data LONGBLOB NULL,
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Orders and reservation tracking
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_number VARCHAR(50) UNIQUE,
  student_name VARCHAR(255),
  student_id VARCHAR(60),
  email VARCHAR(255),
  phone VARCHAR(60),
  department VARCHAR(180),
  course_year VARCHAR(100),
  delivery_method ENUM('department-pickup','class-representative') NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  status ENUM('pending','confirmed','ready-for-pickup','completed','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  size VARCHAR(20),
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE class_representatives (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  name VARCHAR(255),
  student_id VARCHAR(60),
  phone VARCHAR(60),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Seed products (derived from src/data/products.ts)
INSERT INTO products
  (legacy_id, name, description, price, category, department, image_url, in_stock, stock_count, sizes)
VALUES
('1','Engineering Uniform Set','Complete uniform set for College of Engineering students. Includes department polo shirt and formal pants with embroidered college logo.',950,'Uniform Set','College of Engineering','/assets/7e2430f5830668b6971707f76a70211cd435640d.png',1,85,'["S","M","L","XL","2XL"]'),
('2','Engineering Laboratory Coat','Professional lab coat for engineering laboratory work. Durable fabric with multiple pockets and college insignia.',750,'Lab Wear','College of Engineering','https://images.unsplash.com/photo-1758685848602-09e52ef9c7d3',1,60,'["S","M","L","XL","2XL"]'),
('3','Computing Sciences Uniform Set','Official uniform for College of Computing and Information Sciences. Modern design with CCIS branding on front and back.',900,'Uniform Set','College of Computing and Information Sciences','/assets/89820c77dc85eb64eafcda514819c1aad4d2f2fa.png',1,95,'["XS","S","M","L","XL","2XL"]'),
('4','Computing Lab Polo','Comfortable polo shirt for computer laboratory sessions with moisture-wicking technology and department logo.',450,'Lab Wear','College of Computing and Information Sciences','/assets/89820c77dc85eb64eafcda514819c1aad4d2f2fa.png',1,70,'["S","M","L","XL","2XL"]'),
('5','Law School Formal Attire','Professional formal uniform for College of Law students. Premium quality for courtroom simulations and formal events.',1350,'Uniform Set','College of Law','https://images.unsplash.com/photo-1708946697870-8bee62579d2d',1,40,'["S","M","L","XL","2XL"]'),
('6','Law Barong Tagalog','Traditional Filipino Barong Tagalog for College of Law formal occasions and graduation.',1800,'Formal Wear','College of Law','https://images.unsplash.com/photo-1644860588182-0998b4ef5587',1,25,'["S","M","L","XL","2XL"]'),
('7','Nursing Lecture Uniform','Official lecture uniform for 1st and 2nd-year College of Nursing students. White uniform designed for lectures and academic activities, representing professionalism and discipline.',850,'Clinical Wear','College of Nursing','/assets/4233f3c468dd9de0a45720db2a3e0e4c6644765e.png',1,80,'["XS","S","M","L","XL"]'),
('8','Nursing Duty Uniform','Daily duty uniform for nursing students during hospital rotations. Comfortable and professional.',750,'Clinical Wear','College of Nursing','https://images.unsplash.com/photo-1758685848602-09e52ef9c7d3',1,65,'["XS","S","M","L","XL"]'),
('9','Business Entrepreneurship Formal Set','Business professional uniform for College of Business, Entrepreneurship and Accountancy students.',1100,'Uniform Set','College of Business, Entrepreneurship and Accountancy','https://images.unsplash.com/photo-1708946697870-8bee62579d2d',1,90,'["S","M","L","XL","2XL"]'),
('10','Business Polo Shirt','Collared polo shirt for business students with department logo. Perfect for daily classes.',480,'Daily Wear','College of Business, Entrepreneurship and Accountancy','/assets/23cde09fe6d5d17aa7a66171a0f85d9c9b765249.png',1,100,'["S","M","L","XL","2XL"]'),
('11','Education Department Uniform','Official uniform for College of Education students. Comfortable design for teaching practice.',850,'Uniform Set','College of Education','https://images.unsplash.com/photo-1624471621620-c30f427546ce',1,110,'["XS","S","M","L","XL","2XL"]'),
('12','MMSU PE Uniform','Official Physical Education uniform for all MMSU students. Moisture-wicking fabric for athletic activities.',650,'PE Wear','All Colleges','/assets/3def84d7268eb07d365a01c84e8822a17bbf49c4.png',1,200,'["XS","S","M","L","XL","2XL"]'),
('13','MMSU Varsity Jacket','Premium varsity jacket with embroidered MMSU logo. Green and gold university colors.',1400,'University Apparel','All Colleges','https://images.unsplash.com/photo-1727063165870-0a1bc4c75240',1,45,'["S","M","L","XL","2XL"]'),
('14','MMSU ID Laces','Official MMSU ID laces in green and gold colors. Durable and comfortable neck lanyard with university branding.',85,'Accessories','All Colleges','/assets/496328913_2112295392580894_4583253455759426295_n.jpg',1,500,'["One Size"]'),
('15','College of Arts and Sciences','CAS uniform with blue shirt and yellow geometric accents featuring CAS logo.',300,'University Apparel','College of Arts and Sciences','/assets/548889699_1473137967055410_5019683523204594101_n.jpg',1,500,'["S","M","L","XL","2XL"]'),
('16','College of Teacher Education girls uniform','Official CTE girls uniform featuring CAS-inspired modern design.',300,'University Apparel','College of Teacher Education','/assets/Screenshot 2025-10-31 214013.png',1,500,'["S","M","L","XL","2XL"]'),
('17','College of Teacher Education boys uniform','Official CTE boys uniform featuring CAS-inspired modern design.',300,'University Apparel','College of Teacher Education','/assets/Screenshot 2025-10-31 214029.png',1,500,'["S","M","L","XL","2XL"]'),
('18','College of Industrial Technology Gala','CIT uniform with geometric accents and CIT logo.',300,'University Apparel','College of Industrial Technology','/assets/541223683_649868378157152_2810788496719529391_n.jpg',1,500,'["S","M","L","XL","2XL"]'),
('19','College of Industrial Technology Red Polo','CIT red polo uniform emphasizing creativity and excellence.',300,'University Apparel','College of Industrial Technology','/assets/554035109_1358485339178997_847930954984113576_n.jpg',1,500,'["S","M","L","XL","2XL"]'),
('20','College of Agriculture, Food, and Sustainable Development','CAFS uniform with modern design and CAFS logo.',300,'University Apparel','College of Agriculture, Food, and Sustainable Development','/assets/541291088_736995792498254_9200391229557665470_n.jpg',1,500,'["S","M","L","XL","2XL"]');

-- Mirror product images (URL + optional blob placeholder)
INSERT INTO product_images (product_id, filename, mime_type, image_url)
SELECT id, SUBSTRING_INDEX(image_url,'/',-1), 'image/png', image_url FROM products;

