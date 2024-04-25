<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once "DatabaseModel.php";

require_once "cors.php";
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

// Создание экземпляра PHPMailer
$mail = new PHPMailer(true);
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}
$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'];

// Подключение к базе данных
$db = new DatabaseModel();

// Подготовка SQL-запроса для выборки информации о пользователе
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");

// Привязка параметра к запросу
$stmt->bind_param("s", $id);

// Выполнение запроса
$stmt->execute();

// Получение результата запроса
$result = $stmt->get_result();

// Если пользователь найден
if ($result->num_rows > 0) {
    // Извлечение email из результата запроса
    $row = $result->fetch_assoc();
    $userEmail = $row['email'];

    // Настройка SMTP
    $mail->isSMTP();
    $mail->Host = 'tourschool.kz'; // Адрес SMTP-сервера
    $mail->SMTPAuth = true; // Включить аутентификацию
    $mail->Username = 'mail@tourschool.kz'; // Имя пользователя SMTP
    $mail->Password = 'R>zivbwh=6EW!29'; // Пароль SMTP (замените на ваш пароль)
    $mail->SMTPSecure = 'ssl'; // Протокол шифрования (ssl или tls)
    $mail->Port = 465; // Порт SMTP-сервера для защищенного соединения

    // Настройка электронного письма
    $mail->setFrom('mail@tourschool.kz', 'tourschool.kz');
    $mail->addAddress($userEmail); // Адрес получателя
    $mail->isHTML(true);
    $mail->Subject = 'Verification Code';
    $mail->Body = 'testmessage';

    // Отправка письма
  if ($mail->send()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Email sending failed: ' . $mail->ErrorInfo]);
}
} else {
    echo 'User not found';
}

// Закрытие соединения с базой данных
$db->close();
