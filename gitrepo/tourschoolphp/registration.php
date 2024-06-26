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

$username = isset($data['name']) ? $data['name'] : null;
$surname = isset($data['surname']) ? $data['surname'] : null;
$email = isset($data['email']) ? $data['email'] : null;
$password = isset($data['password']) ? $data['password'] : null;
$confirmPassword = isset($data['confirmPassword']) ? $data['confirmPassword'] : null;
$dob = isset($data['dob']) ? $data['dob'] : null;
$curatorUsername = isset($data['curatorUsername']) ? $data['curatorUsername'] : null;
$registration_date = isset($data['registration_date']) ? $data['registration_date'] : null;
$role = isset($data['role']) ? $data['role'] : null;
$city = isset($data['city']) ? $data['city'] : null;
$timestamp = isset($data['timestamp']) ? $data['timestamp'] : null;

function generateVerificationCode($length = 6)
{
    $characters = '0123456789';
    $code = '';
    for ($i = 0; $i < $length; $i++) {
        $code .= $characters[random_int(0, strlen($characters) - 1)];
    }
    return $code;
}
$verificationCode = generateVerificationCode();
// Проверка формата данных
if (
  !is_string($username) ||
  !is_string($email) ||
  !is_string($password) ||
  !is_string($confirmPassword) ||
  !is_string($dob) ||
  !is_string($curatorUsername) ||
  !is_string($role) ||
  !is_string($city) ||
  !is_string($surname)
) {
  echo json_encode(['error' => 'Неверный формат данных']);
  exit();
}

// Проверка совпадения паролей
if ($password !== $confirmPassword) {
  echo json_encode(['error' => 'Пароли не совпадают']);
  exit();
}

$sqlSelectCuratorId = "SELECT curator_id, student_id FROM authcode WHERE unic_code = ?";
$stmtSelectCuratorId = $db->prepare($sqlSelectCuratorId);
$stmtSelectCuratorId->bind_param("s", $curatorUsername);
$stmtSelectCuratorId->execute();
$stmtSelectCuratorId->bind_result($curator_id, $student_id);
$stmtSelectCuratorId->fetch();
$stmtSelectCuratorId->close();

// Если куратор не найден, прерываем выполнение
if (!$curator_id) {
  // Возвращаем ошибку или прерываем выполнение
  die('Ошибка регистрации: указанный код не принадлежит куратору.');
}

if ($student_id !== null) {
  // Получаем email_verified из таблицы users для данного student_id
  $sqlCheckEmailVerified = "SELECT email_verified FROM users WHERE id = ?";
  $stmtCheckEmailVerified = $db->prepare($sqlCheckEmailVerified);
  $stmtCheckEmailVerified->bind_param("i", $student_id);
  $stmtCheckEmailVerified->execute();
  $stmtCheckEmailVerified->bind_result($email_verified);
  $stmtCheckEmailVerified->fetch();
  $stmtCheckEmailVerified->close();

  if ($email_verified == 1) {
      die('Ошибка регистрации: данный unic_code уже использован для верифицированного пользователя.');
  }
}



$sqlSelectCuratorCity = "SELECT city FROM users WHERE id = ?";
$stmtSelectCuratorCity = $db->prepare($sqlSelectCuratorCity);
$stmtSelectCuratorCity->bind_param("i", $curator_id);
$stmtSelectCuratorCity->execute();
$stmtSelectCuratorCity->bind_result($curator_city);
$stmtSelectCuratorCity->fetch();
$stmtSelectCuratorCity->close();

function hash_bcrypt($password, $cost = 10)
{
  $salt = strtr(base64_encode(random_bytes(16)), '+', '.');
  $hash = crypt($password, '$2a$' . $cost . '$' . $salt);
  return $hash;
}
$sqlCheckEmail = "SELECT COUNT(*) AS count, email_verified FROM users WHERE email = ?";
$stmtCheckEmail = $db->prepare($sqlCheckEmail);
$stmtCheckEmail->bind_param("s", $email);
$stmtCheckEmail->execute();
$stmtCheckEmail->bind_result($emailCount, $emailVerified);
$stmtCheckEmail->fetch();
$stmtCheckEmail->close();


if ($emailCount > 0) {
  if ($emailVerified == 1) {
      echo json_encode(['error' => 'Этот email-адрес уже зарегистрирован и верифицирован']);
      exit();
  } else {
      // Удалить существующую запись с email и email_verified = 0
      $sqlDeleteUser = "DELETE FROM users WHERE email = ?";
      $stmtDeleteUser = $db->prepare($sqlDeleteUser);
      $stmtDeleteUser->bind_param("s", $email);
      $stmtDeleteUser->execute();
      $stmtDeleteUser->close();
  }
}

$hashedPassword = hash_bcrypt($password, 10);
$sqlInsertUser = "INSERT INTO users (name, surname, password, email, registration_date, role, birthdate, city, verification_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmtInsertUser = $db->prepare($sqlInsertUser);
$stmtInsertUser->bind_param("sssssssss", $username, $surname, $hashedPassword, $email, $timestamp, $role, $dob, $city, $verificationCode);
$stmtInsertUser->execute();

// Проверка успешности вставки пользователя
if ($stmtInsertUser->affected_rows > 0) {
  // Получение user_id нового пользователя
  $user_id = $stmtInsertUser->insert_id;

  // Обновление записи пользователя с информацией о кураторе
  $sqlUpdateUser = "UPDATE users SET curator = ? WHERE id = ?";
  $stmtUpdateUser = $db->prepare($sqlUpdateUser);
  $stmtUpdateUser->bind_param("ii", $curator_id, $user_id);
  $stmtUpdateUser->execute();
  $stmtUpdateUser->close();

  
  $sqlUpdateCode = "UPDATE authcode SET student_id = ? WHERE unic_code = ?";
  $stmtUpdateCode = $db->prepare($sqlUpdateCode);
  $stmtUpdateCode->bind_param("ii", $user_id, $curatorUsername);
  $stmtUpdateCode->execute();
  $stmtUpdateCode->close();
  
  // Отправка успешного ответа
  echo json_encode(['success' => true]);
} else {
  // В случае ошибки вставки пользователя
  echo json_encode(['error' => 'Ошибка вставки данных в таблицу users']);
}
?>
