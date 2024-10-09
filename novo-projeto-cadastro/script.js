function cadastro() {
    let nome = $('#nome').val();

    //criei um objeto para poder ser transformado em json
    let novoCadastro = {
        id:null,
        nome: nome,
    };

    fetch('http://localhost:3000/pessoa', {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(novoCadastro)
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        
    })
}