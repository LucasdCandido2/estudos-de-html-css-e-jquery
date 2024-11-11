$(document).ready(function() {
    // Inicializa o EmailJS com seu User ID
    emailjs.init("Gmail"); // Substitua YOUR_USER_ID pelo seu User ID do EmailJS
  
    // Adiciona um novo campo para participante
    $('#add-participant').click(function() {
      $('#participant-list').append(`
        <div class="participant">
          <input type="text" class="form-control mb-2" name="name" placeholder="Nome" required>
          <input type="email" class="form-control mb-2" name="email" placeholder="E-mail" required>
        </div>
      `);
    });
  
    // Realiza o sorteio ao enviar o formulário
    $('#participants-form').submit(function(e) {
      e.preventDefault();
  
      let participants = [];
      $('.participant').each(function() {
        const name = $(this).find('input[name="name"]').val();
        const email = $(this).find('input[name="email"]').val();
        participants.push({ name, email });
      });
  
      if (participants.length < 3) {
        alert("São necessários pelo menos 3 participantes.");
        return;
      }
  
      // Embaralha a lista até atender as regras
      let sorted = false;
      while (!sorted) {
        sorted = true;
        participants = participants.sort(() => Math.random() - 0.5);
  
        for (let i = 0; i < participants.length; i++) {
          if (participants[i].name === participants[(i + 1) % participants.length].name) {
            sorted = false;
            break;
          }
        }
      }
  
      // Envia e-mails para cada participante
      participants.forEach((giver, i) => {
        const receiver = participants[(i + 1) % participants.length];
        sendEmail(giver, receiver);
      });
  
      alert("Sorteio realizado e e-mails enviados com sucesso!");
    });
  
    // Função para enviar o e-mail usando EmailJS
    function sendEmail(giver, receiver) {
      const serviceID = "service_rx8kabd"; // ID do serviço fornecido pelo EmailJS
      const templateID = "template_zkxa2lm"; // ID do template fornecido pelo EmailJS
  
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
  