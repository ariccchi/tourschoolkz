<?php
require_once "DatabaseModel.php";

require_once "cors.php";
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');



$data = json_decode(file_get_contents('php://input'), true);
$appID = $data['appID'];
$id = $data['id'];

$db = new DatabaseModel();

// Update Application
$sql = "UPDATE Application SET status = 'Successful', workerid = ?, progress_time = NOW() WHERE id = ?";
$stmt = $db->prepare($sql);

if (!$stmt) {
    echo json_encode(['error' => 'Error preparing statement']);
    exit();
}

$stmt->bind_param("ss", $id, $appID);

if (!$stmt->execute()) {
    echo json_encode(['error' => 'Error executing statement']);
    exit();
}

$stmt->close();

echo json_encode(['success' => true]);
