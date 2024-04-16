<?php
require_once "DatabaseModel.php";

require_once "cors.php";
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

$json = file_get_contents('php://input');
$data = json_decode(file_get_contents('php://input'), true);

$name = isset($data['name']) ? $data['name'] : null;
$phone = isset($data['phone']) ? $data['phone'] : null;
$email = isset($data['email']) ? $data['email'] : null;

// Check if any required fields are NULL
if (empty($name) || empty($phone) || empty($email)) {
    echo json_encode(['status' => 'empty']);
    exit();
}

// Проверка на NULL
if ($name === null || $phone === null || $email === null) {
    echo json_encode(['status' => 'empty']);
    exit();
}


$db = new DatabaseModel();

$sql = "INSERT INTO Application (name, phone, email) VALUES (?, ?, ?)";
$stmt = $db->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => 'Error preparing statement']);
    exit();
}

$stmt->bind_param("sss", $name, $phone, $email);

if (!$stmt->execute()) {
    echo json_encode(['error' => 'Error executing statement']);
    exit();
}

$stmt->close();

echo json_encode(['status' => 'success']);
