<?php

require_once __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetOrders($pdo);
        break;
    case 'POST':
        handleCreateOrder($pdo);
        break;
    case 'PATCH':
    case 'PUT':
        handleUpdateOrderStatus($pdo);
        break;
    default:
        send_json(['error' => 'Method not allowed'], 405);
}

function handleGetOrders(PDO $pdo): void
{
    $email = $_GET['email'] ?? null;
    if ($email) {
        $stmt = $pdo->prepare('SELECT * FROM orders WHERE email = :email ORDER BY created_at DESC');
        $stmt->execute([':email' => $email]);
    } else {
        $stmt = $pdo->query('SELECT * FROM orders ORDER BY created_at DESC');
    }
    $orders = [];
    while ($row = $stmt->fetch()) {
        $orders[] = hydrateOrder($pdo, $row);
    }

    send_json($orders);
}

function handleCreateOrder(PDO $pdo): void
{
    $data = read_json_body();
    $pdo->beginTransaction();

    try {
        $orderNumber = $data['orderNumber'] ?? generateOrderNumber($pdo);
        $stmt = $pdo->prepare(
            'INSERT INTO orders (order_number, student_name, student_id, email, phone, department, course_year, delivery_method, total_amount, status, created_at, updated_at)
             VALUES (:order_number, :student_name, :student_id, :email, :phone, :department, :course_year, :delivery_method, :total_amount, :status, :created_at, :updated_at)'
        );
        $now = now();
        $stmt->execute([
            ':order_number' => $orderNumber,
            ':student_name' => $data['studentName'] ?? '',
            ':student_id' => $data['studentId'] ?? '',
            ':email' => $data['email'] ?? '',
            ':phone' => $data['phone'] ?? '',
            ':department' => $data['department'] ?? '',
            ':course_year' => $data['courseYear'] ?? '',
            ':delivery_method' => $data['deliveryMethod'] ?? 'department-pickup',
            ':total_amount' => $data['totalAmount'] ?? 0,
            ':status' => $data['status'] ?? 'pending',
            ':created_at' => $now,
            ':updated_at' => $now,
        ]);

        $orderId = (int) $pdo->lastInsertId();

        if (!empty($data['classRepresentative']) && $data['deliveryMethod'] === 'class-representative') {
            $rep = $data['classRepresentative'];
            $repStmt = $pdo->prepare('INSERT INTO class_representatives (order_id, name, student_id, phone) VALUES (:order_id, :name, :student_id, :phone)');
            $repStmt->execute([
                ':order_id' => $orderId,
                ':name' => $rep['name'] ?? '',
                ':student_id' => $rep['studentId'] ?? '',
                ':phone' => $rep['phone'] ?? '',
            ]);
        }

        $itemStmt = $pdo->prepare(
            'INSERT INTO order_items (order_id, product_id, size, quantity, unit_price) VALUES (:order_id, :product_id, :size, :quantity, :unit_price)'
        );
        foreach ($data['items'] ?? [] as $item) {
            $itemStmt->execute([
                ':order_id' => $orderId,
                ':product_id' => $item['productId'] ?? null,
                ':size' => $item['size'] ?? '',
                ':quantity' => $item['quantity'] ?? 1,
                ':unit_price' => $item['unitPrice'] ?? 0,
            ]);
        }

        $pdo->commit();

        $order = hydrateOrder($pdo, [
            'id' => $orderId,
            'order_number' => $orderNumber,
            'student_name' => $data['studentName'] ?? '',
            'student_id' => $data['studentId'] ?? '',
            'email' => $data['email'] ?? '',
            'phone' => $data['phone'] ?? '',
            'department' => $data['department'] ?? '',
            'course_year' => $data['courseYear'] ?? '',
            'delivery_method' => $data['deliveryMethod'] ?? 'department-pickup',
            'total_amount' => $data['totalAmount'] ?? 0,
            'status' => $data['status'] ?? 'pending',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        send_json($order, 201);
    } catch (Throwable $e) {
        $pdo->rollBack();
        send_json(['error' => 'Failed to create order', 'details' => $e->getMessage()], 500);
    }
}

function handleUpdateOrderStatus(PDO $pdo): void
{
    parse_str($_SERVER['QUERY_STRING'] ?? '', $params);
    $id = (int) ($params['id'] ?? 0);
    if ($id <= 0) {
        send_json(['error' => 'Order ID is required'], 400);
    }

    $data = read_json_body();
    if (empty($data['status'])) {
        send_json(['error' => 'Status is required'], 400);
    }

    $stmt = $pdo->prepare('UPDATE orders SET status = :status, updated_at = :updated_at WHERE id = :id');
    $stmt->execute([
        ':status' => $data['status'],
        ':updated_at' => now(),
        ':id' => $id,
    ]);

    send_json(['message' => 'Order updated']);
}

function hydrateOrder(PDO $pdo, array $row): array
{
    $orderId = (int) $row['id'];

    $itemStmt = $pdo->prepare('SELECT oi.*, p.name as product_name, p.description as product_description, p.category as product_category, p.department as product_department, p.image_url as product_image, p.sizes as product_sizes, p.price as product_price
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = :order_id');
    $itemStmt->execute([':order_id' => $orderId]);
    $items = [];
    while ($item = $itemStmt->fetch()) {
        $sizes = $item['product_sizes'] ? json_decode($item['product_sizes'], true) : [];
        $items[] = [
            'id' => (int) $item['id'],
            'product' => [
                'id' => (string) $item['product_id'],
                'name' => $item['product_name'],
                'description' => $item['product_description'],
                'category' => $item['product_category'],
                'department' => $item['product_department'],
                'image' => $item['product_image'],
                'price' => (float) ($item['unit_price'] ?? $item['product_price'] ?? 0),
                'sizes' => $sizes,
                'inStock' => true,
                'stockCount' => 0,
            ],
            'size' => $item['size'],
            'quantity' => (int) $item['quantity'],
        ];
    }

    $repStmt = $pdo->prepare('SELECT name, student_id, phone FROM class_representatives WHERE order_id = :order_id LIMIT 1');
    $repStmt->execute([':order_id' => $orderId]);
    $rep = $repStmt->fetch();

    return [
        'id' => $orderId,
        'orderNumber' => $row['order_number'],
        'studentName' => $row['student_name'],
        'studentId' => $row['student_id'],
        'email' => $row['email'],
        'phone' => $row['phone'],
        'department' => $row['department'],
        'courseYear' => $row['course_year'],
        'deliveryMethod' => $row['delivery_method'],
        'totalAmount' => (float) $row['total_amount'],
        'status' => $row['status'],
        'items' => $items,
        'classRepresentative' => $rep ? [
            'name' => $rep['name'],
            'studentId' => $rep['student_id'],
            'phone' => $rep['phone'],
        ] : null,
        'createdAt' => $row['created_at'],
        'updatedAt' => $row['updated_at'],
    ];
}

function generateOrderNumber(PDO $pdo): string
{
    return 'MMSU-' . substr((string) time(), -8);
}

