async function deletar(id) {

    // console.log($(`[data-id='${id}']`).text());
    let response = await fetch(`http://localhost:3000/pessoas/${id}`, {
        method: 'DELETE',
    });
    if(!response.ok) {
        throw new Error('Falha ao excluir');
    }
    getData();
    
    $(`tr[data-id='${id}']`).remove();


    
    
    
}

async function cadastrar() {
    let nome = $('#name').val();
    let email = $('#email').val();
    let senha = $('#password').val();

    if (!nome || !email || !senha) {
        alert('Preencha todos os campos')
        return;
    }

    let pessoasResponse = await fetch('http://localhost:3000/pessoas');

    let pessoas = await pessoasResponse.json();

    let maxId = 0;
    if(pessoas.length > 0) {
        maxId = Math.max(...pessoas.map(p => p.id));
    }

    let novoId = (maxId + 1).toString();
    

    let response = await fetch('http://localhost:3000/pessoas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({id:novoId, nome, email, senha}),

    });
    if(!response.ok) {
        throw new Error('Falha ao adicionar pessoas');
    }
}


// const deletar = (id) => {
//     console.log($(`tr[data-id=${id}]`));
// }
$(document).ready(function () {
    

    const getData = async function () {
        let response = await fetch('http://localhost:3000/pessoas')
        let data = await response.json();
        data.forEach(function (e,id) {
            $('tbody').append(`                
                <tr data-id="${e.id}">
                    <td>${e.id}</td>
                    <td>${e.nome}</td>
                    <td>${e.email}</td>
                    <td>${e.senha}</td>
                    <td onclick="deletar(${e.id})">Deletar</td>
                </tr>            
                `);
        });
    }
    getData();

    // const deletar = async function (id) {
    // try {
    //     let response = await fetch(`http://localhost:3000/pessoas/${id}`, {
    //     method: 'DELETE',
    //     });
    //     if(!response.ok) {
    //         throw new Error('Falha ai excluir');
    //     }
    //     getData();
    // } catch (error) {
    //     console.error(error)
    // }
        
    // }

    $('#user-form').on('submit', function(event){
        event.preventDefault();
        cadastrar();
    });





}) 