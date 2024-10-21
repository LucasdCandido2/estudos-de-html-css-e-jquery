const dataAtual = new Date();
const dataFormatada = dataAtual.toISOString().split('T')[0];
const horaformatada = dataAtual.toTimeString().split(' ')[0].substring(0,5);

$(document).ready(function () {
    $('#navbar-placeholder').load('navbar.html');
    const urlCar = 'http://localhost:3000/patio';
    $('#placa').on('input',function(){
        $(this).val($(this).val().toUpperCase());
    });

    function loadCars() {
        fetch(urlCar)
        .then(response => {
            if(!response.ok){
                throw new Error('Erro ao verificar os carros')
            }
            return response.json();
        })
        .then(cars => {
            let parkedCars = cars.filter(car => !car.faturado);
            let countParkedCars = parkedCars.length;

            $('#countParkedCars').text(countParkedCars);
            
            $('#carTableBody').empty(); 
            parkedCars.forEach(car => {
                let entryTime = new Date(car.entryTime);
                let now = new Date();
                let hoursParked = Math.abs(now - entryTime) / 36e5;
                let totalPrice = (car.valorFaturado + Math.floor(hoursParked) * (car.tipo === 'carro' ? 1 : 0.5)).toFixed(2);
                $('#carTableBody').append(`
                    <tr>
                        <td>${car.tipo}</td>
                        <td>${car.placa}</td>
                        <td>${entryTime.toLocaleString()}</td>
                        <td>R$ ${totalPrice}</td>
                        <td><button class="btn btn-danger remove-car" data-id="${car.id}" data-price="${totalPrice}">Gerar Fatura</button></td>
                    </tr>
                `);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os carros: ', error);
        });
    }

    function loadFinanceiro() {
        fetch(urlCar)
        .then(response => {
            if(!response.ok){
                throw new Error('Erro ao acessar financeiro')
            }
            return response.json()
        })
        .then(cars => {
            let totalFaturado = cars.filter(car => car.faturado === true)
                                 .reduce((acc, car) => acc + parseFloat(car.valorFaturado || 0), 0);
            $('#financeiroTotal').text(`${totalFaturado.toFixed(2)}`);
            updateValorGeradoHoje(cars)

            $('#faturamentoTableBody').empty();

            cars.forEach(car => {
                if(car.faturado){
                    let dataFaturamento = new Date(car.dataFaturamento).toLocaleString();
                    $('#faturamentoTableBody').append(`
                        <tr>
                            <td>${car.placa}</td>
                            <td>${dataFaturamento}</td>
                            <td>R$ ${parseFloat(car.valorFaturado).toFixed(2)}</td>
                        </tr>
                        `)
                }
            })
        })
        .catch(error => {
            console.error('Erro ao carregar financeiro', error);
            
        });
    }

    function updateValorGeradoHoje(cars) {
        const dataAtual = new Date().toISOString().split('T')[0];
        let totalGeradoHoje = cars
        .filter(car => car.faturado === true && new Date(car.dataFaturamento).toISOString().split('T')[0] === dataAtual)
        .reduce((acc, car) => acc + parseFloat(car.valorFaturado || 0), 0);

        $('#valor-gerado').text(`R$ ${totalGeradoHoje.toFixed(2)}`);
    }

    function contarVeiculos() {
        fetch(urlCar)
        .then(response => {
            if(!response.ok){
                throw new Error('Erro de conexão')
            }
            return response.json();
        })
        .then(data => {
            let totalCarros = 0;
            let totalMotos = 0;

            data.forEach(car => {
                if(car.tipo === 'carro'){
                    totalCarros++;
                }else if (car.tipo === 'moto'){
                    totalMotos++;
                }
            });

            $('#countParkedCars').text(totalCarros);
            $('#countParkedMotos').text(totalMotos);
        })
    }

    loadCars();
    loadFinanceiro();
    contarVeiculos();

    $('#vehicleType').change(function(){
        if($(this).val()) {
            $('#placaContainer').show();
        }else {
            $('#placaContainer').hide();
            $('#placa').val('');
        }
    });


    $('#carForm').submit(function(e){
        e.preventDefault();
        let placa = $('#placa').val();
        let vehicleType = $('#vehicleType').val();
        let initialPrice = vehicleType === 'carro' ? 10 : vehicleType === 'moto' ? 5 : 0;

        if(initialPrice === 0) {
            showModal('Erro','Selecione um tipo de veiculo antes de cadastrar a placa.');
            return;
        }

        // Expressão regular para validar o formato da placa (padrão e padrão mercosul)
        const placaRegex = /^(?:[A-Z]{3}[0-9][A-Z][0-9]{2}|[A-Z]{3}[0-9]{4})$/;

        if(!placaRegex.test(placa)){
            showModal('Erro','Placa invalida! aplaca deve ser o formato ABC1234 ou ABC1D23.');
            return;
        }

        fetch(urlCar)
        .then(response => {
            if(!response.ok){
                throw new Error('Erro ao conectar ao banco')
            }
            return response.json();
        })
        .then(cars => {
            let carExists = cars.some(car => car.placa === placa && car.faturado === false);

            if(carExists) {
                showModal('Erro', 'Carro já estacionado no patio!')
            }else {
                $('#confirmPlaca').text(placa);
                $('#confirmationModal').modal('show');

                $('#confirmButton').off('click').click(function(){
                    let placa = $('#confirmPlaca').text();
                    let carro = {
                        placa:placa,
                        entryTime: dataAtual.toISOString(),
                        faturado: false,
                        valorFaturado: initialPrice,
                        tipo:vehicleType
                    };
            
                    fetch(urlCar, {
                        method: 'POST',
                        headers: {
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify(carro)
                    })
                        .then(response => {
                            if(!response.ok) {
                                throw new Error('Erro ao cadastrar carro')
                            }
                            return response.json()
                        })
                        .then(data => {
                            showModal('Sucesso', 'Carro estacionado com sucesso!')
                            $('#placa').val('');
                            $('#vehicleType').val('');
                            $('#placaContainer').hide();
                        })
                        .catch(error => {
                            console.error('Erro ao cadastrar carro', error);
                        });
            
                    $('#confirmationModal').modal('hide'); // Fecha o modal de confirmação
                        
                });
            }
        })
        .catch(error => {
            console.error('Erro ao cadastrar carro', error);
        });
        // .catch(error => {
        //     console.error('Error ao buscar carros no patio: ', error);
        // });
    });



    


    function showModal(title, body){
        $('#modalTitle').text(title);
        $('#modalBody').text(body);
        $('#carModal').modal('show');
    }

    $(document).on('click','.remove-car', function(){
        let carId = $(this).data('id');
        let totalPrice = $(this).data('price');

        $('#confirmExitButton').data('id',carId);
        $('#confirmExitButton').data('price', totalPrice);
        $('#exitModal').modal('show');
    });

    $('#confirmExitButton').click(function(){
        let carId = $(this).data('id');
        let totalPrice = $(this).data('price');

        fetch(`${urlCar}/${carId}`, {
            method:'PATCH',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                faturado: true,
                valorFaturado: totalPrice,
                dataFaturamento: new Date().toISOString()
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao faturar carro');
            }
            return response.json();
        })
        .then(() => {
            $('#exitModal').modal('hide');
            showModal('Sucesso', 'Carro removido com sucesso!');
            loadCars();
            loadFinanceiro();
        })
        .catch(error => {
            console.error('Erro ao faturar carro: ', error);
        });
    });
});