// async function deletar(id) {

//     // console.log($(`[data-id='${id}']`).text());
//     let response = await fetch(`http://localhost:3000/pessoas/${id}`, {
//         method: 'DELETE',
//     });
//     if(!response.ok) {
//         throw new Error('Falha ao excluir');
//     }
//     getData();
    
//     // $(`tr[data-id='${id}']`).remove();


    
    
    
// }

// async function cadastrar() {
//     let nome = $('#name').val();
//     let email = $('#email').val();
//     let senha = $('#password').val();

//     if (!nome || !email || !senha) {
//         alert('Preencha todos os campos')
//         return;
//     }

//     if (id) {
//         let response = await fetch(`http://localhost:3000/pessoas/${id}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({nome,email,senha}),
//         });
//         if (!response.ok) {
//             throw new Error('Falha ao editar pessoa');
//         }
//         $('#submit-btn').removeData('id');//Remove o ID armazenado após a edição

        
//     } else {

//         let pessoasResponse = await fetch('http://localhost:3000/pessoas');

//         let pessoas = await pessoasResponse.json();

//         let maxId = 0;
//         if(pessoas.length > 0) {
//             maxId = Math.max(...pessoas.map(p => p.id));
//         }

//         let novoId = (maxId + 1).toString();
        

//         let response = await fetch('http://localhost:3000/pessoas', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({id:novoId, nome, email, senha}),

//         });
//         if(!response.ok) {
//             throw new Error('Falha ao adicionar pessoas');
//         }
//     }

//     getData();//Atualiza a tabela após o cadastro ou edição

// }


// // const deletar = (id) => {
// //     console.log($(`tr[data-id=${id}]`));
// // }
// $(document).ready(function () {
    

//     const getData = async function () {
//         let response = await fetch('http://localhost:3000/pessoas')
//         let data = await response.json();
//         data.forEach(function (e) {
//             $('tbody').append(`                
//                 <tr data-id="${e.id}">
//                     <td>${e.id}</td>
//                     <td>${e.nome}</td>
//                     <td>${e.email}</td>
//                     <td>${e.senha}</td>
//                     <td onclick="editar(${e.id})">Editar</td>
//                     <td onclick="deletar(${e.id})">Deletar</td>
//                 </tr>            
//                 `);
//         });
//     }
//     getData();

//     // const deletar = async function (id) {
//     // try {
//     //     let response = await fetch(`http://localhost:3000/pessoas/${id}`, {
//     //     method: 'DELETE',
//     //     });
//     //     if(!response.ok) {
//     //         throw new Error('Falha ai excluir');
//     //     }
//     //     getData();
//     // } catch (error) {
//     //     console.error(error)
//     // }
        
//     // }

//     $('#user-form').on('submit', function(event){
//         event.preventDefault();
//         cadastrar();
//     });





// }) 

$(document).ready(function(){
    const getData = function(){
        fetch('http://localhost:3000/pessoas')
        .then(response => {
            if(!response.ok){
                throw new Error('Falha ao conectar no banco')
            }
            return response.json()
        })
        .then(data => {
            $('#tabela-pessoas tbody').empty();
            data.forEach(function(e){
                $('tbody').append(`
                    <tr data-id="${e.id}">
                        <td>${e.id}</td>
                        <td>${e.nome}</td>
                        <td>${e.email}</td>
                        <td>${e.senha}</td>
                        <td><button onclick="editar(${e.id})">Editar</button></td>
                        <td><button id="deletar" data-id="${e.id}">Deletar</button></td>
                    </tr>`)
            });
            
        })
        .catch(error => {
            console.error('Erro ao buscar dados: ', error);
            alert('Erro ao buscar dados. Tente novamente mais tarde.');
        });
    };

    $('#user-form').on('submit', function(e){
        console.log('Botão clicado');
        e.preventDefault();
        let nome = $('#name').val();
        let email = $('#email').val();
        let senha = $('#password').val();

        let cadastro = {
            nome:nome,
            email:email,
            senha:senha
        }

        fetch('http://localhost:3000/pessoas', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(cadastro)
        })
        .then(response => {
            if(!response.ok){
                throw new Error('Erro ao cadastrar usuario');
            }
            return response.json()
        })
        .then(data => {
            console.log('Usuario cadastrado com sucesso!', data);
            alert('cadastrado');

            //recarregar os dados da tabela
            getData();
            $('#user-form')[0].reset();

        })
        .catch(error => {
            console.error('Erro ao cadastrar usuario. Tente novamente.');
        });
    });

    // const deletar = function(id){
    //     fetch(`http://localhost:3000/pessoas/${id}`, {
    //         method: 'DELETE'
    //     })
    //     .then(response => {
    //         if(!response.ok){
    //             throw new Error('Erro ao deletar do banco')
    //         }
    //         return response.json();
    //     })
        
    // }
    $(document).on('click','#deletar', function(){
        let id = $(this).data('id');
        fetch(`http://localhost:3000/pessoas/${id}`, {
            method:'DELETE'
        })
        .then(response => {
            if(!response.ok){
                throw new Error('Erro ao deletar do banco')
            }
            return response.json();
        })
        .then(() => {
            console.log(`Usuario com ID ${id} deletado com sucesso!`);
            
        })
    })

    getData();
})