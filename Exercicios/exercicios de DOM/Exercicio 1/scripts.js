$(document).ready(function() {
    // Adicionar nova tarefa
    $('#adicionar-tarefa').on('click', function() {
        const tarefa = $('#nova-tarefa').val();
        if (tarefa !== '') {
            $('#lista-tarefas').append(`<li>${tarefa} <button class="editar">Editar</button> <button class="remover">Remover</button></li>`);
            $('#nova-tarefa').val('');
        }
    });

    // Remover tarefa
    $('#lista-tarefas').on('click', '.remover', function() {
        $(this).parent().remove();
    });

    // Editar tarefa
    $('#lista-tarefas').on('click', '.editar', function() {
        const tarefaAtual = $(this).parent().text().replace('EditarRemover', '').trim();
        const novaTarefa = prompt('Editar tarefa:', tarefaAtual);
        if (novaTarefa !== null && novaTarefa !== '') {
            $(this).parent().html(`${novaTarefa} <button class="editar">Editar</button> <button class="remover">Remover</button>`);
        }
    });

    // Efeito de destaque ao passar o mouse sobre a tarefa
    $('#lista-tarefas').on('mouseenter', 'li', function() {
        $(this).css('background-color', '#f0f0f0');
    });

    $('#lista-tarefas').on('mouseleave', 'li', function() {
        $(this).css('background-color', '#fff');
    });
});
