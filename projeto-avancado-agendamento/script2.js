$(document).ready(function(){
    const getData = function(){
        fetch('http://localhost:3000/agendamentos')
        .then(response => {
            if(!response.ok){
                throw new Error('Erro ao conectar ao servidor')
            }
            return response.json();
        })
        .then(data => {
            $('table').empty();
            
            let shouldDisplayHeader = true; //controla a exibição do cabeçalho

            data.forEach(([hora, agendamentos]) => {
                if(shouldDisplayHeader){
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
                    shouldDisplayHeader = false;//o cabeçaho só sera repetido quando necessario

                    if(agendamentos.length > 0){
                        agendamentos.forEach(agendamento => {
                            let statusClass = getStatusClass(agendamento.status); // Função para retornar a classe do status
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
                    }
                    
                }else {
                    $('table tbody').append(`
                        <tr>
                            <td class="text-center" colspan="5">Nenhum agendamento para ${hora}</td>
                        </tr>
                    `);
                }

                shouldDisplayHeader = true;

                // $('table tbody').append(`
                //     <tr>
                //         <td class="text-center" colspan="5"><strong>${hora}</strong></td>
                //     </tr>
                // `);


            })
            

            
        });

        function getStatusClass(status){
            switch (status){
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


    }
    getData();

})
function changeStatus(id, status) {
    fetch(`http://localhost:3000/agendamentos/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({status:status})
    })
    .then(response => {
        if(!response.ok){
            throw new Error('Erro ao atualizar o status');
        }
        return response.json();
    })
    .then(data => {
        alert('Atualização de status feita')
        getData();
    })
    .catch(error => {
        console.error(error);
        
    })
}


// $('table').empty();
//             $('table').append(`
//                 <thead>
//                     <tr>
//                         <th class="text-center">#</th>
//                         <th class="text-center">Protocolo</th>
//                         <th class="text-center">Favorecido</th>
//                         <th class="text-center">Data/Hora</th>
//                         <th class="text-center">Status</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//             `)
//             data.forEach(horaAgendamento => {
//                 let hora = horaAgendamento[0];
//                 let pacientes = horaAgendamento[1];

//                 if(pacientes.length > 0){
//                     pacientes.forEach(agendamento => {
//                         let statusClass = getStatusClass(agendamento.status);
//                         $('table tbody').append(`
//                             <tr>
//                                 <td class="text-center">${agendamento.id}</td>
//                                 <td class="text-center">${agendamento.protocolo}</td>
//                                 <td class="text-center">${agendamento.nomes}</td>
//                                 <td class="text-center">${hora}</td>
//                                 <td class="text-center">
//                                     <div class="btn-group dropright">
//                                         <button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
//                                             <span class="dot ${statusClass}"></span>
//                                         </button>
//                                         <ul class="dropdown-menu">
//                                             <li>
//                                                 <span class="dropdown-item" onclick="changeStatus('${agendamento.id}', 'concluído')">
//                                                     <span class="dot bg-success me-2"></span> Concluído
//                                                 </span>
//                                             </li>
//                                             <li>
//                                                 <span class="dropdown-item" onclick="changeStatus('${agendamento.id}', 'em-análise')">
//                                                     <span class="dot bg-primary me-2"></span> Em Análise
//                                                 </span>
//                                             </li>
//                                             <li>
//                                                 <span class="dropdown-item" onclick="changeStatus('${agendamento.id}', 'cancelado')">
//                                                     <span class="dot bg-danger me-2"></span> Cancelado
//                                                 </span>
//                                             </li>
//                                         </ul>
//                                     </div>
//                                 </td>
//                             </tr>
//                         `);
//                     });
//                 }else{
//                     $('table tbody').append(`
//                         <tr>
//                             <td class="text-center" colspan="5">${hora}: Nenhum agendamento</td>
//                         </tr>
//                     `);
//                 }
//                 $('table').append(`</tbody>`)
//             });