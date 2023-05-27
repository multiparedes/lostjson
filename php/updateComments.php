<?php
// Obtener los datos enviados desde JavaScript
$id = $_POST['page'];
$user = $_POST['user'];
$comment = $_POST['comment'];

// Leer el contenido del archivo JSON
$jsonData = file_get_contents('../json/comentaris.json');
$data = json_decode($jsonData, true);

// Verificar si el array de comentarios ya existe
if (!isset($data["comentaris"])) {
    $data["comentaris"] = array();
}

// Crear un nuevo comentario utilizando los datos recibidos
$newComment = array(
    "page" => $id,
    "user" => $user,
    "desc" => $comment
);

// Agregar el nuevo comentario al array existente
$data["comentaris"][] = $newComment;

// Codificar el array modificado nuevamente en formato JSON
$jsonData = json_encode($data);

// Escribir el contenido JSON modificado nuevamente en el archivo
file_put_contents('../json/comentaris.json', $jsonData);

// Devolver una respuesta adecuada a la solicitud AJAX
$response = array('success' => true);
echo json_encode($response);
?>
