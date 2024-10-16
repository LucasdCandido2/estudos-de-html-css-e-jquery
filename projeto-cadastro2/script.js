$(document).ready(function(){
    const getData = function(){
        fetch('http://localhost:3000/usuarios')
        .then(response => {
            if(!response.ok){
                throw new Error('Erro ao conectar oa banco')
            }
            return response.json()
        })
        .then(data => {
            $('#usuariosTable tbody').empty();
            data.forEach(function(e){
                $('tbody').append(`
                    <tr data-id="${e.id}">
                        <td>${e.nome}</td>
                        <td>${e.senha}</td>
                        <td><button data-id="${e.id}" id="delete">Apagar</button></td>
                    </tr>
                    `);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar dados: ', error);
            alert('Erro ao buscar dados. Tente novamente mais tarde.');            
        });
    };

    $(document).on('click', '#delete', function(){
        let id = $(this).data('id');
        fetch(`http://localhost:3000/usuarios/${id}`,{
            method:'DELETE'
        })
        .then(() => {
            alert(`Usuario apagado`)
        })
    })
    

    //abrir e fechar o modal de login
    const modal = $('#loginModal');
    const span = $('.close');

    $('#abrirLogin').click(function(){
        modal.show();
    });

    span.click(function(){
        modal.hide();
    });

    $(window).on('submit', function(e){
        e.preventDefault();
        let nome = $('#loginNome').val();
        let senha = $('#loginSenha').val();

        let usuario = {
            nome: nome,
            senha: senha
        };

        $.ajax({
            url:'http://localhost:3000/usuarios',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(usuario),
            success: function(){
                alert('Usuario cadastrado com sucesso!');
                $('#cadastroForm')[0].reset();
            },
            error: function(){
                alert('Erro ao cadastrar usuario!');
            }
        });
    });

    //login do usuario
    $('#loginform').on('submit',function(e){
        e.preventDefault();
        let nome = $('#loginNome').val();
        let senha = $('#loginSenha').val();

        $.ajax({
            url:`http:localhost:3000/usuarios?nome=${nome}&senha=${senha}`,
            method:'GET',
            success: function(usuarios){
                if(usuarios.length > 0){
                    alert('Login com sucesso!');
                    modal.hide();
                }else{
                    $('#loginError').text('Nome ou senha invalidos.');
                }
            },
            error: function(){
                $('#loginError').text('Erro ao tentar fazer login.')
            }
        });
    });
    getData();
});