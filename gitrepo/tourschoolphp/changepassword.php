<?php
require_once "DatabaseModel.php";
require_once "cors.php";

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

try {
    $db = new DatabaseModel();
} catch (Exception $e) {
    echo json_encode(['error' => 'Ошибка подключения к базе данных: ' . $e->getMessage()]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['error' => 'Недостаточно данных для обновления пароля']);
    exit();
}

$email = $data['email'];
$password = $data['password'];

// Хеширование пароля
$hashedPassword = hash_bcrypt($password, 10);

// Обновление пароля в базе данных
$sqlUpdate = "UPDATE users SET password = ? WHERE email = ?";
$stmt = $db->prepare($sqlUpdate);
$stmt->bind_param("ss", $hashedPassword, $email);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Пароль успешно обновлен']);
} else {
    echo json_encode(['error' => 'Ошибка при обновлении пароля: ' . $stmt->error]);
}

$stmt->close();
$db->close();

function hash_bcrypt($password, $cost = 10)
{
    $salt = strtr(base64_encode(random_bytes(16)), '+', '.');
    $hash = crypt($password, '$2a$' . $cost . '$' . $salt);
    return $hash;
}
?>