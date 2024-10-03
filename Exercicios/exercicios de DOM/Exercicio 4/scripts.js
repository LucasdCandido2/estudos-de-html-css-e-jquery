$(document).ready(function(){
    $('#register-form').submit(function(e){
        e.preventDefault(); //Evita o envio do formulario

        //limpar mensagens de erro anteriores
        $('.error-message').text('').hide();

        //validações
        let valid = true;

        //validando o nome
        let name = $('#name').val().trim();
        if (name === "") {
            $('#name').next('.error-message').text('O nome é obrigatorio.').show();
            valid = false;
        }

        //validação do e-mail
        let email = $('#email').val().trim();
        let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === "") {
            $('#email').next('.error-message').tex('O e-mail é obrigatorio').show();
            valid = false;
        } else if (!emailRegex.test(email)) {
            $('#email').next('.error-message').text('Digite um e-mail valido').show();
            valid = false;
        }

        //validação da senha
        let password = $('#password').val().trim();
        if (password.length < 6) {
            $('#password').next('.error-message').text('A senha deve ter no minimo 6 caracteres.');
            valid = false;
        }

        //validação da confirmação da senha
        let confirmPassword = $('#confirm-password').val().trim();
        if (confirmPassword !== password) {
            $('#confirm-password').next('.error-message').text('As senhas não coincidem.').show();
            valid = false;
        }

        //se o formulario estiver valido, pode ser enviado (por enquanto, apenas exibe uma mensagem)
        if (valid) {
            alert('Cadastro realizado com sucesso!');
            //aqui você poderia adiconar o backend ou uma nova funcionalidade
        }
    });
});