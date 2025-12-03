<?php

require_once __DIR__ . '/bootstrap.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetProducts($pdo);
        break;
    case 'POST':
        handleCreateProduct($pdo);
        break;
    case 'PUT':
        handleUpdateProduct($pdo);
        break;
    case 'DELETE':
        handleDeleteProduct($pdo);
        break;
    default:
        send_json(['error' => 'Method not allowed'], 405);
}

function handleGetProducts(PDO $pdo): void
{
    $query = 'SELECT id, legacy_id, name, description, price, category, department, image_url, in_stock, stock_count, sizes, created_at, updated_at
              FROM products ORDER BY id DESC';
    $stmt = $pdo->query($query);
    $products = [];
    while ($row = $stmt->fetch()) {
        $row['sizes'] = json_decode($row['sizes'], true) ?: [];
        $row['price'] = (float) $row['price'];
        $row['stock_count'] = (int) $row['stock_count'];
        $row['in_stock'] = (bool) $row['in_stock'];
        $products[] = $row;
    }

    send_json($products);
}

function handleCreateProduct(PDO $pdo): void
{
    $data = read_json_body();

    $stmt = $pdo->prepare(
        'INSERT INTO products (legacy_id, name, description, price, category, department, image_url, in_stock, stock_count, sizes, created_at, updated_at)
         VALUES (:legacy_id, :name, :description, :price, :category, :department, :image_url, :in_stock, :stock_count, :sizes, :created_at, :updated_at)'
    );

    $now = now();
    $stmt->execute([
        ':legacy_id' => $data['legacy_id'] ?? null,
        ':name' => $data['name'] ?? '',
        ':description' => $data['description'] ?? '',
        ':price' => $data['price'] ?? 0,
        ':category' => $data['category'] ?? '',
        ':department' => $data['department'] ?? '',
        ':image_url' => $data['image_url'] ?? '',
        ':in_stock' => !empty($data['in_stock']) ? 1 : 0,
        ':stock_count' => $data['stock_count'] ?? 0,
        ':sizes' => json_encode($data['sizes'] ?? []),
        ':created_at' => $now,
        ':updated_at' => $now,
    ]);

    $data['id'] = (int) $pdo->lastInsertId();
    $data['created_at'] = $now;
    $data['updated_at'] = $now;

    send_json($data, 201);
}

function handleUpdateProduct(PDO $pdo): void
{
    parse_str($_SERVER['QUERY_STRING'] ?? '', $params);
    $id = (int) ($params['id'] ?? 0);
    if ($id <= 0) {
        send_json(['error' => 'Product ID is required'], 400);
    }

    $data = read_json_body();
    $fields = [];
    $values = [];

    $map = [
        'legacy_id' => 'legacy_id',
        'name' => 'name',
        'description' => 'description',
        'price' => 'price',
        'category' => 'category',
        'department' => 'department',
        'image_url' => 'image_url',
        'in_stock' => 'in_stock',
        'stock_count' => 'stock_count',
    ];

    foreach ($map as $key => $column) {
        if (array_key_exists($key, $data)) {
            $fields[] = "$column = :$column";
            $values[":$column"] = ($key === 'in_stock') ? (int) $data[$key] : $data[$key];
        }
    }

    if (array_key_exists('sizes', $data)) {
        $fields[] = 'sizes = :sizes';
        $values[':sizes'] = json_encode($data['sizes'] ?? []);
    }

    if (!$fields) {
        send_json(['error' => 'No fields to update'], 400);
    }

    $values[':id'] = $id;
    $fields[] = 'updated_at = :updated_at';
    $values[':updated_at'] = now();

    $sql = 'UPDATE products SET ' . implode(', ', $fields) . ' WHERE id = :id';
    $stmt = $pdo->prepare($sql);
    $stmt->execute($values);

    send_json(['message' => 'Product updated']);
}

function handleDeleteProduct(PDO $pdo): void
{
    parse_str($_SERVER['QUERY_STRING'] ?? '', $params);
    $id = (int) ($params['id'] ?? 0);
    if ($id <= 0) {
        send_json(['error' => 'Product ID is required'], 400);
    }

    $stmt = $pdo->prepare('DELETE FROM products WHERE id = :id');
    $stmt->execute([':id' => $id]);

    send_json(['message' => 'Product deleted']);
}

