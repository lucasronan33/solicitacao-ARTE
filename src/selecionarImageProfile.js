document.addEventListener('DOMContentLoaded', () => {
    const divImageProfile = document.querySelector('.img-camera')
    const profileUser = document.querySelector('.profileUser')
    const divBody = document.querySelector('.body')

    divImageProfile.addEventListener('click', () => {

        criarSpan()

        const divCamera = document.querySelector('.img-camera')
        const imageProfile = document.querySelector('.imgProfile')

        divCamera.addEventListener('click', () => {
            const criarInput = document.createElement('input')
            criarInput.type = 'file'
            criarInput.accept = 'image/*'

            criarInput.addEventListener('change', async (event) => {
                const arquivoURL = event.target.files[0]
                if (!arquivoURL) return
                imageProfile.style.backgroundImage = `url(${URL.createObjectURL(arquivoURL)})`
                const base64 = await blobToBase64(arquivoURL)

                document.querySelector('input[name="profileImage"]').value = base64
            })

            criarInput.click()
        })
    })

    function blobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    }

    function criarSpan() {
        const divFundoSpan = document.createElement('span')
        divFundoSpan.style.height = document.body.scrollHeight + 'px'
        document.body.insertBefore(divFundoSpan, divBody)

        const span = document.createElement('span')
        const container = document.createElement('div')
        const divImageProfile = document.createElement('div')
        const divCamera = document.createElement('div')
        const imageProfile = document.createElement('div')
        const divButtons = document.createElement('div')
        const btnSave = document.createElement('button')
        const btnCancel = document.createElement('button')

        divFundoSpan.classList.add('divFundoSpan')
        span.classList.add('spanImageProfile')
        container.id = 'container'
        divImageProfile.classList.add('divImageProfile')
        divCamera.classList.add('img-camera')
        imageProfile.classList.add('imgProfile')
        divButtons.className = 'buttons'
        btnSave.classList.add('btnButtons');
        btnCancel.classList.add('btnButtons');
        btnSave.id = 'btnSave'
        btnCancel.id = 'btnCancel'

        btnSave.innerText = 'Salvar'
        btnCancel.innerText = 'Cancelar'

        divFundoSpan.appendChild(span)
        span.appendChild(container)
        container.append(divImageProfile, divButtons)
        divImageProfile.append(divCamera, imageProfile)
        divButtons.append(btnSave, btnCancel)

        btnSave.addEventListener('click', () => {
            profileUser.style.backgroundImage = document.querySelector('.imgProfile').style.backgroundImage
            document.querySelector('.divFundoSpan').remove()
        })

        divFundoSpan.addEventListener('click', (event) => {
            if (event.target === divFundoSpan || event.target === btnCancel) {
                divFundoSpan.remove()
            }
        })
    }




})

function log(e) {
    console.log(e)
}