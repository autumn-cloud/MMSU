<?php
/**
 * Test Order Creation
 * This script helps debug order creation issues
 * http://localhost/university-apparel-api/test-order-creation.php
 */

require_once __DIR__ . '/bootstrap.php';

header('Content-Type: text/html; charset=utf-8');

?>
<!DOCTYPE html>
<html>
<head>
    <title>Test Order Creation</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 900px; margin: 20px auto; padding: 20px; }
        .success { color: green; font-weight: bold; background: #d4edda; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .error { color: red; font-weight: bold; background: #f8d7da; padding: 10px; border-radius: 5px; margin: 10px 0; }
        .info { color: blue; background: #d1ecf1; padding: 10px; border-radius: 5px; margin: 10px 0; }
        pre { background: #f8f9fa; padding: 15px; border-radius: 5px; overflow-x: auto; border: 1px solid #dee2e6; }
        h1 { color: #333; }
    </style>
</head>
<body>
    <h1>🔍 Test Order Creation</h1>
    
    <?php
    try {
        // Test 1: Database connection
        echo "<div class='info'><h2>1. Database Connection</h2>";
        $testQuery = $pdo->query("SELECT 1");
        echo "<p class='success'>✅ Database connection successful</p></div>";
        
        // Test 2: Check if products exist
        echo "<div class='info'><h2>2. Available Products</h2>";
        $productsStmt = $pdo->query("SELECT id, name, stock_count, in_stock FROM products LIMIT 5");
        $products = $productsStmt->fetchAll(PDO::FETCH_ASSOC);
        if (empty($products)) {
            echo "<p class='error'>❌ No products found in database</p>";
        } else {
            echo "<p class='success'>✅ Found " . count($products) . " products</p>";
            echo "<table border='1' cellpadding='5' style='border-collapse: collapse; width: 100%;'>";
            echo "<tr><th>ID</th><th>Name</th><th>Stock Count</th><th>In Stock</th></tr>";
            foreach ($products as $p) {
                echo "<tr>";
                echo "<td>" . htmlspecialchars($p['id']) . "</td>";
                echo "<td>" . htmlspecialchars($p['name']) . "</td>";
                echo "<td>" . htmlspecialchars($p['stock_count']) . "</td>";
                echo "<td>" . ($p['in_stock'] ? 'Yes' : 'No') . "</td>";
                echo "</tr>";
            }
            echo "</table>";
        }
        echo "</div>";
        
        // Test 3: Simulate order creation
        echo "<div class='info'><h2>3. Test Order Creation</h2>";
        if (!empty($products)) {
            $testProduct = $products[0];
            $testData = [
                'orderNumber' => 'TEST-' . time(),
                'studentName' => 'Test Student',
                'studentId' => '12345',
                'email' => 'test@mmsu.edu.ph',
                'phone' => '09123456789',
                'department' => 'College of Engineering',
                'courseYear' => 'BSCS 3rd Year',
                'deliveryMethod' => 'department-pickup',
                'totalAmount' => 1000.00,
                'status' => 'pending',
                'items' => [
                    [
                        'productId' => (int) $testProduct['id'],
                        'size' => 'M',
                        'quantity' => 1,
                        'unitPrice' => 1000.00
                    ]
                ]
            ];
            
            echo "<p>Test order data:</p>";
            echo "<pre>" . json_encode($testData, JSON_PRETTY_PRINT) . "</pre>";
            
            // Try to create order
            $pdo->beginTransaction();
            try {
                $orderNumber = $testData['orderNumber'];
                $now = now();
                
                // Insert order
                $stmt = $pdo->prepare(
                    'INSERT INTO orders (order_number, student_name, student_id, email, phone, department, course_year, delivery_method, total_amount, status, created_at, updated_at)
                     VALUES (:order_number, :student_name, :student_id, :email, :phone, :department, :course_year, :delivery_method, :total_amount, :status, :created_at, :updated_at)'
                );
                $stmt->execute([
                    ':order_number' => $orderNumber,
                    ':student_name' => $testData['studentName'],
                    ':student_id' => $testData['studentId'],
                    ':email' => $testData['email'],
                    ':phone' => $testData['phone'],
                    ':department' => $testData['department'],
                    ':course_year' => $testData['courseYear'],
                    ':delivery_method' => $testData['deliveryMethod'],
                    ':total_amount' => $testData['totalAmount'],
                    ':status' => $testData['status'],
                    ':created_at' => $now,
                    ':updated_at' => $now,
                ]);
                
                $orderId = (int) $pdo->lastInsertId();
                echo "<p class='success'>✅ Order created with ID: {$orderId}</p>";
                
                // Process items
                $stockCheckStmt = $pdo->prepare('SELECT id, name, stock_count, in_stock FROM products WHERE id = :product_id');
                $updateStockStmt = $pdo->prepare('UPDATE products SET stock_count = stock_count - :quantity, in_stock = CASE WHEN (stock_count - :quantity) <= 0 THEN 0 ELSE 1 END, updated_at = :updated_at WHERE id = :product_id');
                $itemStmt = $pdo->prepare('INSERT INTO order_items (order_id, product_id, size, quantity, unit_price) VALUES (:order_id, :product_id, :size, :quantity, :unit_price)');
                
                foreach ($testData['items'] as $item) {
                    $productId = (int) $item['productId'];
                    $quantity = (int) $item['quantity'];
                    
                    // Check stock
                    $stockCheckStmt->execute([':product_id' => $productId]);
                    $product = $stockCheckStmt->fetch(PDO::FETCH_ASSOC);
                    
                    if (!$product) {
                        throw new Exception("Product not found");
                    }
                    
                    echo "<p>✅ Product found: {$product['name']} (Stock: {$product['stock_count']})</p>";
                    
                    // Insert item
                    $itemStmt->execute([
                        ':order_id' => $orderId,
                        ':product_id' => $productId,
                        ':size' => $item['size'],
                        ':quantity' => $quantity,
                        ':unit_price' => $item['unitPrice'],
                    ]);
                    echo "<p>✅ Order item inserted</p>";
                    
                    // Update stock
                    $updateStockStmt->execute([
                        ':quantity' => $quantity,
                        ':product_id' => $productId,
                        ':updated_at' => $now,
                    ]);
                    echo "<p>✅ Stock updated</p>";
                }
                
                $pdo->rollBack(); // Rollback test order
                echo "<p class='success'>✅ Test order creation successful! (Rolled back)</p>";
                
            } catch (Exception $e) {
                $pdo->rollBack();
                echo "<p class='error'>❌ Error: " . htmlspecialchars($e->getMessage()) . "</p>";
                echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
            }
        }
        echo "</div>";
        
    } catch (Exception $e) {
        echo "<div class='error'>";
        echo "<h2>❌ Error</h2>";
        echo "<p>" . htmlspecialchars($e->getMessage()) . "</p>";
        echo "<pre>" . htmlspecialchars($e->getTraceAsString()) . "</pre>";
        echo "</div>";
    }
    ?>
    
    <hr>
    <p><small>Check Apache error logs at: <code>C:\xampp\apache\logs\error.log</code> for more details</small></p>
</body>
</html>

