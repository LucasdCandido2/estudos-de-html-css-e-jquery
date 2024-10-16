$(document).ready(function(){
    $('#form-cadastro').on('submit', function(e){
        e.preventDefault();

        //criar objeto formdata para enviar com os arquivos
        let formData = new FormData(this);

        //fazer o envio via AJAX para o backend
        $.ajax({
            url:'/submit',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response){
                $('#mensagem').text(response);
            },
            error: function(error){
                $('#mensagem').text(error);
            }
        });
    });
});