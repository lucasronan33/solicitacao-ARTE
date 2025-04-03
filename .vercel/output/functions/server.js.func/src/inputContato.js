const inputCttComercial = document.getElementById('ctt-comercial')


inputCttComercial.addEventListener('input', (e) => {
    let valorInput = inputCttComercial.value
    let tamanhoInput = valorInput.length

    console.log('vInput: ' + valorInput);
    console.log('tInput: ' + tamanhoInput);
    console.log(e);

    if (e.inputType == 'insertText') {
        if (tamanhoInput > 0 && tamanhoInput < 4) {
            inputCttComercial.value = '+55 (' + valorInput
        } else if (tamanhoInput > 6 && tamanhoInput < 10) {
            inputCttComercial.value = valorInput + ') 9 '
        } else if (tamanhoInput > 14 && tamanhoInput < 16) {
            inputCttComercial.value = valorInput + '-'


        }
    } else if (tamanhoInput <= 5) inputCttComercial.value = ''
    else if (tamanhoInput < 11) inputCttComercial.value = valorInput.slice(0, 6)
    else if (tamanhoInput < 16) inputCttComercial.value = valorInput.slice(0, 14)
})


// 01234567891123456789
// +55 (11) 9 9999-9999