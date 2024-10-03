$(document).ready(function(){
    //função para buscar os dados recebidos e criar os cards
    $.getJSON('http://localhost:3000/characters', function(data){
        //iterar sobre os dados recebidos e criar os cards
        $.each(data, function(index, hero){
            //cria a lista de poderes
            let powersList = '<ul>'
            $.each(hero.powers, function(i, power){
                powersList += `<li>${power}</li>`;
            });
            powersList += '</ul>';
    
            //criar o card de informações do heroi
            let card = `\
            <div class="hero">\
                <h3>${hero.name}</h3>\
                <p><strong>Nome Real:</strong> ${hero.real_name}</p>\
                <p><strong>Idade:</strong> ${hero.age}</p>\
                <p><strong>Poder:</strong></p>\
                ${powersList}\
            </div>\
            `;
            //inserir o card no container
            $('#card-container').append(card);
        });
    });
})