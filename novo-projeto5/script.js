function getPagina(btn) {
    // alert("funciona")
    let conteudo = $('#conteudo');
    fetch(btn)
    .then(response => {
        return response.text();
    })
    .then(conteudoHtml => {
        conteudo.html(conteudoHtml)
    })
}