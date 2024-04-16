<?php
require_once "DatabaseModel.php";
require_once "cors.php"; // Allow from any origin
header("Access-Control-Allow-Methods: DELETE"); // Allow DELETE method

// Get application ID from request parameters
$appId = $_GET['id'];

// Create a DatabaseModel instance
$database = new DatabaseModel();

// Prepare the DELETE query
$sql = "DELETE FROM Application WHERE id = ?";

// Prepare the statement
$statement = $database->prepare($sql);

// Bind the application ID to the statement
$statement->bind_param("i", $appId);

// Execute the statement
$success = $statement->execute();

// Check if deletion was successful
if ($success) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Failed to delete application']);
}

// Close the statement and database connection
$statement->close();
$database->close();
