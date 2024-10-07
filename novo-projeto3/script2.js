const getData = async function () {
    let response = await fetch("http://localhost:3000/pessoas");
    let data = await response.json();
    $('tbody').empty();
    data.forEach(function(e){
        let statusClass = '';
        let statusValue = e.status;
        switch (e.status) {
            case '0':
                statusClass = 'status-analise';
                
                break;
            case '1':
                statusClass = 'status-concluido';
                
                break;
            case '2':
                statusClass = 'status-cancelado'
                
                break;
        }
        $('tbody').append(`
            <tr data-id="${e.id}" class="${statusClass}">
                <td>${e.id}</td>
                <td>${e.nome}</td>
                <td>${e.email}</td>
                <td>${e.senha}</td>
                <td><select onchange="atualizarStatus(${e.id}, this.value)">
                        <option value="0" ${statusValue === '0' ? 'selected' : ''}>Em Análise</option>
                        <option value="1" ${statusValue === '1' ? 'selected' : ''}>Concluído</option>
                        <option value="2" ${statusValue === '2' ? 'selected' : ''}>Cancelado</option>
                     </select></td>
                <td><button onclick="cadastrar(${e.id})">Editar</button></td>
                <td><button onclick="deletar(${e.id})">Deletar</button></td>
            </tr>
            `);
    });
}


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

async function cadastrar (id) {
    let nome = $('#name').val();
    let email = $('#email').val();
    let senha = $('#password').val();
    let status = "0";

    if (!nome || !email || !senha) {
        alert('Preencha todos os campos')
        return;
    }

    if (id) {
        let response = await fetch(`http://localhost:3000/pessoas/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({nome, email, senha}),
        });
        if(!response.ok){
            throw new Error('Falha ao editar pessoa');
        }
        $('#submit-btn').removeData('id');
        $('#name').val('');
        $('#email').val('');
        $('#password').val('');


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
            body: JSON.stringify({id:novoId, nome, email, senha, status}),
        });

        $('#name').val('');
        $('#email').val('');
        $('#password').val('');
        
        if (!response.ok) {
            throw new Error("Erro ao cadastrar nova pessoa!")
        }
    }
    
    getData();//Atualiza a tabela após a edição ou cadastro

    
}

const atualizarStatus = async (id, status) => {
   let response = await fetch(`http://localhost:3000/pessoas/${id}`, {
      method: 'PATCH',
      headers: {
         'Content-type': 'application/json',
      },
      body: JSON.stringify({status}),
   });

   if (!response.ok){
      throw new Error("Falha ao trocar status!")
   }

   getData();
}



$(document).ready(function () {

    getData();//função para popular a tabela
    
    $('#user-form').on('submit', function(event){
        event.preventDefault();
        cadastrar();
    })
    


})