$(document).ready(function(){
    function loadUsers() {
        $.ajax({
            url: 'crud.php',
            type: 'GET',
            success: function(response) {
                $('#user-list').html(response);
            }
        });

        //função para enviar dados ao banco (create e update)
        $('#user-form').on('submit', function (e) {
            e.preventDefault();

            let userId = $('#user-id').val();//identifica se esta criando ou editando
            let nome = $('#name').val();
            let email = $('#email').val();

            $.ajax({
                url: 'crud.php',
                type: 'POST',
                data: {
                    id: userId,
                    nome: nome,
                    email: email,
                    action: userId ? 'update' : 'create' //verifica se é criação ou edição
                },
                success: function (response) {
                    alert(response);
                    $('#user-form')[0].reset(); //reseta o formulario
                    loadUsers(); // recarrega a lista de usuarios
                }
            });
        });

        //função para editar um usuario (preenche os campos com os dados)
        $(document).on('click', '.edit-btn', function(){
            let userId = $(this).data('id');
            $.ajax({
                url: 'crud.php',
                type: 'GET',
                data: {id:userId,action:'getUser'},
                success: function(response){
                    let user = JSON.parse(response);
                    $('#user-id').val(user.id);
                    $('#name').val(user.nome);
                    $('$email').val(user.email);
                }
            });
        });


        //função para excluir um usuario
        $(document).on('click','.delete-btn', function(){
            let userId = $(this).data('id');
            if (confirm('Tem certeza que deseja excluir este usuario?')) {
                $.ajax({
                    url: 'crud.php',
                    type: 'POST',
                    data:{id:userId,action:'delete'},
                    success: function(response) {
                        alert(response);
                        loadUsers(); // recarrega a lista de usuarios
                    }
                });
            }
        });

        //carrega os usuarios ao iniciar a pagina
        loadUsers();
    }
})