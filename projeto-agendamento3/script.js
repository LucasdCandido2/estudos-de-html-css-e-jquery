const hoje = new Date();
const diaFormatado = hoje.toISOString().split('T')[0];//formato yyyy-mm-dd

$(document).ready(function(){
    $("#agendamento-form").submit(function(e){
        e.preventDefault();
        let nome = $("#nome").val();
        let idade = $("#idade").val();
        let sexo = $("#sexo").val();
        let data = $("#data").val();
        let hora = $("#hora").val();

        $("#confirm-nome").text(nome);
        $("#confirm-idade").text(idade);
        $("#confirm-sexo").text(sexo);
        $("#confirm-data").text(data);
        $("#confirm-hora").text(hora);

        $("#modal-confirmacao").fadeIn();
    });

    $("#cancelar-agendamento").click(function(){
        $("#modal-confirmacao").fadeOut();
    });

    $('#finalizar-agendamento').click(function() {
            let nome = $('#nome').val();
            let idade = $('#idade').val();
            let sexo = $('#sexo').val();
            let hora = $('#hora').val();
            let data = $('#data').val();
            let status = "agendado";

            let cadastroNovo = {
                nome:nome,
                idade:idade,
                sexo:sexo,
                hora:hora,
                data:data,
                status:status
            }

            fetch('http://localhost:3000/agendamentos', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(cadastroNovo)
            })
            .then(response => {
                if(!response.ok){
                    throw new Error('Erro ao cadastrar no banco');
                }
                return response.json();
            })
            .then(data => {
                alert("Agendamento Confirmado!")
                $('#modal-confirmacao').fadeOut();
            })
            .catch(error => {
                alert(error.message);
            });
        
    });
    
    // $("#finalizar-agendamento").click(function(){
    //     alert("Agendamento Confirmado!");
    //     $("#modal-confirmacao").fadeOut();
    // });

    $('#filtro-status').on('change',function(){
        let filtro = $(this).val();

        if(filtro === "todos"){
            $('tbody tr').show();
        }else{
            $('tbody tr').hide();
            $('tbody tr').filter(function(){
                return $(this).data('status') === filtro;
            }).show();

        }
    })
    getData();
})

function getData() {
    fetch('http://localhost:3000/agendamentos')
    .then(response => {
        if (!response.ok){
            throw new Error('Erro ao conectar ao banco');
        }
        return response.json();
    })
    .then(data => {
        // console.log(JSON.stringify(data));
        $('#agendamentos-tabela').empty();
        data.forEach(function(e){
            $('#agendamentos-tabela').append(`
                <tr data-status="${e.status}">
                    <td>${e.id}</td>
                    <td>${e.nome}</td>
                    <td>${e.idade}</td>
                    <td>${e.sexo}</td>
                    <td>${e.hora}</td>
                    <td>${e.data}</td>
                    <td>${e.status}</td>
                </tr>
                `)
            })
            
        $('.atendimentos-hoje').empty();
        let agendamentoHoje = data.filter(e => e.data === diaFormatado);

        if(agendamentoHoje.length === 0){
            $('.atendimentos-hoje').append('<p>Nenhum agendamento para hoje. </p>')
        }else {

            agendamentoHoje.forEach(function(e){
                $('.atendimentos-hoje').append(`
                    <div class="atendimento">
                        <p><strong>Nome:</strong> ${e.nome}</p>
                        <p><strong>Horário:</strong> ${e.hora}</p>
                        <p><strong>Status:</strong> ${e.status}</p>
                    </div>
                    `);
            })
        }
        
    })
    .catch(error => {
        alert(error.message);
    });
}

// $('#agendamento-form').on('submit', function(e){
//     e.preventDefault();
//     let nome = $('#nome').val();
//     let idade = $('#idade').val();
//     let sexo = $('#sexo').val();
//     let hora = $('#hora').val();
//     let data = $('#data').val();
//     let status = "agendado";

//     let cadastroNovo = {
//         nome:nome,
//         idade:idade,
//         sexo:sexo,
//         hora:hora,
//         data:data,
//         status:status
//     }

//     fetch('http://localhost:3000/agendamentos', {
//         method:'POST',
//         headers: {
//             'Content-Type':'application/json'
//         },
//         body: JSON.stringify(cadastroNovo)
//     })
//     .then(response => {
//         if(!response.ok){
//             throw new Error('Erro ao efetuar cadastro');
//         }
//         return response.json();
//     })
//     .then(data => {
//         // alert("Agendamento feito");
//         $('#modal-confirmacao').fadeOut();
//     })
//     .catch(error => {
//         alert(error.message);
//     });
// }) 