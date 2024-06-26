<?php
require_once "DatabaseModel.php";
require_once "cors.php";
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$json = file_get_contents('php://input');

// Преобразовать JSON в ассоциативный массив
$data = json_decode($json, true);

// Проверить наличие необходимых ключей в массиве $data
if (!isset($data['lesson'])) {
    echo json_encode(["error" => "Отсутствует необходимый ключ 'lesson'"]);
    exit;
}

// Получить title из данных
$lesson = $data['lesson'];

// Создаем экземпляр класса DatabaseModel
$database = new DatabaseModel();

$sql = "SELECT test.* FROM test
        JOIN lessons ON test.lesson_id = lessons.id
        WHERE lessons.title = ? ";

$stmt = $database->prepare($sql);
$stmt->bind_param("s", $lesson);
$stmt->execute();

$result = $stmt->get_result();
if ($result->num_rows > 0) {
    // Создаем массив для хранения всех строк
    $rows = array();

    // Обрабатываем каждую строку
    while ($row = $result->fetch_assoc()) {
        // Добавляем строку в массив
        $rows[] = $row;
    }

    // Возвращаем все строки в формате JSON
    echo json_encode($rows);
} else {
    echo json_encode(["error" => "Новость не найдена"]);
}

$database->close();
