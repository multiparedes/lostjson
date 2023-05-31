<?php
$page = $_POST['page'];
$user = $_POST['user'];
$comment = $_POST['comment'];

$filePath = __DIR__ . "/" . $page+$user;

$data = array(
    'page' => $page,
    'user' => $user,
    'comment' => $comment
);

$jsonData = json_encode($data, JSON_PRETTY_PRINT);

$file = fopen($filePath, 'w');
if ($file) {
    fwrite($file, $jsonData);
    fclose($file);
    echo "JSON file created successfully!";
} else {
    echo "Error creating JSON file.";
}

?>