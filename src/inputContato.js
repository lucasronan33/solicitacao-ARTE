document.addEventListener('DOMContentLoaded', () => {

    const inputCttComercial = document.getElementById('ctt-comercial')


    inputCttComercial.addEventListener('input', (event) => {

        let valorInput = inputCttComercial.value
        let valor = inputCttComercial.value.replace(/\D/g, '');

        let valorSalvo

        console.log(valorInput.length);
        console.log(valorInput);
        if (valorInput.length >= 0 && valorInput.length <= 4) {
            console.log(inputCttComercial.value);
            console.log(inputCttComercial);

            inputCttComercial.value = '+55 (' + valorInput
        }
        if (valorInput.length >= 7 && valorInput.length <= 11) {
            inputCttComercial.value = valorInput + ') 9 '
        }
        if (valorInput.length >= 15 && valorInput.length <= 15) {
            inputCttComercial.value = valorInput + '-'
        }

        console.log('valorInput', valorInput);

    })
})