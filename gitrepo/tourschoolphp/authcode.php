<?php

require_once "DatabaseModel.php";
require_once "cors.php";

// Настройки заголовков
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

// Проверка метода запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// Получение данных из запроса
$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];

// Подключение к базе данных
$db = new DatabaseModel();

// Проверка роли пользователя
$stmt = $db->prepare("SELECT role FROM users WHERE id = ?");
$stmt->bind_param("s", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // Пользователь не найден
    http_response_code(404);
    echo json_encode(['error' => 'User not found']);
    exit;
}

$user = $result->fetch_assoc();

if (!in_array($user['role'], ['admin', 'curator'])) {
    // У пользователя нет прав
    http_response_code(403);
    echo json_encode(['error' => 'В доступе отказано']);
    exit;
}

// Генерация уникального кода
do {
    $unic_code = random_int(100000, 999999);
    $stmt = $db->prepare("SELECT COUNT(*) FROM authcode WHERE unic_code = ?");
    $stmt->bind_param("i", $unic_code);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_row();
} while ($result[0] > 0);
$stmt = $db->prepare("SELECT COUNT(*) FROM authcode WHERE unic_code = ?");
$stmt->bind_param("i", $unic_code);
$stmt->execute();
$result = $stmt->get_result()->fetch_row();
if ($result[0] > 0) {
    // Код уже существует, ничего не делаем
} else {
    // Код уникален, вставляем запись
    $insert_stmt = $db->prepare("INSERT INTO authcode (curator_id, unic_code) VALUES (?,  ?)");
    $insert_stmt->bind_param("si", $id, $unic_code);
    
    if ($insert_stmt->execute()) {
        // Вставка прошла успешно
        $response = [
            'success' => true,
            'unic_code' => $unic_code
        ];
    } else {
        // Ошибка при вставке
        $response = [
            'success' => false,
            'error' => 'Ошибка при создании кода авторизации'
        ];
    }
}

// Ответ
echo json_encode($response);

// Закрытие соединения с базой данных
$db->close(); 

?>