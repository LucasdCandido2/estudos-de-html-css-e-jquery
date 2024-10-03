$(document).ready(function(){
    //Função para atualizar o contador
    function updateTaskcount(){
        let count = $('#task-list li').length;
        $('#task-count').text(`Total de tarefas: ${count}`);
    }
    //1. Adicionar nova tarefa
    $('#task-form').submit(function(event){
        event.preventDefault();
        let newTask = $('#new-task').val();

        if(newTask !== '') {
            $('#task-list').append(
                `<li>\
                    ${newTask}\
                    <button class="remove-task">Remover</button>\
                </li>`
            );
            $('#new-task').val();
            updateTaskcount();
        }
    });

    //2. Remover tarefa (Delegação de eventos)
    $('#task-list').on('click','.remove-task',function(){
        $(this).parent().slideUp(300, function(){
            $(this).remove();
            updateTaskcount();
        });
    });
    
    //Função para editar tarefas



    //3.Marcar tarefa como feita
    $('#task-list').on('click','li',function(event){
        //verificar se ao clique oi no botão "remover". se sim, não marcar como feito
        if($(event.target).is('.remove-task')) {
            return;
        }

        //Alterar entre tarefas feita e não feita
        $(this).toggleClass('done');
    });

    //editar tarefa (click duplo)
    $('#task-list').on('dblclick','li', function(event){
        if($(event.target).is('.remove-task')){
            return;
        }

        //capturar o texto da tarefa e remover o botão antes de editar
        let taskText = $(this).clone().children().remove().end().text().trim();

        //substituir o texto por um campo de entrada para edição
        let taskInput = `<input type="text" value="${taskText}" class="edit-task" />`;
        $(this).html(taskInput + '<button class="remove-task">Remover</button>');

        //focar automaticamente no campo de texto e já permitir digitação
        let input = $(this).find('input');
        input.focus(); //Foca no campo de entrada automaticamente

        //move o cursor para o fim do texto no campo de input
        input[0].setSelectionRange(taskText.length, taskText.length);

        //salvar a edição ao pressionar "Enter" ou ao prender o foco
        $(this).find('input').on('keypress blur',function(e){
            if (e.which === 13 || e.type === 'blur') {//Enter ou quando perde o foco
                let updatedText = $(this).val();
                $(this).parent().html(`${updatedText} <button class="remove-task">Remover</button>`);
            }
        });
    });
    
    //4.Carregar tarefas ficticias com AJAX
    $('#load-tasks').click(function(){
        const fakeTasks = [
            'Aprender Jquery',
            'Estilizar pagina com CSS',
            'Estudar AJAX',
            'Trabalhar com plugins'
        ];

        $.each(fakeTasks,function(index, task) {
            $('#task-list').append(
                `<li>\
                    ${task}\
                    <button class="remove-task">Remover</button>\
                </li>`
            );
            updateTaskcount();
        });
    });

    //mostrar apenas tarefas concluidas
    $('#show-done').click(function(){
        $('li').hide(); //esconde todas as tarefas
        $('li.done').show(); //mostra apenas as tarefas concuidas
    });

    //mostrar apenas tarefas pendentes
    $('#show-pending').click(function(){
        $('li').hide(); //esconde todas as tarefas
        $('li:not(.done)').show(); //mostra apenas as pendentes
    });
});
