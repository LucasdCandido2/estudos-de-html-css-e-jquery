$(document).ready(function() {
    // Captura o envio do formulário
    $('#form-cadastro').on('submit', function(event) {
        event.preventDefault();

        // Captura os dados do formulário
        var nome = $('#nome').val();
        var email = $('#email').val();
        var idade = $('#idade').val();
        var imagem = $('#imagem')[0].files[0];  // Arquivo de imagem

        // Função para salvar os dados localmente (simulação de JSON)
        var dadosFormulario = {
            nome: nome,
            email: email,
            idade: idade,
            imagem: imagem.name  // Nome do arquivo de imagem
        };

        // Simulação de gravação dos dados do form (JSON)
        localStorage.setItem('formData', JSON.stringify(dadosFormulario));

        // Simulação de gravação da imagem
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imagem-preview').attr('src', e.target.result);  // Exibe a imagem no preview
        }
        reader.readAsDataURL(imagem);  // Converte para Base64 e exibe no navegador

        alert('Dados e imagem salvos localmente (simulado).');
        $('input').val('');
    });

    // Carrega a imagem para preview antes do envio
    $('#imagem').on('change', function() {
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imagem-preview').attr('src', e.target.result);
        }
        reader.readAsDataURL(file);
    });
});
