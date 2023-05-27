<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Obtener los datos enviados desde el formulario
  $user = $_POST['username'];
  $comment = $_POST['comment'];

  echo('asdasda');
  // Realizar cualquier validación adicional si es necesario

  // Aquí puedes agregar el código para actualizar el archivo JSON con los datos recibidos

  // Devolver una respuesta adecuada a la solicitud
  $response = array('success' => true);
  echo json_encode($response);
}
?>
