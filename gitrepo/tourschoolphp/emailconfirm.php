<?php
require_once "DatabaseModel.php";
require_once "cors.php";
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

try {
  $db = new DatabaseModel(); // Attempt to connect to the database
} catch (Exception $e) {
  echo json_encode(['error' => 'Database connection error: ' . $e->getMessage()]);
  exit();
}

$json = file_get_contents('php://input');
$data = json_decode(file_get_contents('php://input'), true);


$email = isset($data['email']) ? $data['email'] : null;
$verificationCode = isset($data['verificationCode']) ? $data['verificationCode'] : null;

if (
  !is_string($email) ||

  !is_string($verificationCode)
) {
  echo json_encode(['error' => 'Неверный формат данных']);
  exit();
}

$sqlSelectCuratorId = "SELECT verification_code FROM users WHERE email = ?";
$stmtSelectCuratorId = $db->prepare($sqlSelectCuratorId);
$stmtSelectCuratorId->bind_param("s", $email);
$stmtSelectCuratorId->execute();
$stmtSelectCuratorId->bind_result($verification_codeDB);
$stmtSelectCuratorId->fetch();
$stmtSelectCuratorId->close();

// Если куратор не найден, прерываем выполнение
if (!$verification_codeDB) {
  // Возвращаем ошибку или прерываем выполнение
  die('Ошибка регистрации: Неправильный код');
}

if ($verificationCode === $verification_codeDB) {
    // Prepare the UPDATE statement
    $sqlUpdate = "UPDATE users SET email_verified = 1, verification_code = NULL WHERE email = ?";
    $stmtUpdate = $db->prepare($sqlUpdate);
    $stmtUpdate->bind_param("s", $email);

    if ($stmtUpdate->execute()) {
        echo json_encode(['success' => true, 'message' => 'Email verified successfully!']); 
    } else {
        echo json_encode(['error' => 'Update failed: ' . $stmtUpdate->error]);
    }


    $stmtUpdate->close();
} else {
    echo json_encode(['error' => 'Вы ввели неверный код.']);
}


?>
