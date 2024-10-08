// Função para carregar os dados do servidor e preencher a tabela
const getData = function() {
    fetch('http://localhost:3000/pessoas')
       .then(response => response.json())
       .then(data => {
          $('tbody').empty(); // Limpar a tabela antes de preencher
          data.forEach(pessoa => {
             let statusText = '';
 
             switch (pessoa.status) {
                case '0':
                   statusText = 'Em Análise';
                   break;
                case '1':
                   statusText = 'Confirmado';
                   break;
                case '2':
                   statusText = 'Concluído';
                   break;
             }
 
             $('tbody').append(`
                <tr data-id="${pessoa.id}">
                   <td>${pessoa.id}</td>
                   <td>${pessoa.nome}</td>
                   <td>${pessoa.email}</td>
                   <td>
                      <select onchange="atualizarStatus(${pessoa.id}, this.value)">
                         <option value="0" ${pessoa.status === '0' ? 'selected' : ''}>Em Análise</option>
                         <option value="1" ${pessoa.status === '1' ? 'selected' : ''}>Confirmado</option>
                         <option value="2" ${pessoa.status === '2' ? 'selected' : ''}>Concluído</option>
                      </select>
                   </td>
                   <td>
                      <button class="edit" onclick="editar(${pessoa.id})">Editar</button>
                      <button class="delete" onclick="deletar(${pessoa.id})">Deletar</button>
                   </td>
                </tr>
             `);
          });
       })
       .catch(error => console.error('Erro ao carregar os dados:', error));
 }
 
 // Função para cadastrar ou editar usuário
 const cadastrar = function(event) {
    event.preventDefault();
 
    const id = $('#user-id').val();
    const nome = $('#name').val();
    const email = $('#email').val();
    const senha = $('#password').val();
    const status = '0'; // Sempre começando com "Em Análise"
 
    if (!nome || !email || !senha) {
       alert('Preencha todos os campos!');
       return;
    }
 
    if (id) {
       // Atualizar usuário existente
       fetch(`http://localhost:3000/pessoas/${id}`, {
          method: 'PATCH',
          headers: {
             'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nome, email, senha })
       })
       .then(response => {
          if (!response.ok) throw new Error('Erro ao atualizar');
          getData(); // Recarregar a tabela
          limparFormulario();
       })
       .catch(error => console.error('Erro ao atualizar:', error));
    } else {
       // Criar novo usuário
       fetch('http://localhost:3000/pessoas', {
          method: 'POST',
          headers: {
             'Content-Type': 'application/json'
          },
          body: JSON.stringify({ nome, email, senha, status })
       })
       .then(response => {
          if (!response.ok) throw new Error('Erro ao cadastrar');
          getData(); // Recarregar a tabela
          limparFormulario();
       })
       .catch(error => console.error('Erro ao cadastrar:', error));
    }
 }
 
 // Função para editar usuário
 const editar = function(id) {
    fetch(`http://localhost:3000/pessoas/${id}`)
       .then(response => response.json())
       .then(pessoa => {
          $('#user-id').val(pessoa.id);
          $('#name').val(pessoa.nome);
          $('#email').val(pessoa.email);
          $('#password').val(pessoa.senha);
       })
       .catch(error => console.error('Erro ao carregar usuário:', error));
 }
 
 // Função para deletar usuário
 const deletar = function(id) {
    fetch(`http://localhost:3000/pessoas/${id}`, {
       method: 'DELETE'
    })
    .then(response => {
       if (!response.ok) throw new Error('Erro ao deletar');
       getData(); // Recarregar a tabela
    })
    .catch(error => console.error('Erro ao deletar:', error));
 }
 
 // Função para atualizar o status
 const atualizarStatus = function(id, novoStatus) {
    fetch(`http://localhost:3000/pessoas/${id}`, {
       method: 'PATCH',
       headers: {
          'Content-Type': 'application/json'
       },
       body: JSON.stringify({ status: novoStatus })
    })
    .then(response => {
       if (!response.ok) throw new Error('Erro ao atualizar status');
       getData(); // Recarregar a tabela
    })
    .catch(error => console.error('Erro ao atualizar status:', error));
 }
 
 // Função para limpar o formulário após cadastrar/editar
 const limparFormulario = function() {
    $('#user-id').val('');
    $('#name').val('');
    $('#email').val('');
    $('#password').val('');
 }
 
 $(document).ready(function() {
    getData();
 
    $('#user-form').on('submit', cadastrar);
 });
 