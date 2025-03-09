const inputCttComercial = document.getElementById('ctt-comercial')


inputCttComercial.addEventListener('input', (e) => {
    let valorInput = inputCttComercial.value
    let tamanhoInput = valorInput.length

    console.log('vInput: ' + valorInput);
    console.log('tInput: ' + tamanhoInput);
    console.log(e);

    if (e.inputType == 'insertText') {
        inputCttComercial.value = valorInput.replace(/[^0-9]/g, '')

        if (tamanhoInput >= 0 && tamanhoInput <= 4) {

            inputCttComercial.value = '+55 (' + valorInput
        }
    }

})
