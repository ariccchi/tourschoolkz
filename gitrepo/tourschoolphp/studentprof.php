<?php
require_once "DatabaseModel.php";
require_once "cors.php";
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$json = file_get_contents('php://input');

// Преобразовать JSON в ассоциативный массив
$data = json_decode($json, true);

// Получить title из данных
$user = $data['user'];

// Создаем экземпляр класса DatabaseModel
$database = new DatabaseModel();

$sql = "SELECT u.id, u.name, u.surname, u.email, u.birthdate, u.registration_date, u.role, u.city,
               u.curator, c.name AS curator_name, c.surname AS curator_surname
        FROM users u
        LEFT JOIN users c ON u.curator = c.id
        WHERE u.id = ?";

$stmt = $database->prepare($sql);
$stmt->bind_param("s", $user);
$stmt->execute();

$result = $stmt->get_result();
if ($result->num_rows > 0) {
    // Создаем массив для хранения всех строк
    $rows = array();

    // Обрабатываем каждую строку
    while ($row = $result->fetch_assoc()) {
        if ($row['curator'] !== 0) {
            // Вывести информацию о кураторе
            $row['curator_info'] = [
                'name' => $row['curator_name'],
                'surname' => $row['curator_surname']
            ];
        }
        $rows[] = $row;
    }

    // Возвращаем все строки в формате JSON
    echo json_encode($rows);
} else {
    echo json_encode(["error" => "Новость не найдена"]);
}

$database->close();
