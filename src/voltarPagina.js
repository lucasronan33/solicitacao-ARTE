document.addEventListener('DOMContentLoaded', async () => {
    console.log('pagina carregada')

    if (localStorage.getItem())

        const btnVoltar = document.querySelector('#btn-voltar');
    const url = window.location.href;

    btnVoltar.addEventListener('click', criarJSON)

    function criarJSON() {
        let jsonURL = JSON.stringify({
            voltar: true,
            url: url
        })
        localStorage.setItem('JSONvoltar', jsonURL)
        console.log('JSON criado: ', jsonURL)
    }
})