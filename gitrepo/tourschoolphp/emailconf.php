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

$data2 = json_decode(file_get_contents('php://input'), true);
$email = $data2['email'];
$newVerificationCode = random_int(100000, 999999);
// Подключение к базе данных
$db = new DatabaseModel();
$sqlUpdate = "UPDATE users SET verification_code = ? WHERE email = ?";
$stmtUpdate = $db->prepare($sqlUpdate);
$stmtUpdate->bind_param("is", $newVerificationCode, $email);
if (!$stmtUpdate->execute()) {
    echo json_encode(['error' => 'Failed to update verification code: ' . $stmtUpdate->error]);
    exit();
}
$stmt = $db->prepare("SELECT * FROM users WHERE email = ?");

// Привязка параметра к запросу
$stmt->bind_param("s", $email);

// Выполнение запроса
$stmt->execute();

// Получение результата запроса
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['error' => 'Пользователь с таким email не найден']);
    exit();
}


// Если пользователь найден
if ($result->num_rows > 0) {
    // Извлечение email из результата запроса
    $row = $result->fetch_assoc();
    $verification_code = $row['verification_code'];

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
    $mail->addAddress($email); // Адрес получателя
    $mail->isHTML(true);
    $mail->Subject = 'Подтвердите свою почту';
    $mail->Body = 'Код подтверждения' .'<h3>'. $verification_code . '</h3>. Если вы не вводили свою почту, просто проигнорируйте это сообщение.';

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