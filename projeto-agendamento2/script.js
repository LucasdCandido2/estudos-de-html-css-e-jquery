const getData = (function() {
    fetch('http://localhost:3000/agendamentosAguardando')
    .then(response => {
        if(!response.ok) {
            throw new Error('Erro ao carregar informações do banco')
        }
        return response.json()
    })
    .then(data => {
        $('#agendamentos tbody').empty();
        data.forEach(function(e){
            $('#agendamentos').append(`
            <tr data-id="${e.id}">
               <td>${e.id}</td>
               <td>${e.nome}</td>
               <td>${e.data}</td>
               <td>${e.hora}</td>
               <td>${e.status}</td>
            </tr>
            `)
        })
    })
    fetch('http://localhost:3000/agendamentosAtendidos')
    .then(response => {
        if(!response.ok) {
            throw new Error('Erro ao carregar informações do banco')
        }
        return response.json()
    })
    .then(data => {
        $('#atendidos tbody').empty();
        data.forEach(function(e){
            $('#atendidos').append(`
            <tr data-id="${e.id}">
               <td>${e.id}</td>
               <td>${e.nome}</td>
               <td>${e.data}</td>
               <td>${e.hora}</td>
               <td>${e.status}</td>
            </tr>
            `)
        })
    })
})



const cadastrarAgendamento = (function() {
    let nome = $('#nome').val();
    let data = $('#data').val();
    let horario = $('#horario').val();
    let status = "Aguardando";

    if(!nome || !data || !horario){
        alert("Preencha todos os campos!");
        return;
    }
    Promise.all([
        fetch('http://localhost:3000/agendamentosAguardando'),
        fetch('http://localhost:3000/agendamentosAtendidos')
    ])
    .then(responses => {
        if(!responses[0].ok || !responses[1].ok) {
            throw new Error('Erro em buscar os dados.');
        }
        return Promise.all([responses[0].json(),responses[1].json()]);
    })
    .then(agendamentos => {
        let maxId = agendamentos.length > 0 ? Math.max(...agendamentos.map(p => p.id)):0;
        let novoId = (maxId + 1).toString();

        return fetch('http://localhost:3000/agendamentosAguardando', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({id:novoId,nome,data,horario,status}),
        });
    })
    .then(response => {
        if(!response.ok){
            throw new Error('Falha ao cadastrar pessoa!', error);
        }
    })
})

$(document).ready(function(){
    getData();
})