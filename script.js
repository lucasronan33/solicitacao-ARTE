<<<<<<< HEAD
//CHECKBOX MOSTRAR SENHA INPUT
function mostrarSenha() {
  var senhaInput = document.getElementById("senha");
  var trocarImg = document.querySelector('.mostrar-senha')
  if (senhaInput.type === "password") {
    senhaInput.type = "text";
    trocarImg.innerHTML = `<img src="/olho-aberto.png" onclick="ativarChk()" id="fundoChk">`
  } else {
    senhaInput.type = "password";
    trocarImg.innerHTML = `<img src="/olho-fechado.png" onclick="ativarChk()" id="fundoChk">`
  }
};

function ativarChk() {
  mostrarSenha()
}


//DIMENSÕES FORMATADA
document.addEventListener('DOMContentLoaded', function () {

  const inputMedidas = document.querySelectorAll('.dimensions');
  inputMedidas.forEach(function (inputMedidas) {


    let contadorTeclasNumericas = 0; // Inicializa o contador de teclas numericas

    inputMedidas.addEventListener('input', function (event) {
      let valor = inputMedidas.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

      // Limita a quantidade de caracteres numericos a 8
      if (valor.length > 8) {
        valor = valor.slice(0, 9);
      }

      // Adiciona zeros à esquerda até alcançar o formato desejado
      while (valor.length < 9) {
        valor = '0' + valor;
      }

      // Divide o valor em duas partes de 4 dígitos cada
      const parte1 = valor.slice(1, 5);
      const parte2 = valor.slice(5, 9);

      // Formata o valor com a estrutura "00,00 x 00,00m"
      const valorFormatado = `${parte1.slice(0, 2)},${parte1.slice(2)} x ${parte2.slice(0, 2)},${parte2.slice(2)}m`;

      // Atualiza o valor do input
      event.target.value = valorFormatado;

    });

    const apagarNumeros = inputMedidas.addEventListener('keydown', function (event) {
      // Se a tecla pressionada for "Backspace"
      if (event.key === 'Backspace') {
        // Obtém a posição do cursor antes de apagar o caractere
        const posicaoAntes = inputMedidas.selectionStart;

        // Se a posição do cursor estiver após o "m"
        if (posicaoAntes > inputMedidas.value.indexOf('m')) {
          // Move o cursor uma posição para a esquerda
          inputMedidas.setSelectionRange(posicaoAntes - 1, posicaoAntes - 1);
          // Espera um momento antes de apagar o caractere
          setTimeout(() => {
            // Apaga o caractere
            const valor = inputMedidas.value;
            const novoValor = valor.substring(0, posicaoAntes - 1) + valor.substring(posicaoAntes);
            inputMedidas.value = valorFormatado;
          }, 0);
        }
      }
    });

    const limitadorTeclasNumericas = inputMedidas.addEventListener('keydown', function (event) {
      // Se a tecla pressionada for numérica e o limite não for atingido
      if (!isNaN(event.key) && contadorTeclasNumericas < 8) {
        contadorTeclasNumericas++;
      }
      else if (event.key === 'Backspace' && contadorTeclasNumericas > 0) {
        // Se a tecla pressionada for "Backspace" e ainda houver caracteres numéricos inseridos
        contadorTeclasNumericas--;
      }
      else {
        // Impede a inserção de mais caracteres numéricos
        event.preventDefault();
      }
    });
  });
});


