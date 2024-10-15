$(document).ready(function(){
    let modal = $('#csvModal');
    let closeModal = $('.close');

    //função para abrir o modal
    function openModal() {
        modal.css('display','flex');
    }

    //função para fechar modal
    closeModal.on('click', function() {
        modal.hide();
    });

    //função para converter CSV para JSON
    function csvToJson(csv) {
        let lines = csv.split('\n');
        let headers = lines[0].split(',');
        let result = [];

        lines.slice(1).forEach(line => {
            let obj = {};
            let values = line.split(',');

            headers.forEach((header, index) => {
                obj[header.trim()] = values[index].trim();
            });

            if(Object.keys(obj).length){
                result.push(obj);
            }
        });

        return result;

    }

    //função para exibir o conteudo do CSV em um modal
    function displayCSV(csvData){
        //verifica se o csvData é um array. caso contrario, transforma-o em array
        if(!Array.isArray(csvData)){
            csvData = [csvData];//se for objeto, coloca dentre de um array
        }

        //verifica se o array tem algum item
        if(csvData.length ===0){
            alert('Nenhum dado disponivel para exibir!');
            return;
        }

        let headers = Object.keys(csvData[0]);
        let headersRow = $('#csvHeader');
        headersRow.empty();
        headers.forEach(header => {
            headersRow.append(`<th>${header}</th>`);
        });

        let body = $('#csvBody');
        body.empty();
        csvData.forEach(row => {
            let rowElement = $('<tr></tr>');
            headers.forEach(header => {
                rowElement.append(`<td>${row[header]}</td>`);
            });
            body.append(rowElement);
        });

        openModal();
    }

    //funçao para carregar e exibir a lista de aquivos CSV
    function loadCSVFile() {
        $.get('http://localhost:3000/csv', function (data) {
            let csvList = $('#csvList');
            csvList.empty();

            data.forEach((csvFile, index) => {
                let listItem = $(`<li data-index="${index}">Arquivo ${index + 1}</li>`);
                listItem.on('click',function () {
                    let csvContent = csvFile.content;
                    let csvData = csvToJson(csvContent);
                    displayCSV(csvData);
                });
                csvList.append(listItem);
            });
        });
    }

    //função para let e enviar o conteudo do csv para JSON server
    function readCSV(file) {
        let reader = new FileReader();

        reader.onload = function(e) {
            let csvContent = e.target.result;
            let csvData = csvToJson(csvContent);

            //envia o conteudo convertido para o JSON Server
            $.ajax({
                url:'http://localhost:3000/csv',
                type: 'POST',
                contentType: 'application/json',
                data:JSON.stringify(csvData),
                success: function () {
                    alert('Arquivo CSV enviado e armazenado com sucesso!');
                    loadCSVFile();
                },
                error: function () {
                    alert('Erro ao enviar o arquivo CSV.');
                }
            });
        };

        reader.readAsText(file);
    }

    //Submeter o formulario de upload
    $('#csvForm').on('submit', function (e) {
        e.preventDefault();
        let fileInput = $('#csvFile')[0].files[0];

        if(fileInput) {
            readCSV(fileInput);
        }
        
    });

    //carregar a lista de arquivos CSV ao carregar a pagina
    loadCSVFile();
})