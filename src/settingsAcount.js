let senhaInput = document.getElementsByClassName("input-senha");

for (const input of senhaInput) {

    let img = input.querySelector('img')
    let inputSenha = input.querySelector('input')

    img.addEventListener('click', () => {
        if (inputSenha.type == 'password') {
            inputSenha.type = 'text'
            img.src = './img/olho-aberto.png'
            img.alt = 'Ocultar senha'
        } else {
            inputSenha.type = 'password'
            img.src = './img/olho-fechado.png'
            img.alt = 'Mostrar senha'
        }
    })
}
