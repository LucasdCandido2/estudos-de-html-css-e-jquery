<?php
include 'conexao.php';

// Verifica o método da requisição e realiza a operação apropriada
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $action = $_POST['action'];

    if ($action == 'create') {
        // Operação de criação de usuário
        $nome = $_POST['nome'];
        $email = $_POST['email'];

        $sql = "INSERT INTO usuarios (nome, email) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $nome, $email);
        if ($stmt->execute()) {
            echo "Usuário cadastrado com sucesso!";
        } else {
            echo "Erro ao cadastrar usuário!";
        }
    } elseif ($action == 'update') {
        // Operação de atualização de usuário
        $id = $_POST['id'];
        $nome = $_POST['nome'];
        $email = $_POST['email'];

        $sql = "UPDATE usuarios SET nome = ?, email = ? WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssi", $nome, $email, $id);
        if ($stmt->execute()) {
            echo "Usuário atualizado com sucesso!";
        } else {
            echo "Erro ao atualizar usuário!";
        }
    } elseif ($action == 'delete') {
        // Operação de exclusão de usuário
        $id = $_POST['id'];

        $sql = "DELETE FROM usuarios WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            echo "Usuário excluído com sucesso!";
        } else {
            echo "Erro ao excluir usuário!";
        }
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET['action']) && $_GET['action'] == 'getUser') {
        // Retorna os dados de um usuário específico para edição
        $id = $_GET['id'];
        $sql = "SELECT * FROM usuarios WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        echo json_encode($result);
    } else {
        // Retorna a lista de todos os usuários
        $sql = "SELECT * FROM usuarios";
        $result = $conn->query($sql);
        while ($row = $result->fetch_assoc()) {
            echo "<tr>
                    <td>{$row['nome']}</td>
                    <td>{$row['email']}</td>
                    <td>
                        <button class='edit-btn' data-id='{$row['id']}'>Editar</button>
                        <button class='delete-btn' data-id='{$row['id']}'>Excluir</button>
                    </td>
                  </tr>";
        }
    }
}
?>
