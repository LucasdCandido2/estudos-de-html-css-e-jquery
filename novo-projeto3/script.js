async function deletar (id) {

    // console.log($(`[data-id='${id}']`).text());
    let response = await fetch(`http://localhost:3000/pessoas/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Falha ao excluir');
    };

    getData();

    
    
}

async function cadastrar(id) {
    let nome = $('#name').val();
    let email = $('#email').val();
    let senha = $('#password').val();

    if (!nome || !email || !senha) {
        alert('Preencha todos os campos')
        return;
    }

    if(id) {
        let response = await fetch(`http://localhost:3000/pessoas/${id}`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({nome, email, senha}),
        });
        if(!response.ok){
            throw new Error('Falha ao editar pessoa');
        }
        $('#submit-btn').removeData('id');
    } else {
        
        let pessoasResponse = await fetch('http://localhost:3000/pessoas');
        let pessoa = await pessoasResponse.json();
    
        let maxId = 0;
        if (pessoa.length > 0) {
            maxId = Math.max(... pessoa.map(p => p.id));
        }
    
        let novoId = (maxId + 1).toString();
    
        let response = await fetch('http://localhost:3000/pessoas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id:novoId, nome, email, senha}),
        });
        if (!response.ok) {
            throw new Error("Erro ao cadastrar nova pessoa!")
        }
    }

    getData();//Atualiza a tabela após a edição ou cadastro

    
}



$(document).ready(function () {
    const getData = async function () {
        let response = await fetch("http://localhost:3000/pessoas");
        let data = await response.json();
        data.forEach(function(e){
            $('tbody').append(`
                <tr data-id="${e.id}">
                    <td>${e.id}</td>
                    <td>${e.nome}</td>
                    <td>${e.email}</td>
                    <td>${e.senha}</td>
                    <td><button onclick="cadastrar(${e.id})">Editar</button></td>
                    <td><button onclick="deletar(${e.id})">Deletar</button></td>
                </tr>
                `);
        });
    }
    getData();//função para popular a tabela


    $('#user-form').on('submit', function(event){
        event.preventDefault();
        cadastrar();
    })


})