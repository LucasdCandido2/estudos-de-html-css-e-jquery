const numeros = (function() {
    fetch('http://localhost:3000/usuarios')
    .then(response => {
        if(!response.ok) {
            throw new Error('Falha em conectar no servidor');
        }
        return response.json();
    })
    .then(data => {
        $('#lista-numeros').empty();

        let numeroPrimo = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

        data.forEach(function(e) {
            // console.log(e.id);
            let id = Number(e.id)
            
            if (!numeroPrimo.includes(id)) {
                // console.log(id);
                // let numeroNaoPrimos = e.id;
                $('#lista-numeros').append(`
                    <li>${id}</li>
                    `)
                
            }else{
                $('#lista-numeros-primos').append(`
                    <li>${id}</li>
                    `)
            }

        });

        // Removido 'if(numeroPrimo.includes)' pois estava incompleto
    });
}); // Faltava o fechamento do bloco da função IIFE

$(document).ready(function() {
    numeros();
});
