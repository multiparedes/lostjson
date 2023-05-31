<?php
  $user = $_POST['username'];
  $comment = $_POST['comment'];

$filePath = __DIR__ . "/" . $page+$user;

$data = array(
    'user' => $username,
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