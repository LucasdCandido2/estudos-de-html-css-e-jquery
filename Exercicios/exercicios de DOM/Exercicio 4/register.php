<?php
// Incluir o arquivo de conexão
include('conexao.php');

// Verificar se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $senha = password_hash($_POST['senha'], PASSWORD_DEFAULT); // Criptografa a senha

    // SQL para inserir o registro no banco
    $sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";

    // Preparar a consulta
    if ($stmt = $conn->prepare($sql)) {
        $stmt->bind_param("sss", $nome, $email, $senha);

        // Executar a consulta
        if ($stmt->execute()) {
            echo "Cadastro realizado com sucesso!";
        } else {
            echo "Erro: " . $stmt->error;
        }

        $stmt->close();
    }

    // Fechar a conexão
    $conn->close();
}
?>
