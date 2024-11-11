$(document).ready(function() {
  emailjs.init("O3QP4wiEbApizgOri"); // Inicialize o EmailJS com a chave pública correta

  const participants = [];

  // Função para adicionar participante à tabela
  $('#add-participant').click(function() {
    const name = $('#name').val();
    const email = $('#email').val();

    if (name && email) {
      participants.push({ name, email });
      $('#participant-list').append(`
        <tr>
          <td>${name}</td>
          <td>${email}</td>
          <td><button class="btn btn-danger btn-sm remove-participant">Remover</button></td>
        </tr>
      `);
      $('#name').val('');
      $('#email').val('');
    } else {
      alert("Por favor, preencha o nome e o e-mail.");
    }
  });

  // Função para remover participante da lista
  $('#participant-list').on('click', '.remove-participant', function() {
    const rowIndex = $(this).closest('tr').index();
    participants.splice(rowIndex, 1);
    $(this).closest('tr').remove();
  });

  // Mostrar modal de confirmação
  $('#confirm-participants').click(function() {
    if (participants.length < 3) {
      alert("São necessários pelo menos 3 participantes.");
      return;
    }

    $('#participant-names').empty();
    participants.forEach(p => {
      $('#participant-names').append(`<li>${p.name} - ${p.email}</li>`);
    });

    $('#confirmationModal').modal('show');
  });

  // Função para enviar e-mails após confirmação no modal
  $('#send-emails').click(function() {
    $('#confirmationModal').modal('hide');

    let sorted = false;
    while (!sorted) {
      sorted = true;
      participants.sort(() => Math.random() - 0.5);

      for (let i = 0; i < participants.length; i++) {
        if (participants[i].name === participants[(i + 1) % participants.length].name) {
          sorted = false;
          break;
        }
      }
    }

    participants.forEach((giver, i) => {
      const receiver = participants[(i + 1) % participants.length];
      sendEmail(giver, receiver);
    });

    alert("Sorteio realizado e e-mails enviados com sucesso!");
  });

  // Função para enviar e-mail usando EmailJS
  function sendEmail(giver, receiver) {
    const serviceID = "service_rx8kabd";
    const templateID = "template_zkxa2lm";
    const templateParams = {
      giver_name: giver.name,
      receiver_name: receiver.name,
      giver_email: giver.email,
    };

    emailjs.send(serviceID, templateID, templateParams)
      .then(response => {
        console.log(`E-mail enviado para ${giver.name}: ${response.status}`, response.text);
      })
      .catch(error => {
        console.error(`Erro ao enviar e-mail para ${giver.name}:`, error);
      });
  }
});
