<?php
$host = 'localhost';
$user = 'root';
$password = '';
$dbname = 'your_database_name';

// Connect to MySQL
$conn = new mysqli($host, $user, $password, $dbname);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Get POST data
$asset_tag = $_POST['asset_tag'];
$category = $_POST['Category'];
$asset_name = $_POST['asset_name'];
$manufacturer = $_POST['Manufacturer'];
$model = $_POST['Model'];
$serial_number = $_POST['serial_number'];
$location = $_POST['Location'];
$assigned_to = $_POST['assigned_to'];
$department = $_POST['Department'];
$status = $_POST['Status'];
$date = date('Y-m-d H:i:s');

// Insert into database
$sql = "INSERT INTO assets (asset_tag, category, asset_name, manufacturer, model, serial_number, location, assigned_to, department, asset_status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssssssss", $asset_tag, $category, $asset_name, $manufacturer, $model, $serial_number, $location, $assigned_to, $department, $status, $date);

if ($stmt->execute()) {
  echo "Asset added successfully";
} else {
  echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>