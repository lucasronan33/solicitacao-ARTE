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


fetch('/getUserData')
    .then(response => response.json())
    .then(data => {
        data.nome && (document.getElementById('nome').value = data.nome);
        data.email && (document.getElementById('email').value = data.email);
        data.cargo && (document.getElementById('cargo').value = data.cargo);
        data.sexo && data.sexo == 'F' && (document.getElementById('feminino').checked = true);
        data.sexo && data.sexo == 'M' && (document.getElementById('masculino').checked = true);
        data.wppcomercial && (document.getElementById('ctt-comercial').value = data.wppcomercial);
        // preencher outros campos conforme necessário
    })
    .catch(error => console.error('Erro ao preencher o formulário:', error));
