$(document).ready(function(){
    console.log('DOM está pronto!');
    const API_URL = 'http://localhost:3000/patio';
    console.log('API URL:', API_URL);

    //Função para atualizar o status do patio (quantidade de carros e motos)
    function atualizarPatio(){
        // console.log('Atualizando o pátio...');
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                // console.log('Dados do pátio recebidos:', data);
                let carros = data.filter(veiculo => veiculo.tipo === 'Carro').length;
                let motos = data.filter(veiculo => veiculo.tipo === 'Moto').length;
                $('#total-carros').text(carros);
                $('#total-motos').text(motos);
                // console.log(`Total de carros: ${carros}, Total de motos: ${motos}`); 
            })
            .catch(error => console.error('Erro ao atualizar o patio', error));
    }

    //Função para calcular o faturamento do dia (somente veiculos faturados)
    function calcularFaturamento() {
        console.log('Calculando faturamento do dia...');
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                console.log('Dados recebidos para faturamento:', data);
                // let faturamentoDia = data.filter(veiculo => veiculo.faturado).reduce((acc, veiculo) => acc + veiculo.valor, 0);
                let faturamentoDia = data
                    .filter(veiculo => veiculo.faturado)
                    .reduce((total, veiculo) => total + veiculo.valor, 0);
                $('#faturamento-dia').text(faturamentoDia.toFixed(2));
                console.log(`Faturamento do dia: R$ ${faturamentoDia.toFixed(2)}`);
            })
            .catch(error => console.error('Erro ao calcular faturamento:', error));
    }

    //Função para carregar a lista de veiculos no patio (pagina patio)
    function carregarVeiculosPatio() {
        console.log('Carregando veículos do pátio...');
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                console.log('Veículos do pátio recebidos:', data);
                $('#lista-patio').empty();
                data.forEach(function(veiculo){
                    $('#lista-patio').append(`
                        <tr>
                            <td>${veiculo.tipo}</td>
                            <td>${veiculo.placa}</td>
                            <td>${veiculo.valor.toFixed(2)}</td>
                            <td>
                                <button class="btn btn-success btn-faturar" data-id="${veiculo.id}">Faturar</button>
                            </td>
                        </tr>
                    `);
                });
                console.log('Tabela de veículos atualizada.');
            })
            .catch(error => console.error('Erro ao carregar patio', error));
    }


    //Evento para cadastrar um novo veiculo na pagina de entrada
    $('#form-entrada').on('submit', function(e){
        e.preventDefault();

        console.log('Formulário enviado!');

        let tipoVeiculo = $('#tipo-veiculo').val();
        let placaVeiculo = $('#placa-veiculo').val().toUpperCase();

        console.log('Tipo de veículo:', tipoVeiculo); // Verifique o tipo
        console.log('Placa do veículo:', placaVeiculo); // Verifique a placa
    

        if(!tipoVeiculo || !placaVeiculo){
            alert('Preencha todos os campos');
            return;
        }

        console.log('Veículo a ser adicionado:', veiculo);

        let veiculo = {
            tipo: tipoVeiculo,
            placa: placaVeiculo,
            faturado: false,
            valor:10,
            entrada: new Date().toISOString()
        };

        console.log('Veículo a ser adicionado:', veiculo);

        //Verificar se a placa ja existe no patio
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(veiculo)
        })
        .then(response => {
            console.log('Resposta do servidor ao cadastrar veículo:', response);
            if(!response.ok){
                throw new Error('Erro ao cadastrar Veiculo');
            }
            return response.json();
        })
        .then(() => {
            alert(`Entrada registrada: ${tipoVeiculo} - ${placaVeiculo}`);
            atualizarPatio();
        })
        .catch(error => alert('Erro: ' + error.message));
    });

    //Evento para faturar um veiculo (remover do patio e atualizar o status de faturado)
    $(document).on('click','.btn-faturar', function(){
        let veiculoId = $(this).data('id');
        console.log('ID do veículo a faturar:', veiculoId);

        if(confirm('Tem certeza que deseja faturar esse veiculo?')) {
            //Buscar os dados do veiculo
            fetch(`${API_URL}/${veiculoId}`)
                .then(response => response.json())
                .then(veiculo => {
                    console.log('Dados do veículo a faturar:', veiculo);
                    //Atualizar o status de faturado e valor final
                    veiculo.faturado = true;
                    veiculo.valor += calcularValor(veiculo); //Função para calcular o valor adicional de horas

                    return fetch(`${API_URL}/${veiculoId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify(veiculo)
                    });
                })
                .then(() => {
                    alert('Veiculo faturado com sucesso!');
                    carregarVeiculosPatio();
                    calcularFaturamento();
                })
                .catch(error => console.error('Erro ao faturar veiculo: ', error));
        }
    });




    //Função para filtrar o financeiro (pagina Financeiro)
    $('#form-filtro-financeiro').on('submit', function(e){
        e.preventDefault();
        let filtro = $('#filtro-financeiro').val();

        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                let dataFiltrada = filtrarPorPeriodo(data.filter(veiculo => veiculo.faturado), filtro);
                $('#tabela-financeiro tbody').empty();
                dataFiltrada.forEach(veiculo => {
                    $('#tabela-financeiro tbody').append(`
                        <tr>
                            <td>${veiculo.placa}</td>
                            <td>R$ ${veiculo.valor.toFixed(2)}</td>
                            <td>${new Date(veiculo.entrada).toLocaleDateString()}</td>
                        </tr>
                    `);
                });
            })
            .catch(error => console.error('Error ao filtrar o financeiro:', error));
    });



    //Função para calcular o valor adicional por horas
    function calcularValor(veiculo) {
        //Exemplo simples de calculo de valor adicional por tempo
        let horas = Math.floor((new Date() - new Date(veiculo.entrada)) / (1000 * 60 * 60));
        let valorAdicional = horas * 5;
        return valorAdicional;
    }


    //Função de filtro por periodo(dia, semana, mes)
    function filtrarPorPeriodo(veiculos, periodo) {
        let hoje = new Date();
        return veiculos.filter(function(veiculo){
            let dataVeiculo = new Date(veiculo.entrada);
            let difencaDias = Math.floor((hoje - dataVeiculo) / (1000 * 60 * 24));

            if(periodo === 'dia' && difencaDias === 0){
                return true;
            } else if (periodo === 'semana' && difencaDias <= 7) {
                return true;
            } else if (periodo === 'mes' && difencaDias <= 30) {
                return true;
            }
            return false;
        });
    }

    console.log('Iniciando funções...');
    //Inicializa as funçãos na pagina Home
    atualizarPatio();
    carregarVeiculosPatio();
    calcularFaturamento();
    console.log('Funções inicializadas.');
});