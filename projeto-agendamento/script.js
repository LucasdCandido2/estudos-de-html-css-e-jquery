const hoje = new Date();
const diaFormatado = hoje.toISOString().split('T')[0];//formato yyyy-mm-dd

//função de cadastro
$('#form-agendamento').on('submit', function(e){
    e.preventDefault();//impede de ser feito o envio dos dados pra url
    let id = null;
    let nome = $('#nome').val();
    let data = $('#data').val();
    let hora = $('#horario').val();
    let status = 'agendado';

    //cria o objeto do cadastro de forma organizada
    let cadastroNovo = {
        id:id,
        nome:nome,
        data:data,
        hora:hora,
        status:status,
    }

    //cria uma promise para poder fazer a inserção dos dados no banco
    fetch('http://localhost:3000/agendamentos', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(cadastroNovo)
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Erro de conexão:', response.status)
        }
        // console.log(response.json());
        //trata a promise para poder enviar para o banco
        return response.json()
        
    })
    .then(data => {
        //campo para atuação caso seja necessario alguma atividade com o objeto
        // alert(data.hora)
        alert('Agendamento feito com sucesso!');

    })
    .catch(error => {
        //aqui trata os erros
        console.error('Erro: ', error); 
    });

})

//função para popular as tabelas de agendamentos e para verificar quantos atendimentos tem no dia
$(document).ready(function(){
    fetch('http://localhost:3000/agendamentos')
    .then(response => {
        if(!response.ok) {
            throw new Error('Erro ao carregar informações do banco')
        }
        return response.json()
    })
    .then(data => {
        // alert(JSON.stringify(data))
        $('#tabela-agendamentos').empty();



        let agendamentoFiltrado = data.filter(e => e.status !== "finalizado");
        

        agendamentoFiltrado.forEach(function(e) {
            let statusClass = '';
            switch (e.status){
                case "agendado":
                    statusClass = 'status-analise';
                    break;
                case "atendimento":
                    statusClass = 'status-atendimento';
                    break;
                case "finalizado":
                    statusClass = 'status-finalizado';
                    break;
            }

            let statusList = ["agendado", "atendimento",  "finalizado"];
            let opcoes = `<option value="${e.status}" selected>${e.status}</option>`;



            statusList.forEach(status => {
                if (status !== e.status) {
                    
                    opcoes += `<option value="${status}">${status}</option>`;
                }
            });

            $('#tabela-agendamentos').append(`
                <tr data-id="${e.id}">
                    <td>${e.id}</td>
                    <td>${e.nome}</td>
                    <td>${e.data}</td>
                    <td>${e.hora}</td>
                    <td>
                        <select onchange="atualizarStatus(${e.id}, this.value)">
                            ${opcoes}
                        </select>
                    </td>
                </tr>
                `)
            
        });
        $('#tabela-concluidos').empty();

        let agendamentoFinalizado = data.filter(e => e.status === "finalizado")
        

        agendamentoFinalizado.forEach(function(e) {
            $('#tabela-concluidos').append(`
                <tr data-id="${e.id}">
                    <td>${e.id}</td>
                    <td>${e.nome}</td>
                    <td>${e.data}</td>
                    <td>${e.hora}</td>
                    <td>
                        <select onchange="atualizarStatus(${e.id}, this.value)">
                            <option value="finalizado" selected>finalizado</option>
                            <option value="agendado">agendado</option>
                        </select>
                    </td>
                </tr>
                `)
            
        });
        $('#total-atendimentos').empty();

        let agendamentoHoje = data.filter(e => e.data === diaFormatado).length;
        console.log(agendamentoHoje)

        $('#total-atendimentos').append(agendamentoHoje);
    })
    .catch(error => {
        console.error(error);
        
    });
})

// function statusOuApagar(id, novoId) {
//     if(novoId === 'delete'){
//         deletar(id);
//     } else {
//         atualizarStatus(id, novoId);
//     }
    
// }

function atualizarStatus(id, novoId) {
    fetch(`http://localhost:3000/agendamentos/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({status:novoId}),
    })
    .then(response => {
        if(!response.ok) {
            throw new Error('Falha ao trocar status!');
        }
    })
    .catch(error => {
        console.error(error);
        alert('Ocorreu um erro ao atualizar o status.')
        
    });

}

// function deletar(id) {
//     fetch(`http://localhost:3000/agendamentos/${id}`,{
//         method: 'DELETE'
//     })
//     .then(response => {
//         if(!response.ok){
//             throw new Error('Falha ao deletar agendamento');
//         }
//     })
//     .catch(error => {
//         console.error(error);
//         alert('Ocorreu um erro ao deletar agendamento')
        
//     })
    
// }

// function gerarOpcoes(statusAtual) {
//     let opcoes = '';
//     let statusList = ["agendado","atendimento","cancelado","finalizado","delete"];

//     statusList.forEach(status => {
//         if(status !== statusAtual) {//adiciona apensa se for diferente do status atual
//             opcoes += `<option value="${status}">${status}</option>;`;
//         } else {
//             opcoes += `<option value="${status}" selected>${status}</option>;`; //marca como selecionada
//         }
//     });
//     return opcoes;
    
// }