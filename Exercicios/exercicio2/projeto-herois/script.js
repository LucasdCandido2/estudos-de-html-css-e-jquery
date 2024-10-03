$(document).ready(function(){
    //função para buscar os dados do JSON server
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/characters');//Altere para 3001 se estiver usando essa porta
            if(!response.ok){
                throw new Error('Não houve resposta do servidor')
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Houve um problema com a requisição fetch', error);
        }
    };
    //Função para popular a tabela com os dados
    const populateTable = (data) => {
        const tbody = $('#heroes-table tbody');
        tbody.empty(); //limpa o conteudo da tabela antes de preenche-la

        //itera sobre os dados e cria as linhas da tabela
        data.forEach(hero => {
            const powers = hero.powers.join(', '); //converte o array de poderes em uma string
            const row = `\
            <tr data-id="${hero.id}"> <!--adicionando um data-id para referencia -->\
                <td>${hero.name}</td>\
                <td>${hero.real_name}</td>\
                <td>${hero.age}</td>\
                <td>${hero.powers}</td>\
                <td><button class="delete-btn">Excluir</button></td> <!-- botão de exclusão -->\
            </tr>\
            `;
            tbody.append(row); //adiciona a linha na tabela
        });
    };

    //função para carregar os dados
    const loadData = async () => {
        const data = await fetchData();
        if(data) {
            populateTable(data); //popula a tabela apenas se houver dados
        }
    };

    //funçao para excluir um heroi
    const deleteHero = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/characters/${id}`, {
                method: 'DELETE',
            });
            if(!response.ok){
                throw new Error('Falha ao excluir o heroi');
            }
            loadData();//Recarrega os dados para atualizar a tabela
        } catch (error) {
            console.error('Erro ao excluir o heroi', error);
        }
    };

    //evento de clique para o botão de exclusão
    $('#heroes-table').on('click', '.delete-btn', function(){
        const row = $(this).closest('tr');//encontra a linha do botão clicando
        const id = row.data('id');//obtem o id do heroi
        deleteHero(id);//chama a função de exclusão
    });

    //função de adicionar um novo heroi
    // const addHero = async (newHero) => {
    //     try {
    //         const response = await fetch('http://localhost:3000/characters',{
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify(newHero),
    //         });
    //         if(!response.ok) {
    //             throw new Error('Falha ao adicionar o heroi');
    //         } 
    //         loadData();
    //     }catch (error) {
    //         console.error('Erro ao adicionar o heroi:', error);
    //     };
    // };

    const addHero = async (newHero) => {
        try {
            // Obtém a lista atual de heróis para determinar o próximo ID
            const response = await fetch('http://localhost:3000/characters');
            const existingHeroes = await response.json();
            
            // Encontra o próximo ID disponível
            const nextId = existingHeroes.length ? Math.max(...existingHeroes.map(hero => hero.id)) + 1 : 1;
            
            const heroWithId = {
                id: nextId, // Adiciona o ID gerado
                ...newHero
            };
    
            const addResponse = await fetch('http://localhost:3000/characters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(heroWithId), // Envia o novo herói com o ID
            });
    
            if (!addResponse.ok) {
                throw new Error('Falha ao adicionar o heroi');
            }
    
            loadData();
        } catch (error) {
            console.error('Erro ao adicionar o heroi:', error);
        }
    };
    

    //evento de clique para adicionar um novo heroi
    $('#add-hero-btn').click(function() {
        const name = $('#hero-name').val().trim();
        const realName = $('#hero-real-name').val().trim();
        const age = $('#hero-age').val().trim();
        const powers = $('#hero-powers').val().trim().split(', ').map(power => power.trim());//transforma a string em um array
        const newHero = {name, real_name: realName, age: Number(age), powers};//cria um novo objeto heroi

        addHero(newHero);//chama a função para adicionar o heroi

        //limpa os campos do formulario após a adição
        $('#hero-name').val('');
        $('#hero-real-name').val('');
        $('#hero-age').val('');
        $('#hero-powers').val('');

    });

    //chama a função para carregar os dados ao iniciar
    loadData();
});