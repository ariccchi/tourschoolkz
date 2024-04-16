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
$title = $data['title'];

// Создаем экземпляр класса DatabaseModel
$database = new DatabaseModel();
$sql = "SELECT u.id, u.name, u.surname, u.email, u.avatar
FROM users u
WHERE u.id IN (SELECT curator FROM users WHERE id = ?)
   OR u.role = 'admin';
";

$stmt = $database->prepare($sql);
$stmt->bind_param("s", $title);
$stmt->execute();
$result = $stmt->get_result();

// Проверяем, есть ли результат
if ($result->num_rows > 0) {
    // Инициализируем пустой массив для хранения всех строк
    $students = [];

    // Извлекаем все строки
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }

    // Теперь получим последнее сообщение для каждого студента
    foreach ($students as &$student) {
        $student_id = $student['id'];
        $message_sql = "SELECT message_text, created_at,message_id
                        FROM messages 
                        WHERE (sender_user_id = ? AND receiver_user_id = ?)
                        OR (receiver_user_id = ? AND sender_user_id = ?)
                        ORDER BY message_id DESC 
                        LIMIT 1";

        $stmt = $database->prepare($message_sql);
        $stmt->bind_param("iiii", $student_id, $title, $student_id, $title);
        $stmt->execute();
        $message_result = $stmt->get_result();

        if ($message_result->num_rows > 0) {
            $last_message = $message_result->fetch_assoc();
            $student['last_message'] = [
                'message_text' => $last_message['message_text'],
                'message_id' => $last_message['message_id'],
                'created_at' => $last_message['created_at']
            ];
        } else {
            $student['last_message'] = null;
        }
    }
    foreach ($students as &$student) {
        $student_id = $student['id'];
        $unread_message_sql = "SELECT COUNT(*) AS unread_messages 
                                FROM messages 
                                WHERE receiver_user_id = ? 
                                AND sender_user_id = ? 
                                AND is_read = 0";

        $stmt = $database->prepare($unread_message_sql);
        $stmt->bind_param("ii", $title, $student_id);
        $stmt->execute();
        $unread_message_result = $stmt->get_result();

        if ($unread_message_result->num_rows > 0) {
            $unread_message_row = $unread_message_result->fetch_assoc();
            $student['unread_messages'] = $unread_message_row['unread_messages'];
        } else {
            $student['unread_messages'] = 0;
        }
    }
    // Возвращаем данные в формате JSON
    echo json_encode($students);
} else {
    echo json_encode(["error" => "Ученики не найдены"]);
}

// Закрываем соединение с базой данных
$database->close();
