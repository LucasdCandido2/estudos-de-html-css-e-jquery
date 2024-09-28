$(document).ready(function(){
    //Adiciona a estrutura do formulario no body
    $('body').append('\
        <div id="form-container">\
            <h1>Cadastro de Pacientes</h1>\
            <form id="form-cadastro">\
                <label for="nome">Nome Completo:</label>\
                <input type="text" id="nome"><br>\
\
                <label for="idade">Idade:</label>\
                <input type="number" id="idade" name="idade"><br>\
\
                <label for="email">Email:</label><input type="email" id="email"><br>\
\
                <label for="sexo">Sexo:</label>\
                <select id="sexo" name="sexo">\
                    <option value="masculino">Masculino</option>\
                    <option value="feminino">Feminino</option>\
                    <option value="outro">Outro</option>\
                    <option value="nao-informar">Prefiro Não Informar</option>\
                </select><br>\
\
                <label for="sexualidade">Orientação Sexual:</label>\
                <select id="sexualidade" name="sexualidade">\
                    <option value="heterossexual">Heterossexual</option>\
                    <option value="homossexual">Homossexual</option>\
                    <option value="bissexual">Bissexual</option>\
                    <option value="outro">Outro</option>\
                </select><br></br>\
\
                <label for="historico">Historico de Doenças:</label>\
                <textarea id="historico" name="historico"></textarea><br>\
                \
                <label for="doenca">Doença:</label>\
                <select id="doenca" name="doenca">\
                    <option value="">Selecione uma Doença</option>\
                </select><br>\
\
                <input type="submit" value="Cadastrar">\
            </form>\
            <div id="feedback"></div>\
        </div>\
        ');
    //Aplica o CSS dinamicamente
    $('#form-container').css({
        'max-width': '500px',
        'margin': 'auto',
        'padding':'20px',
        'border': '1px solid #ccc',
        'border-radius': '10px',
        'background-color': '#f9f9f9'
    });

    $('input, select, textarea').css({
        'width': '100%',
        'padding': '10px',
        'margin': '5px 0 10px 0',
        'border': '1px solid #ccc',
        'box-sizing': 'border-box'
    });

    $('input[type="submit"]').hover(
        function() {
            $(this).css('background-color','#45a049');
        },
        function() {
            $(this).css('background-color','#4caf50');
        }
    );

    //Dados JSON embutidos
    const doencas = [

        "Diabetes",
        "Hipertensão",
        "Asma",
        "Doenças Cardiovasculares",
        "Câncer",
        "Artrite",
        "Doença Pulmonar Obstrutiva Crônica (DPOC)",
        "Acidente Vascular Cerebral (AVC)",
        "Hepatite",
        "Doenças Autoimunes",
        "Doença Renal Crônica",
        "Tuberculose",
        "Infecções Respiratórias",
        "Alergias",
        "Doença de Alzheimer"

    ];

    //Validação do Formulario e interações
    $('#form-cadastro').on('submit', function(event){
        event.preventDefault();
        let nome = $('#nome').val();
        let idade = $('#idade').val();
        let sexo = $('#sexo').val();
        let sexualidade = $('#sexualidade').val();
        let historico = $('#historico').val();
        let email = $('#email').val();

        //Simples Validação
        if (nome === "" || idade === "" || sexo === "" || sexualidade === "") {
            $('#feedback').text('Por favor, preencha os campos obrigatorios.').css('color','red');
        } else {
            $('#feedback').text('Paciente cadastrado com sucesso!').css('color','green');
        }
        //Validação do email
        if (!/\S+@\S+/.test(email)){
            $('#feedback').text('Por favor, insira um email valido.').css('color','red');
        }
    });

    //Limpar os campos ao clicar fora
    $('input, textarea').on('focusout', function(){
        $(this).css('background-color','#ffffff');
    }).on('focus', function(){
        $(this).css('background-color','#e0f7fa');
    });

    //Mascara de entrada de idade (limitar entre 0 e 120)
    $('#idade').on('input', function(){
        let idade = parseInt($(this).val(),10);
        if (idade < 0 || idade > 120){
            $('#feedback').text('Insira uma idade valida entre 0 e 120.').css('color','red');
        } else {
            $('#feedback').text('');
        }
    });

    //Altera o titulo do cadastro
    $('<button id="btn-titulo">Alterar Titulo</button>').appendTo('body');
    $('#btn-titulo').on('click', function(){
        $('h1').text('Novo Titulo');
    });

    //Mostrar/Ocultar formulario
    $('<button id="btn-toggle">Mostrar/Ocultar Formulario</button>').appendTo('body');
    $('#btn-toggle').on('click', function(){
        $('#form-container').toggle();
    });

    //Limpar os campos
    $('<button id="btn-limpar">Limpar Campos</button>').appendTo('body');
    $('#btn-limpar').on('click', function(){
        $('#form-cadastro')[0].reset();//Limpa todos os campos do formulario
    });

    //Contador de Caracteres
    $('#historico').on('input', function(){
        let count = $(this).val().length;
        $('#feedback').text(`Caracteres digitados: ${count}`);
    });

    //Carregando dados externos
    $.each(doencas, function(i,doenca){
        $(`#doenca`).append(`<option value="${doenca}">${doenca}</option>`);
    });

    //Apos a validação
    $('#feedback').text(`Nome: ${nome}, Idade: ${idade}, Sexo: ${sexo}, Historico: ${historico}`);
});