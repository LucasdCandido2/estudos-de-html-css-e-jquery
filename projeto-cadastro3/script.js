$(document).ready(function(){
    const apiUrl = 'http://localhost:3000/users';//url json-server
    function getData() {
        $.get(apiUrl)
            .done(function(users) {
                let tbody = $('#userTable tbody');
                tbody.empty();
    
                users.forEach(user => {
                    console.log(user.status);
                    
                    // Verifica o status e define a cor da bolinha e o dropdown
                    let statusDot = user.status === 'ativo'
                        ? '<span class="status-dot" style="background-color: #13e413;" onclick="toggleDropdown(this, \'inativo\', ' + user.id + ');"></span>'
                        : '<span class="status-dot" style="background-color: black;" onclick="toggleDropdown(this, \'ativo\', ' + user.id + ');"></span>';
    
                    // Montagem da linha da tabela
                    tbody.append(`
                        <tr class="${user.status}">
                            <td><img src="${user.photo}" alt="${user.name}" width="50"></td>
                            <td>${user.name}</td>
                            <td>${user.email}</td>
                            <td>${user.age}</td>
                            <td>
                                ${statusDot}
                                <select class="status-dropdown" style="display: none;" onchange="updateStatus(${user.id}, this.value)">
                                    <option value=""></option>
                                    ${user.status === 'ativo' ? '<option value="inativo">Inativar</option>' : '<option value="ativo">Ativar</option>'}
                                </select>
                            </td>
                        </tr>
                    `);
                });
            })
            .fail(function(error) {
                console.error('Erro ao encontrar usuario: ', error);
            });
    }

    window.toggleDropdown = function(dot, status, userId) {
        const dropdown = $(dot).closest('td').find('.status-dropdown');
        dropdown.show(); // Alterna a exibição do dropdown
        dropdown.on('blur', function() {
            dropdown.hide(); // Esconde o dropdown quando o foco for perdido
        });
    };
    
    

    $('#userForm').submit(function(e){
        e.preventDefault();
        let name = $('#name').val();
        let email = $('#email').val();
        let age = $('#age').val();
        let photo = $('#photo')[0].files[0];
        let reader = new FileReader();
        

        reader.onload = function(e){
            $.ajax({
                url: apiUrl,
                method: 'POST',
                contentType: 'application/json',
                data:JSON.stringify({
                    name:name,
                    email:email,
                    age:age,
                    photo:e.target.result,
                    status:'ativo'
                })
            })
            .done(function(){
                getData();
                $('#userForm')[0].reset();
            })
            .fail(function(error){
                console.error('Erro ao criar usuario: ',error);
                
            });
        };
        reader.readAsDataURL(photo);
    });

    window.updateStatus = function(id, status){
        $.ajax({
            url: `${apiUrl}/${id}`,
            type: 'PATCH',
            contentType: 'application/json',
            data: JSON.stringify({status:status})
        })
        .done(function(){
            getData();
        })
        .fail(function(error){
            console.error('Erro ao atualizar status: ', error);            
        });
    };

    getData();
});