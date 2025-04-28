document.addEventListener('DOMContentLoaded', () => {
    const divImageProfile = document.querySelector('.img-camera')
    const profileUser = document.querySelector('.profileUser')
    const divBody = document.querySelector('.body')

    divImageProfile.addEventListener('click', () => {
        console.log('click')
        const criarInput = document.createElement('input')
        criarInput.type = 'file'
        criarInput.accept = 'image/*'

        criarInput.addEventListener('change', async (event) => {
            const arquivoURL = URL.createObjectURL(event.target.files[0])

            criarSpan()
        })

        criarInput.click()
    })

    function criarSpan() {
        const divFundoSpan = document.createElement('span')
        divFundoSpan.classList.add('divFundoSpan')
        divFundoSpan.style.height = document.body.scrollHeight + 'px'
        document.body.insertBefore(divFundoSpan, divBody)

        const span = document.createElement('span')
        span.classList.add('spanImageProfile')
        divFundoSpan.appendChild(span)
    }


})




function log(e) {
    console.log(e)
}