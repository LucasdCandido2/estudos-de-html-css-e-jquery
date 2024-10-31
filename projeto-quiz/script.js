$(document).ready(function () {
    const URL_perg = "http://localhost:3000/perguntas";
    const URL_part = "http://localhost:3000/participantes";
    let perguntas = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let nomeParticipante = "";
    let perguntasErradas = [];

    //Evento ao clicar em "Iniciar Quiz"
    $('#start-btn').click(function () {
        nomeParticipante = $('#nome-participante').val();
        // console.log("Nome do participante capturado:", nomeParticipante);
        if (nomeParticipante === "") {
            alert("Por favor, digitar seu nome para começar o quiz.");
            return;
        }

        //Ocultar o campo de entrada e mostrar o quiz
        $('#star-quiz').hide();
        $('#quiz-container').show();
        $('#next-question').show();

        //Obtem perguntas do servidor
        $.getJSON(URL_perg, function (data) {
            // console.log("Dados recebidos:", data);

            // Verifica se a propriedade 'perguntas' existe e é um array
            if (Array.isArray(data) && data.length > 0) {
                perguntas = data.map(pergunta => ({
                    id: pergunta.id,
                    text: pergunta.pergunta,
                    opcoes: pergunta.opcoes,
                    correta: String(pergunta.correta)
                }));

                // console.log('Perguntas processadas:', perguntas);
                perguntas = shuffleArray(perguntas);  // Embaralha as perguntas

                exibirPerguntas();
            } else {
                console.error('Erro: Nenhuma pergunta carregada ou estrutura de dados inesperada!');
                alert('Erro ao carregar perguntas. Por favor, verifique o servidor.');
            }
        }).fail(function () {
            console.error("Erro: Não foi possível conectar ao servidor.");
            alert("Erro ao conectar com o servidor de perguntas.");
        });
    });

    //função para exibir a pergunta
    function exibirPerguntas() {
        // console.log(`Índice da pergunta atual: ${currentQuestionIndex}`);
        if (!perguntas || perguntas.length === 0) {
            console.error('Erro: Array de perguntas está vazio.');
            alert('Erro ao carregar perguntas. Verifique o servidor.');
            return;
        }
        if (currentQuestionIndex >= perguntas.length || currentQuestionIndex < 0) {
            finalizarQuiz();
            return;
        }

        const perguntaAtual = perguntas[currentQuestionIndex];
        // console.log("Pergunta atual:", perguntaAtual);

        if (!perguntaAtual) {
            console.error('Pergunta atual é undefined. Verifique a lógica de acesso.');
            return;
        }

        $('#quiz-container').html(`
            <h3>${perguntaAtual.text}</h3>
            ${perguntaAtual.opcoes.map(opcao => `
                <button class="btn btn-info option-btn" data-resposta="${opcao}">
                    ${opcao}
                </button>
            `).join("")}
        `);

        //Verifica a resposta ao clicar
        $('.option-btn').click(function () {
            const respostaSelecionada = $(this).data('resposta');
            // console.log(`Resposta selecionada: ${respostaSelecionada}, Resposta correta: ${perguntaAtual.correta}`); // Adicionando log para depuração
            if (String(respostaSelecionada) === String(perguntaAtual.correta)) {
                score += 1;
                $('#score').text(score);
            } else {
                perguntasErradas.push(perguntaAtual.text);
            }

            currentQuestionIndex++;
            exibirPerguntas();
        });
    }

    //Função para finalizar o quiz e registrar a pontuação
    function finalizarQuiz() {
        const resultado = {
            nome: nomeParticipante,
            score: score,
            status: perguntasErradas.length === 0 ? "Acertou todas" : "Errou algumas",
            perguntasErradas: perguntasErradas
        };

        // console.log("Resultado a ser enviado:", resultado);

        $.ajax({
            url: URL_part,
            type: 'POST',
            data: JSON.stringify(resultado),
            contentType: 'application/json',
            success: function () {
                alert('Quiz finalizado! Seu resultado foi salvo.');
                location.reload()
            },
            error: function () {
                console.error('Erro ao salvar o participante.');
                alert('Erro ao salvar os dados do participante.')
            }
        })
    }

    //Função para embaralhar as perguntas
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    //Função para buscar participantes e exibir na tabela
    function carregarRanking() {
        $.getJSON(URL_part, function (data) {
            const rankingBody = $('#ranking-body');
            rankingBody.empty();

            data.sort((a,b) => {
                if(b.score === a.score) {
                    return a.nome.localeCompare(b.nome);
                }
                return b.score - a.score;
            });

            data.forEach((participante, index) => {
                const row = `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${participante.nome}</td>
                        <td>${participante.score}</td>
                        <td>${participante.status}</td>
                    </tr
                `;
                rankingBody.append(row);
            });
        }).fail(function() {
            alert('Erro ao carregar o ranking. Verificar o servidor');
        });
    }

    carregarRanking()
});