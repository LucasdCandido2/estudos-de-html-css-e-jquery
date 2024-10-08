function getPagina(pagina) {
    let conteudo = $('#conteudo');
    fetch(pagina)
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao carregar a pagina.');
        }
        return response.text()
    })
    .then(htmlConteudo => {
        conteudo.html(htmlConteudo);
       console.log('Pagina carregada corretamente');

    })
}