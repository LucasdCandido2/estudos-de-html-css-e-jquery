$(document).ready(function() {
    // Cadastro de agendamento
    $('#cadastroForm').on('submit', function(e) {
        e.preventDefault();
        
        let nome = $('#nome').val();
        let email = $('#email').val();
        let idade = $('#idade').val();
        let data = $('#data').val();
        let hora = $('#hora').val();
        let imagem = $('#imagem')[0].files[0];
        let csv = $('#csv')[0].files[0];
        
        let formData = new FormData();
        formData.append('nome', nome);
        formData.append('email', email);
        formData.append('idade', idade);
        formData.append('data', data);
        formData.append('hora', hora);
        formData.append('status', 'agendado');
        formData.append('imagem', imagem); // Enviar imagem
        formData.append('csv', csv); // Enviar CSV
    
        $.ajax({
            url: 'http://localhost:3000/agendamentos',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            xhr: function() {
                let xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener('progress', function(event) {
                    if (event.lengthComputable) {
                        let percentComplete = (event.loaded / event.total) * 100;
                        $('#progressBar').val(percentComplete);
                    }
                }, false);
                return xhr;
            },
            success: function() {
                alert('Agendamento cadastrado com sucesso!');
            }
        });
    });

    // Exibir agendamentos de hoje na home
    function exibirAgendamentosHoje() {
        let hoje = new Date().toISOString().split('T')[0];
        
        $.get('http://localhost:3000/agendamentos', function(data) {
            let agendamentosHoje = data.filter(ag => ag.data === hoje);
            let tbody = $('#agendamentosHoje tbody');
            tbody.empty();
            
            agendamentosHoje.forEach(ag => {
                let row = `
                    <tr>
                        <td>${ag.nome}</td>
                        <td>${ag.email}</td>
                        <td>${ag.idade}</td>
                        <td>${ag.data}</td>
                        <td>${ag.hora}</td>
                        <td>${ag.status}</td>
                        <td><img src="${ag.imagem}" width="50"></td>
                        <td>${ag.csv}</td>
                    </tr>
                `;
                tbody.append(row);
            });
        });
    }

    // Função para carregar todos os agendamentos em agendamentos.html
    function carregarAgendamentos() {
        $.get('http://localhost:3000/agendamentos', function(data) {
            let tbody = $('#agendamentosTable tbody');
            tbody.empty();
            
            data.forEach(ag => {
                let row = `
                    <tr>
                        <td>${ag.nome}</td>
                        <td>${ag.email}</td>
                        <td>${ag.idade}</td>
                        <td>${ag.data}</td>
                        <td>${ag.hora}</td>
                        <td>${ag.status}</td>
                        <td><img src="${ag.imagem}" width="50"></td>
                        <td>${ag.csv}</td>
                    </tr>
                `;
                tbody.append(row);
            });
        });
    }

    // Exibir agendamentos de hoje na página 'home.html'
    if (window.location.pathname.includes('home.html')) {
        exibirAgendamentosHoje();
    }

    // Exibir todos os agendamentos na página 'agendamentos.html'
    if (window.location.pathname.includes('agendamentos.html')) {
        carregarAgendamentos();
    }

    // Pesquisa com "Enter" na página de agendamentos
    $('#pesquisa').on('keypress', function(e) {
        if (e.which == 13) { // Tecla Enter
            e.preventDefault(); // Evita a submissão do formulário ao pressionar Enter
            let filtro = $(this).val().toLowerCase();

            $('#agendamentosTable tbody tr').filter(function() {
                $(this).toggle($(this).text().toLowerCase().indexOf(filtro) > -1);
            });
        }
    });

    // Carregar agendamentos
    function carregarAgendamentos() {
        $.get('http://localhost:3000/agendamentos', function(data) {
            let statusFiltro = $('#statusFiltro').val();
            let termoPesquisa = $('#pesquisa').val().toLowerCase();

            let agendamentosFiltrados = data.filter(ag => {
                let correspondeStatus = statusFiltro === '' || ag.status === statusFiltro;
                let correspondePesquisa = ag.nome.toLowerCase().includes(termoPesquisa) ||
                                          ag.email.toLowerCase().includes(termoPesquisa) ||
                                          ag.idade.toLowerCase().includes(termoPesquisa) ||
                                          ag.data.toLowerCase().includes(termoPesquisa) ||
                                          ag.hora.toLowerCase().includes(termoPesquisa);
                return correspondeStatus && correspondePesquisa;
            });

            let tbody = $('#agendamentosTable tbody');
            tbody.empty();
            
            agendamentosFiltrados.forEach(ag => {
                let row = `
                    <tr>
                        <td>${ag.nome}</td>
                        <td>${ag.email}</td>
                        <td>${ag.idade}</td>
                        <td>${ag.data}</td>
                        <td>${ag.hora}</td>
                        <td>
                            <select class="statusSelect" data-id="${ag.id}">
                                <option value="agendado" ${ag.status === 'agendado' ? 'selected' : ''}>Agendado</option>
                                <option value="atendendo" ${ag.status === 'atendendo' ? 'selected' : ''}>Atendendo</option>
                                <option value="finalizado" ${ag.status === 'finalizado' ? 'selected' : ''}>Finalizado</option>
                                <option value="cancelado" ${ag.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                            </select>
                            <span class="dot status-${ag.status}"></span>
                        </td>
                        <td><img src="${ag.imagem}" width="50"></td>
                        <td><a href="#" class="view-csv" data-csv="${ag.csv}">${ag.csv}</a></td>
                    </tr>
                `;
                tbody.append(row);
            });
        });
    }

    // Função para abrir o modal com o conteúdo do CSV
    $(document).on('click', '.view-csv', function(e) {
        e.preventDefault();
        let csvFileName = $(this).data('csv');
        
        if (csvFileName) {
            $.ajax({
                url: `http://localhost:3000/uploads/${csvFileName}`, // Supondo que o arquivo CSV seja armazenado nessa pasta
                method: 'GET',
                success: function(data) {
                    $('#csvContent').text(data); // Exibir o conteúdo do CSV
                    $('#csvModal').fadeIn(); // Abrir o modal
                },
                error: function() {
                    alert('Erro ao carregar o arquivo CSV');
                }
            });
        }
    });

    // Fechar o modal
    $('.close').on('click', function() {
        $('#csvModal').fadeOut();
    });

    // Atualizar status
    $(document).on('change', '.statusSelect', function() {
        let novoStatus = $(this).val();
        let agendamentoId = $(this).data('id');

        $.ajax({
            url: `http://localhost:3000/agendamentos/${agendamentoId}`,
            method: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify({ status: novoStatus }),
            success: function() {
                carregarAgendamentos();
            }
        });
    });

    // Filtros
    $('#statusFiltro, #pesquisa').on('input change', function() {
        carregarAgendamentos();
    });

    carregarAgendamentos();
});
