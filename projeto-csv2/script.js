$(document).ready(function() {
    let fileContents = []; //variavel para armazenar o conteudo do csv

    $('#fileInput').on('change', function(e){
        let file = e.target.files[0];
        if (file && file.type === 'text/csv') {
            let reader = new FileReader();
            
            reader.onload = function(e){
                let content = e.target.result;

                //armazena o conteudo do arquivo junto com o nome
                fileContents.push({
                    fileName:file.name,
                    content:content
                });
                
                $('#csvContent').text(content);//mostrar o conteudo no modal
                openModal();
                addFileToList(file.name);//adicionar o nome do arquivo a list
            };
            reader.readAsText(file);
            
            // console.log(file);
            $('#fileInput').val('');
        }
    });

    function openModal() {
        $('#modal').css('display','block');
    }

    function closeModal() {
        $('#modal').css('display', 'none');
    }

    $('.close-button').on('click', closeModal);

    $(window).on('click', function(e) {
        if ($(e.target).is('#modal')){
            closeModal();
        }
    });

    function addFileToList(fileName) {
        let fileList = $('#fileList');

        //cria um novo item na lista com um listener para reabrir o arquivo
        let fileItem = $('<div>').text(`Arquivo carregado: ${fileName}`).addClass('file-item');
        fileItem.on('click',function(){
            //encontrar o arquivo no array pelo nome e exibir o conteudo
            let fileData = fileContents.find(f => f.fileName === fileName);
            if(fileData){
                $('#csvContent').text(fileData.content);//exibir o conteudo do arquivo
                openModal();
            }
        });
        fileList.append(fileItem);
    }
});