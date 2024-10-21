$(document).ready(function(){
    const getData = function(){
        fetch('http://localhost:3000/agendamentos')
        .then(response => {
            if(!response.ok){
                throw new Error('Erro ao conectar ao servidor');
            }
            return response.json();
        })
        .then(data => {
            $('table').empty(); // Limpa a tabela antes de começar a renderizar

            let isBlockOpen = false; // Para controlar se estamos em um bloco
            let isAgendamentoBlock = false; // Para saber se estamos em um bloco de agendamentos

            data.forEach(([hora, agendamentos], index) => {
                if (agendamentos.length > 0) {
                    // Se há agendamentos, verificamos se estamos em um bloco de "sem agendamentos"
                    if (!isBlockOpen || !isAgendamentoBlock) {
                        // Se não há um bloco aberto ou se o bloco anterior era de "sem agendamentos", abre um novo bloco de "com agendamentos"
                        $('table').append(`
                            <thead>
                                <tr>
                                    <th class="text-center">#</th>
                                    <th class="text-center">Protocolo</th>
                                    <th class="text-center">Favorecido</th>
                                    <th class="text-center">Hora</th>
                                    <th class="text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        `);
                        isBlockOpen = true;
                        isAgendamentoBlock = true; // Estamos em um bloco de agendamentos
                    }

                    // Adiciona os agendamentos do bloco atual
                    agendamentos.forEach(agendamento => {
                        let statusClass = getStatusClass(agendamento.status); // Classe do status
                        $('table tbody').append(`
                            <tr>
                                <td class="text-center">${agendamento.id}</td>
                                <td class="text-center">${agendamento.protocolo}</td>
                                <td class="text-center">${agendamento.nomes}</td>
                                <td class="text-center">${hora}</td>
                                <td class="text-center">
                                    <div class="btn-group dropright">
                                        <button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                            <span class="dot ${statusClass}"></span>
                                        </button>
                                        <ul class="dropdown-menu">
                                            <li>
                                                <span class="dropdown-item" onclick="changeStatus('${agendamento.id}', 'concluído')">
                                                    <span class="dot bg-success me-2"></span> Concluído
                                                </span>
                                            </li>
                                            <li>
                                                <span class="dropdown-item" onclick="changeStatus('${agendamento.id}', 'em análise')">
                                                    <span class="dot bg-primary me-2"></span> Em Análise
                                                </span>
                                            </li>
                                            <li>
                                                <span class="dropdown-item" onclick="changeStatus('${agendamento.id}', 'cancelado')">
                                                    <span class="dot bg-danger me-2"></span> Cancelado
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </td>
                            </tr>
                        `);
                    });
                } else {
                    // Se não há agendamentos, verificamos se estamos em um bloco de "com agendamentos"
                    if (!isBlockOpen || isAgendamentoBlock) {
                        // Se não há um bloco aberto ou o bloco anterior era de "com agendamentos", abre um novo bloco de "sem agendamentos"
                        $('table').append(`
                            <thead>
                                <tr>
                                    <th class="text-center">#</th>
                                    <th class="text-center">Hora</th>
                                    <th class="text-center">Disponibilidade</th>
                                </tr>
                            </thead>
                            <tbody></tbody>
                        `);
                        isBlockOpen = true;
                        isAgendamentoBlock = false; // Estamos em um bloco sem agendamentos
                    }

                    // Adiciona a linha informando que o horário está livre
                    $('table tbody').append(`
                        <tr>
                            <td class="text-center">${index + 1}</td>
                            <td class="text-center">${hora}</td>
                            <td class="text-center">Horário livre</td>
                        </tr>
                    `);
                }
            });

            // Função para retornar a classe de status
            function getStatusClass(status) {
                switch (status) {
                    case 'concluído':
                        return 'bg-success';
                    case 'em análise':
                        return 'bg-primary';
                    case 'cancelado':
                        return 'bg-danger';
                    default:
                        return '';
                }
            }
        })
        .catch(error => {
            console.error('Erro ao buscar os agendamentos:', error);
        });
    };

    getData(); // Chama a função ao carregar a página
});

function changeStatus(id, status) {
    fetch(`http://localhost:3000/agendamentos/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({ status: status })
    })
    .then(response => {
        if(!response.ok){
            throw new Error('Erro ao atualizar o status');
        }
        return response.json();
    })
    .then(() => {
        alert('Status atualizado com sucesso');
        getData(); // Recarrega a tabela com os novos dados
    })
    .catch(error => {
        console.error('Erro ao atualizar status:', error);
    });
}
