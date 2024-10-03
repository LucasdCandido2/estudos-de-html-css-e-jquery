<?php
// Configurações de conexão com o banco de dados
$host = "172.104.194.117";  // Ou o nome do servidor do seu banco
$user = "user_lucas";
$password = "123.Mudar";
$dbname = "bd_lucas";

// Criando a conexão
$conn = new mysqli($host, $user, $password, $dbname);

// Verificando se a conexão deu certo
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}
?>
