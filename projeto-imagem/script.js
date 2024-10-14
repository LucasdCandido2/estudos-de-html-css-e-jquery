$(document).ready(function() {
    // Função para carregar e exibir as imagens existentes
    function loadImages() {
        // $.ajax({
        //     url: 'http://localhost:3000/images',
        //     type: 'GET',
        //     success: function(data) {
        //         $('#uploadedImages').empty();
        //         data.forEach(function(image) {
        //             let imgElement = $('<img>').attr('src', image.base64);
        //             $('#uploadedImages').append(imgElement); // Corrigido para o ID correto
        //         });
        //     },
        //     error: function(xhr, status, error) {
        //         $('#status').text('Erro ao carregar imagens: ' + error).css('color', 'red');
        //     }
        // });
        let xhr = new XMLHttpRequest();
        xhr.open('GET','http://localhost:3000/images', true);


        xhr.onload = function() {
            if(xhr.status === 200){
                let data = JSON.parse(xhr.responseText);
                $('#uploadedImages').empty();
                data.forEach(function(image){
                    let imgElement = $('<img>').attr('src', image.base64);
                    $('#uploadedImages').append(imgElement);
                });
            } else {
                $('#status').text('Erro ao carregar imagens.').css('color','red');
            };
        }
        xhr.send();
    }

    // Carrega todas as imagens ao iniciar
    loadImages();

    // Manipulador do formulário de upload
    // $('#uploadForm').on('submit', function(e) {
    //     e.preventDefault();

    //     let fileInput = $('#fileInput')[0];
    //     if (fileInput.files.length === 0) {
    //         alert('Selecione uma imagem para fazer upload.');
    //         return;
    //     }

    //     let file = fileInput.files[0];

    //     // Validação opcional: verificar o tipo e tamanho do arquivo
    //     if (!file.type.startsWith('image/')) {
    //         alert('Por favor, selecione um arquivo de imagem.');
    //         return;
    //     }

    //     let reader = new FileReader();

    //     reader.onloadstart = function() {
    //         $('#progressBar').css('width', '0%').text('0%').css('background-color', '#4caf50');
    //         $('#status').text('');
    //     };

    //     reader.onprogress = function(e) {
    //         if (e.lengthComputable) {
    //             let percentLoad = Math.round((e.loaded / e.total) * 100);
    //             $('#progressBar').css('width', percentLoad + '%').text(percentLoad + '%');
    //         }
    //     };

    //     reader.onload = function() {
    //         let base64Image = reader.result; // Corrigido de "bade64Image"
    //         console.log(base64Image); // Verificar se a imagem é carregada corretamente
    //         // if (!base64Image) {
    //         // $('#status').text('Erro ao processar a imagem.').css('color', 'red');
    //         // return;
    //         // }

    //         // Preparar os dados para envio
    //         let imageData = {
    //             id: Date.now(), // Corrigido de "Date.new()"
    //             name: file.name,
    //             base64: base64Image
    //         };

    //         // Enviar para o json-server
    //         $.ajax({
    //             url: 'http://localhost:3000/images',
    //             type: 'POST',
    //             data: JSON.stringify(imageData), // Corrigido de "dara"
    //             contentType: 'application/json',
    //             // beforeSend: function(xhr) {
    //             //     xhr.upload.onprogress = function(e) {
    //             //         console.log('Enviando imagem:', imageData);
    //             //         if (e.lengthComputable) {
    //             //             let percentComplete = Math.round((e.loaded / e.total) * 100);
    //             //             $('#progressBar').css('width', percentComplete + '%').text(percentComplete + '%');
    //             //         }
    //             //     };
    //             // },
    //             success: function(response) {
    //                 // console.log('Upload completo:', response);
    //                 $('#status').text('Upload completo!').css('color', 'green'); // Corrigido de "compelto"
    //                 $('#progressBar').css('background-color', '#4caf50');
    //                 loadImages(); // Atualiza a lista de imagens
    //                 $('#uploadForm')[0].reset(); // Corrigido o seletor
    //             },
    //             error: function(xhr, status, error) {
    //                 console.log('Erro no upload:', error);
    //                 $('#status').text('Erro no upload: ' + error).css('color', 'red');
    //                 $('#progressBar').css('background-color', 'red');
    //             }
    //         });
    //     };

    //     reader.onerror = function() {
    //         $('#status').text('Erro ao ler o arquivo.').css('color', 'red');
    //     };

    //     // Inicia a leitura do arquivo como Data URL (Base64)
    //     reader.readAsDataURL(file);
    // });

    $('#uploadForm').on('submit',function(e){
        e.preventDefault();

        let fileInput = $('#fileInput')[0];
        if(fileInput.files.length === 0){
            alert('Selecione uma imagem para fazer upload.')
            return;
        }

        let file = fileInput.files[0];

        let reader = new FileReader();

        reader.onprogress = function(e){
            if(e.lengthComputable){
                let percentLoad = Math.round((e.loaded / e.total) * 100);
                $('#progressBar').css('width', percentLoad + '%').text(percentLoad + '%');
            }
        };

        reader.onload = function(){
            let base64Image = reader.result;
            let imageData = {
                id: Date.now(),
                name: file.name,
                base64:base64Image
            };

            //usando XMLHttpRequest para o envio do arquivo
            let xhr = new XMLHttpRequest();
            xhr.open('POST','http://localhost:3000/images', true)
            xhr.setRequestHeader('Content-type','application/json');

            xhr.onload = function(){
                if(xhr.status === 200 || xhr.status === 201){
                    $('#status').text('Upload completo!').css('color', 'green');
                    $('#progressBar').css('background-color', '#4caf50');
                    loadImages();
                    $('#uploadForm')[0].reset();
                }else{
                    $('#status').text('Erro no upload: ' + xhr.statusText).css('color','red');
                    $('#progressBar').css('background-color','red');
                }
            };

            xhr.onerror = function(){
                $('#status').text('Erro no upload.').css('color', 'red');
                $('#progressBar').css('background-color', 'red');
            };

            xhr.send(JSON.stringify(imageData));
        };

        reader.onerror = function(){
            $('#status').text('Erro ao ler o arquivo.').css('color', 'red');
        };

        reader.readAsDataURL(file);
    })
});
