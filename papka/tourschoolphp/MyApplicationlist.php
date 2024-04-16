<?php
require_once "DatabaseModel.php";
require_once "cors.php";

// Создаем экземпляр класса DatabaseModel
$database = new DatabaseModel();

// Получаем значение параметра id из URL
$appId = $_GET['id'];

// Подготавливаем SQL-запрос с использованием подстановки значений
$sql = "SELECT *
        FROM Application WHERE workerid = ?";

// Используем подготовленный запрос для безопасной передачи параметров в SQL
$stmt = $database->prepare($sql);
$stmt->bind_param("i", $appId); // "i" указывает, что ожидается целочисленное значение
$stmt->execute();
$result = $stmt->get_result();

// Проверяем, есть ли результат
if ($result->num_rows > 0) {
    // Создаем массив для хранения результатов
    $output = array();

    // Добавляем каждую строку в массив
    while ($row = $result->fetch_assoc()) {
        $output[] = $row;
    }

    // Возвращаем данные в формате JSON
    echo json_encode($output);
} else {
    echo "0 результатов";
}

// Закрываем соединение с базой данных
$stmt->close();
$database->close();
