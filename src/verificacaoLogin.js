document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita o reload da página

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const mensagemErro = document.getElementById('mensagemErro')

    try {
        const res = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({ email: email.value, senha: senha.value }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        if (res.status === 200) {
            window.location.href = '/paginaInicial'
        } else if (res.status === 400) {
            const data = await res.json();
            mensagemErro.textContent = data.erro || "Erro desconhecido ao tentar fazer login.";
        }
    } catch (err) {
        console.error('Erro na requisição:', err);
        document.getElementById('mensagemErro').textContent = "Erro ao conectar com o servidor.";
    }
    setTimeout(() => {
        mensagemErro.textContent = '';
    }, 5000); // Apaga depois de 5 segundos
});