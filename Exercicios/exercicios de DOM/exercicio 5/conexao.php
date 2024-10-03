<?php
// $host = "localhost";  // Servidor do banco de dados
// $user = "seu_usuario_mysql";  // Usuário do banco de dados
// $password = "sua_senha_mysql";  // Senha do banco de dados
// $dbname = "cadastro_usuarios";  // Nome do banco de dados

$host = "172.104.194.117";  // Ou o nome do servidor do seu banco
$user = "user_lucas";
$password = "123.Mudar";
$dbname = "db_lucas";

$conn = new mysqli($host, $user, $password, $dbname);

// Verificar se a conexão foi bem-sucedida
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}
?>
