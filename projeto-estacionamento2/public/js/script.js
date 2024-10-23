$(document).ready(function(){
    console.log('DOM está pronto!');
    const API_URL = 'http://localhost:3000/patio';
    console.log('API URL:', API_URL);

    function atualizarPatio(){
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                let carros = data.filter(veiculo => veiculo.tipo === 'Carro').length;
                let motos = data.filter(veiculo => veiculo.tipo === 'Moto').length;
                $('#total-carros').text(carros);
                $('#total-motos').text(motos);
            })
            .catch(error => console.error('Erro ao atualizar o patio', error));
    }

    function calcularFaturamento() {
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                let faturamentoDia = data.filter(veiculo => veiculo.faturado).reduce((total, veiculo) => total + veiculo.valor, 0);
                $('#faturamento-dia').text(faturamentoDia.toFixed(2));
            })
            .catch(error => console.error('Erro ao calcular faturamento:', error));
    }

    function carregarVeiculosPatio() {
        console.log('Carregando veículos do pátio...');
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                $('#veiculos-patio').empty(); // Altere para usar o id correto
                data.forEach(function(veiculo){
                    $('#veiculos-patio').append(`
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
            })
            .catch(error => console.error('Erro ao carregar patio', error));
    }

    $('#form-entrada').on('submit', function(e){
        e.preventDefault();
        console.log('Formulário enviado!');

        let tipoVeiculo = $('#tipo-veiculo').val();
        let placaVeiculo = $('#placa-veiculo').val().toUpperCase();

        if(!tipoVeiculo || !placaVeiculo){
            alert('Preencha todos os campos');
            return;
        }

        // Verificar se a placa já existe no pátio
        fetch(API_URL)
            .then(response => response.json())
            .then(data => {
                if (data.some(veiculo => veiculo.placa === placaVeiculo)) {
                    alert('Esta placa já está registrada no pátio.');
                    return;
                }

                let veiculo = {
                    tipo: tipoVeiculo,
                    placa: placaVeiculo,
                    faturado: false,
                    valor: 10,
                    entrada: new Date().toISOString()
                };

                return fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify(veiculo)
                });
            })
            .then(response => {
                if (!response.ok) {
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

    $(document).on('click', '.btn-faturar', function(){
        let veiculoId = $(this).data('id');
        if (confirm('Tem certeza que deseja faturar esse veiculo?')) {
            fetch(`${API_URL}/${veiculoId}`)
                .then(response => response.json())
                .then(veiculo => {
                    veiculo.faturado = true;
                    veiculo.valor += calcularValor(veiculo); 

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

    function calcularValor(veiculo) {
        let horas = Math.floor((new Date() - new Date(veiculo.entrada)) / (1000 * 60 * 60));
        let valorAdicional = horas * 5;
        return valorAdicional;
    }

    function filtrarPorPeriodo(veiculos, periodo) {
        let hoje = new Date();
        return veiculos.filter(function(veiculo){
            let dataVeiculo = new Date(veiculo.entrada);
            let diferencaDias = Math.floor((hoje - dataVeiculo) / (1000 * 60 * 60 * 24));

            if (periodo === 'dia' && diferencaDias === 0) {
                return true;
            } else if (periodo === 'semana' && diferencaDias <= 7) {
                return true;
            } else if (periodo === 'mes' && diferencaDias <= 30) {
                return true;
            }
            return false;
        });
    }

    console.log('Iniciando funções...');
    atualizarPatio();
    carregarVeiculosPatio();
    calcularFaturamento();
    console.log('Funções inicializadas.');
});
