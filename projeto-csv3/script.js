$(document).ready(function(){
    let csvContent = [];

    $('#fileInput').on('change', function(e){
        let file = e.target.files[0];
        if(file && file.type === 'text/csv') {
            let reader = new FileReader();

            reader.onload = function(e){
                let content = e.target.result;

                //armazena o conteudo do arquivo junto com o nome
                csvContent.push({
                    fileName:file.name,
                    content:content
                });
                parseCSVToTable(content);
                openModal();
                addFileToList(file.name);
            };
            reader.readAsText(file);
            //limpa o input
            $('#fileInput').val('');
        }
    });

    function openModal() {
        $('#modal').css('display','block')
    };

    function closeModal() {
        $('#modal').css('display','none')
    }

    $('.close-button').on('click', closeModal)

    $(window).on('click', function(e){
        if ($(e.target).is('#modal')){
            closeModal();
        };
    });

    function addFileToList(fileName) {
        let fileList = $('#fileList');

        let fileItem = $('<div>').text(`Arquivo Carregado: ${fileName}`).addClass('file-item');
        fileItem.on('click',function(){
            let fileData = csvContent.find(f => f.fileName === fileName)
            if(fileData){
                parseCSVToTable(fileData.content);
                openModal();
            }
        });
        fileList.append(fileItem);
    }

    function parseCSVToTable(csvContent) {
        let rows = csvContent.split('\n');
        let tableBody = $('#csvTable tbody');
        tableBody.empty();

        rows.forEach((row, index) => {
            if(index > 0 && row.trim()){
                let columns = row.split(',');
                let tableRow = $('<tr>');

                columns.forEach(column => {
                    let tableData = $('<td>').text(column.trim());
                    tableRow.append(tableData);
                });

                tableBody.append(tableRow);
            }
        });
    }
});