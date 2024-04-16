<?php
require_once "cors.php";
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once "DatabaseModel.php";
$db = new DatabaseModel();

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

// Проверка успешности декодирования JSON
if ($request === null) {
    echo json_encode(["error" => "Некорректные данные JSON"]);
    exit;
}

// Проверка наличия sender_user_id и receiver_user_id в запросе
if (!isset($request->sender_user_id) || !isset($request->receiver_user_id)) {
    echo json_encode(["error" => "sender_user_id или receiver_user_id не указаны"]);
    exit;
}

$sender_user_id = $request->sender_user_id;
$receiver_user_id = $request->receiver_user_id;

// Запрос на обновление статуса is_read
$sql_update = "UPDATE messages SET is_read = 1 
               WHERE sender_user_id = ? AND receiver_user_id = ? AND is_read = 0";

$stmt_update = $db->prepare($sql_update);
$stmt_update->bind_param("ii", $receiver_user_id, $sender_user_id);
$stmt_update->execute();
$stmt_update->close(); // Закрыть запрос на обновление


$db->close(); // Закрыть соединение с базой данных

echo json_encode($messages);
