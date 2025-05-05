document.addEventListener('DOMContentLoaded', () => {
    const divImageProfile = document.querySelector('.img-camera')
    const profileUser = document.querySelector('.profileUser')
    const divBody = document.querySelector('.body')

    divImageProfile.addEventListener('click', () => {

        criarSpan()

        // const criarInput = document.createElement('input')
        // criarInput.type = 'file'
        // criarInput.accept = 'image/*'

        // criarInput.addEventListener('change', async (event) => {
        //     const arquivoURL = URL.createObjectURL(event.target.files[0])
        // })

        // criarInput.click()
    })

    function criarSpan() {
        const divFundoSpan = document.createElement('span')
        divFundoSpan.style.height = document.body.scrollHeight + 'px'
        document.body.insertBefore(divFundoSpan, divBody)

        const span = document.createElement('span')
        const container = document.createElement('div')
        const imageProfile = document.createElement('div')
        const divButtons = document.createElement('div')
        const btnSave = document.createElement('button')
        const btnCancel = document.createElement('button')

        divFundoSpan.classList.add('divFundoSpan')
        span.classList.add('spanImageProfile')
        container.id = 'container'
        imageProfile.classList.add('divImageProfile')
        divButtons.className = 'buttons'
        btnSave.classList.add('buttons');
        btnCancel.classList.add('buttons');
        btnCancel.id = 'btnCancel'

        btnSave.innerText = 'Salvar'
        btnCancel.innerText = 'Cancelar'

        divFundoSpan.appendChild(span)
        span.appendChild(container)
        container.append(imageProfile, divButtons)
        divButtons.append(btnSave, btnCancel)


        divFundoSpan.addEventListener('click', (event) => {
            if (event.target === divFundoSpan) {
                divFundoSpan.remove()
            }
        })
    }


})

function log(e) {
    console.log(e)
}