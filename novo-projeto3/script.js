const getData = function () {
   fetch('http://localhost:3000/pessoas')
   .then(response => response.json())
   .then(data => {
      $('tbody').empty();
      data.forEach(function(e) {
         let statusClass = '';
         let statusValue = e.status;
         switch (e.status) {
            case '0':
               statusClass = 'status-analise';
               break;
            case '1':
               statusClass = 'status-concluido';
               break;
            case '2':
               statusClass = 'status-cancelado';
               break;
         }
         $('tbody').append(`
            <tr data-id="${e.id}" class=${statusClass}">
               <td>${e.id}</td>
               <td>${e.nome}</td>
               <td>${e.email}</td>
               <td>${e.senha}</td>
               <td>
                  <select onchange="atualizarStatus(${e.id}, this.value)">
                     <option value="0" ${statusValue === '0' ? 'selected' : ''}>Em Analise</option>
                     <option value="1" ${statusValue === '1' ? 'selected' : ''}>Confirmado</option>
                     <option value="2" ${statusValue === '2' ? 'selected' : ''}>Cancelado</option>
                  </select>
               </td>
               <td><button onclick="cadastrar(${e.id})">Editar</button></td>
               <td><button onclick="deletar(${e.id})">Deletar</button></td>
            </tr>
         `);
      });
   })
   .catch(error => console.error("Erro ao carregar os dados:", error));
}

//função cadastrar e editar
const cadastrar = function(id) {
   let nome = $('#name').val();
   let email = $('#email').val();
   let senha = $('#password').val();
   let status = "0";

   if (!nome || !email || !senha) {
      alert("Preencha todo os campos");
      return;
   }

   if (id) {
      fetch(`http://localhost:3000/pessoas/${id}`, {
         method: 'PATCH',
         headers: {
            'Content-Type':'application/json'
         },
         body: JSON.stringify({nome, email, senha})
      })
      .then(response => {
         if (!response.ok) {
            throw new Error("Falha ao editar pessoa");
         }
         //atuaiza diretamente o DOM
         const row = $(`tr[data-id='${id}']`);
         row.find('td:nth-child(2)').text(nome);
         row.find('td:nth-child(3)').text(email);
         row.find('td:nth-child(4)').text(senha);

         //limpa os campos após edição
         $('#submit-btn').removeData('id');
         $('#name').val('');
         $('#email').val('');
         $('#password').val('');
         // getData();
      })
      .catch(error => console.error('Erro:',error));
   } else {
      fetch('http://localhost:3000/pessoas')
      .then(pessoasResponse => pessoasResponse.json())
      .then(pessoas => {
         let maxId = pessoas.length > 0 ? Math.max(...pessoas.map(p => p.id)):0;
         let novoId = (maxId + 1).toString();

         return fetch('http://localhost:3000/pessoas', {
            method: 'POST',
            headers: {
               'Content-Type':'application/json'
            },
            body: JSON.stringify({id:novoId,nome,email,senha,status}),
         });
      })
      .then(response => {
         if (!response.ok) {
            throw new Error('Falha ao cadastrar pessoa!');
         }
         // Atualizando o DOM diretamente com a nova pessoa cadastrada
         $('tbody').append(`
            <tr data-id="${novoId} class="status-analise">
               <td>${novoId}</td>
               <td>${nome}</td>
               <td>${email}</td>
               <td>${senha}</td>
               <td>
                  <select onchange="atualizarStatus(${novoId}, this.value)">
                     <option value="0" selected>Em Analise</option>
                     <option value="1">Confirmado</option>
                     <option value="2">Cancelado</option>
                  </select>
               </td>
               <td><button onclick="cadastrar(${novoId})">Editar</button></td>
               <td><button onclick="deletar(${novoId})">Deletar</button></td>
            </tr>
         `);

         $('#name').val('');
         $('#email').val('');
         $('#password').val('');
         // getData();
      })
      .catch(error => console.error('Error: ', error));
      
   }
};

const deletar = function(id) {
   fetch(`http://localhost:3000/pessoas/${id}`, {
      method: 'DELETE'
   })
   .then(response => {
      if (!response.ok) {
         throw new Error('Falha ao excluir');
      }
      // getData();
      $(`tr[data-id='${id}']`).remove();
   })
   .catch(error => console.error('Erro ao excluir:', error));
};


const atualizarStatus = function(id,novoStatus) {
   fetch(`http://localhost:3000/pessoas/${id}`, {
      method:'PATCH',
      headers: {
         'Content-type':'application/json'
      },
      body: JSON.stringify({novoStatus}),
   })
   .then(response => {
      if (!response.ok) {
         throw new Error('Falha ao trocar status!');
      }
      // getData();

      //atualizando diretamente o dom com a nova classe
      const row = (`tr[data-id='${id}']`);
      row.attr('class','');
      switch (novoStatus) {
         case '0':
            row.addClass('status-analise');
            break;
         case '1':
            row.addClass('status-concluido');
            break;
         case '2':
            row.addClass('status-cancelado');
            break;
      }
   })
   .catch(error => console.error('Error', error));
};


$(document).ready(function() {
   getData()

   $('#user-form').on('submit', function(event) {
      event.preventDefault();
      cadastrar();
   })
})