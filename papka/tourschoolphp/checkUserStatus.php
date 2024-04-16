<?php
require_once "DatabaseModel.php";
require_once "cors.php";
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$json = file_get_contents('php://input');

// Преобразовать JSON в ассоциативный массив
$data = json_decode($json, true);

// Проверка наличия ключа 'id' в массиве
if (isset($data['id'])) {
    // Получить id из данных
    $id = $data['id'];

    // Создаем экземпляр класса DatabaseModel
    $database = new DatabaseModel();

    // SQL query to check user status
    $sql = "SELECT * FROM user_blocks WHERE user_id = ?";

    $stmt = $database->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();

    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(["status" => "blocked"]);
    } else {
        echo json_encode(["status" => "active"]);
    }

    $database->close();
} else {
    echo json_encode(["error" => "Отсутствует ключ 'id' в данных"]);
}