// Função para obter a data atual no formato yyyy-mm-dd
function getDataAtualFormatada() {
  var dataAtual = new Date();
  var ano = String(dataAtual.getFullYear()).padStart(1, "0");
  var mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
  var dia = String(dataAtual.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

// Função para definir o atributo min de todos os inputs de data como a data atual
function bloquearDatasAnteriores() {
  var inputsData = document.querySelectorAll('input[type="date"]');
  var dataAtual = getDataAtualFormatada();

  inputsData.forEach(function (input) {
    input.min = dataAtual;
  });
}

// Chama a função ao carregar a página
window.addEventListener("DOMContentLoaded", bloquearDatasAnteriores);

//HABILITAR FORMULARIOS
var seletor = document.querySelectorAll('.habilitar-form')

for (let i = 0; i < seletor.length; i++) {

  seletor[i].addEventListener('click', click)
  const visivel = seletor[i].nextElementSibling

  function click() {

    if (visivel.style.display != 'none') {
      visivel.style.display = 'none'
    } else {
      visivel.style.display = 'block'

    }

  }
=======
//CHECKBOX MOSTRAR SENHA INPUT
function mostrarSenha() {
  var senhaInput = document.getElementById("senha");
  var trocarImg = document.querySelector('.mostrar-senha')
  if (senhaInput.type === "password") {
    senhaInput.type = "text";
    trocarImg.innerHTML = `<img src="/olho-aberto.png" onclick="ativarChk()" id="fundoChk">`
  } else {
    senhaInput.type = "password";
    trocarImg.innerHTML = `<img src="/olho-fechado.png" onclick="ativarChk()" id="fundoChk">`
  }
};

function ativarChk() {
  mostrarSenha()
}


//DIMENSÕES FORMATADA
document.addEventListener('DOMContentLoaded', function () {

  const inputMedidas = document.querySelectorAll('.dimensions');
  inputMedidas.forEach(function (inputMedidas) {


    let contadorTeclasNumericas = 0; // Inicializa o contador de teclas numericas

    inputMedidas.addEventListener('input', function (event) {
      let valor = inputMedidas.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

      // Limita a quantidade de caracteres numericos a 8
      if (valor.length > 8) {
        valor = valor.slice(0, 9);
      }

      // Adiciona zeros à esquerda até alcançar o formato desejado
      while (valor.length < 9) {
        valor = '0' + valor;
      }

      // Divide o valor em duas partes de 4 dígitos cada
      const parte1 = valor.slice(1, 5);
      const parte2 = valor.slice(5, 9);

      // Formata o valor com a estrutura "00,00 x 00,00m"
      const valorFormatado = `${parte1.slice(0, 2)},${parte1.slice(2)} x ${parte2.slice(0, 2)},${parte2.slice(2)}m`;

      // Atualiza o valor do input
      event.target.value = valorFormatado;

    });

    const apagarNumeros = inputMedidas.addEventListener('keydown', function (event) {
      // Se a tecla pressionada for "Backspace"
      if (event.key === 'Backspace') {
        // Obtém a posição do cursor antes de apagar o caractere
        const posicaoAntes = inputMedidas.selectionStart;

        // Se a posição do cursor estiver após o "m"
        if (posicaoAntes > inputMedidas.value.indexOf('m')) {
          // Move o cursor uma posição para a esquerda
          inputMedidas.setSelectionRange(posicaoAntes - 1, posicaoAntes - 1);
          // Espera um momento antes de apagar o caractere
          setTimeout(() => {
            // Apaga o caractere
            const valor = inputMedidas.value;
            const novoValor = valor.substring(0, posicaoAntes - 1) + valor.substring(posicaoAntes);
            inputMedidas.value = valorFormatado;
          }, 0);
        }
      }
    });

    const limitadorTeclasNumericas = inputMedidas.addEventListener('keydown', function (event) {
      // Se a tecla pressionada for numérica e o limite não for atingido
      if (!isNaN(event.key) && contadorTeclasNumericas < 8) {
        contadorTeclasNumericas++;
      }
      else if (event.key === 'Backspace' && contadorTeclasNumericas > 0) {
        // Se a tecla pressionada for "Backspace" e ainda houver caracteres numéricos inseridos
        contadorTeclasNumericas--;
      }
      else {
        // Impede a inserção de mais caracteres numéricos
        event.preventDefault();
      }
    });
  });
});


// Função para obter a data atual no formato yyyy-mm-dd
function getDataAtualFormatada() {
  var dataAtual = new Date();
  var ano = String(dataAtual.getFullYear()).padStart(1, "0");
  var mes = String(dataAtual.getMonth() + 1).padStart(2, "0");
  var dia = String(dataAtual.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

// Função para definir o atributo min de todos os inputs de data como a data atual
function bloquearDatasAnteriores() {
  var inputsData = document.querySelectorAll('input[type="date"]');
  var dataAtual = getDataAtualFormatada();

  inputsData.forEach(function (input) {
    input.min = dataAtual;
  });
}

// Chama a função ao carregar a página
window.addEventListener("DOMContentLoaded", bloquearDatasAnteriores);

//HABILITAR FORMULARIOS
var seletor = document.querySelectorAll('.habilitar-form')

for (let i = 0; i < seletor.length; i++) {

  seletor[i].addEventListener('click', click)
  const visivel = seletor[i].nextElementSibling

  function click() {

    if (visivel.style.display != 'none') {
      visivel.style.display = 'none'
    } else {
      visivel.style.display = 'block'

    }

  }
>>>>>>> 9f511c5 (deploy solicitacao-ARTE)
}