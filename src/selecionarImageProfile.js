document.addEventListener('DOMContentLoaded', () => {
    const divImageProfile = document.querySelector('.img-camera')
    const profileUser = document.querySelector('.profileUser')

    divImageProfile.addEventListener('click', () => {
        console.log('click')
        const criarInput = document.createElement('input')
        criarInput.type = 'file'
        criarInput.accept = 'image/*'

        criarInput.addEventListener('change', async (event) => {
            const arquivoURL = URL.createObjectURL(event.target.files[0])
            log(arquivoURL)
        })

        criarInput.click()
    })
})

function log(e) {
    console.log(e)
}