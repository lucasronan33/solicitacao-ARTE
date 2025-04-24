document.addEventListener('DOMContentLoaded', () => {
    console.log('pagina carregada')

    let JSONvoltar = JSON.parse(localStorage.getItem('JSONurl'))

    const btnVoltar = document.querySelector('#btn-voltar');
    const url = window.location.href;

    btnVoltar.addEventListener('click', function () {
        if (!JSONvoltar) {
            criarJSON()
        }
        window.location.href = JSONvoltar.url
    })

    function criarJSON() {
        let jsonURL = JSON.stringify({
            url: url
        })
        localStorage.setItem('JSONurl', jsonURL)
        console.log('JSON criado: ', jsonURL)
    }
})