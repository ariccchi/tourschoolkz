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

// Запрос на выборку сообщений
$sql_select = "SELECT sender_user_id, message_id, receiver_user_id, message_text, created_at, is_read, file_name FROM messages 
               WHERE (receiver_user_id = ? AND sender_user_id = ?) OR (receiver_user_id = ? AND sender_user_id = ?)
               ORDER BY message_id";

$stmt_select = $db->prepare($sql_select);
$stmt_select->bind_param("iiii", $receiver_user_id, $sender_user_id, $sender_user_id, $receiver_user_id);
$stmt_select->execute();

$result = $stmt_select->get_result();
$messages = $result->fetch_all(MYSQLI_ASSOC);

$stmt_select->close(); // Закрыть запрос на выборку

$db->close(); // Закрыть соединение с базой данных

echo json_encode($messages);
