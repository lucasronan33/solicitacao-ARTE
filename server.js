require('dotenv').config();// Carregar variáveis de ambiente
const fs = require('fs');
const connectionString = process.env.DATABASE_URL;
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
// const Database = require('better-sqlite3');
const app = express();
const port = 3000;
const { Dropbox } = require("dropbox");
const { neon } = require("@neondatabase/serverless");
const e = require('express');
const { log } = require('console');
const sql = neon(connectionString);
const pgSession = require('connect-pg-simple')(session);

// Teste de conexão com Banco de Dados
if (!connectionString) {
    throw new Error("⚠ ERRO: A variável DATABASE_URL não foi definida no .env");
}

(async () => {
    try {
        await sql`SELECT 1`;
        console.log("✅ Conectado ao banco de dados!");
    } catch (error) {
        console.error("❌ Erro na conexão com o banco:", error);
    }
})();

// Primeiro configurar sessão
app.use(session({
    store: new pgSession({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true
    }),
    secret: 'seu-segredo',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

// Definir rotas ANTES dos middlewares static
console.log('views: ', path.join(__dirname));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname))


app.get('/', (req, res) => {
    if (req.session && req.session.usuario) {
        return res.redirect('/paginaInicial');
    }
    return res.redirect('/login');
});

app.get('/login', (req, res) => {
    if (req.session && req.session.usuario) {
        return res.redirect('/paginaInicial');
    }
    req.session.erro = null;
    res.render('index', { erro: null });
});

// DEPOIS das rotas, configurar os middlewares static
app.use(express.static(__dirname));
app.use('/favicon', express.static(path.join(__dirname, './img/logo Showmais (roxo).png')));
app.use('/img', express.static(path.join(__dirname, './img/')));
app.use('/fonts', express.static(path.join(__dirname, './fonts')));
app.use('/src', express.static(path.join(__dirname, './src')));
console.log(__dirname);


// Middleware para servir arquivos CSS
app.get('/style', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, './src/css/style.css'));
});
app.get('/style-login', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, './src/css/style-login.css'));
});
app.get('/style-index', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, './src/css/style-index.css'));
});
app.get('/style-erroSendMail', (req, res) => {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, './src/css/style-erroSendMail.css'));
});

// Middleware para analisar solicitações JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Middleware para salvar uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '../uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     }
// });

// const upload = multer({ dest: '../uploads/' });

//-----TESTE COM DROPBOX-----
const dbx = new Dropbox({
    accessToken: process.env.DROPBOX_ACCESS_TOKEN
});

// Teste de conexão com Dropbox
// (async () => {
//     try {
//         const response = await dbx.usersGetCurrentAccount();
//         console.log("✅ Conectado ao Dropbox!");
//     } catch (error) {
//         console.error("❌ Erro na conexão com o Dropbox:", error);
//         if (error.status === 401) {
//             console.error("⚠ Token de acesso inválido ou expirado");
//         }
//     }
// })();

// const storage = multer.memoryStorage(); // Armazena arquivos na memória antes do envio
// const upload = multer({ storage });

// app.post("/upload", upload.single("file"), async (req, res) => {
//     try {
//         // const bufferStream = new stream.PassThrough();
//         // bufferStream.end(req.file.buffer);

//         await dbx.filesUpload({
//             path: `/${req.file.originalname}`,
//             contents: req.file.buffer,
//         });

//         res.status(200).send("Arquivo enviado com sucesso!");
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });
// const response = await dbx.filesDownload({ path: `/${req.file.originalname}` });
// const downloadedBuffer = response.result.fileBinary;

// fs.writeFileSync(`./teste-${req.file.originalname}`, downloadedBuffer);

// Criar tabela de usuários se não existir
const criarTabelaUsuario = async () => {
    await sql`
        CREATE TABLE IF NOT EXISTS usuario (
            nome VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            senha VARCHAR(255) NOT NULL
        );
    `;
};
criarTabelaUsuario();

// Rota para processar o formulário de login
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;

    try {
        // Consulta SQL para verificar se o usuário existe no banco de dados
        const user = await consultaDB('email', `email = '${email}'`);
        const pass = await consultaDB('senha', `senha = '${senha}'`);

        console.log('user: ', user, 'pass: ', pass);
        console.log('user.lenght: ', user.length, '   pass.lenght: ', pass.length);
        const result = await sql`
            SELECT * FROM usuario WHERE email = ${email} AND senha = ${senha};
        `;
        console.log("result.length: ", result.length);
        console.log("Resultado da consulta:", result);

        if (result.length <= 0 && (user.length <= 0 && pass.length <= 0)) {
            throw new Error("Usuário não encontrado!");
        } else if (result.length <= 0 && (user || pass).length > 0) {
            throw new Error("Usuário ou senha incorreto!");
        } else if (result.length > 0) {
            // Usuário autenticado com sucesso
            req.session.name = result[0].nome;

            // Salvar usuário na sessão
            req.session.usuario = {
                email: result[0].email,
                senha: result[0].senha
            }
            req.session.userID = result[0].id
            log("req.session.userID: ", req.session.userID);

            req.session.save(err => {
                if (err) {
                    console.error('❌ Erro ao salvar sessão:', err);
                    throw new Error("Erro ao salvar sessão!");
                }

                console.log('✅ Sessão salva com sucesso');
                res.redirect('/paginaInicial');
            });
        } else {
            throw new Error("Erro interno do servidor");
        }
    } catch (err) {
        console.log('Erro ao autenticar usuário: ', err);
        res.status(400).render('index', { erro: err.message }); // Redireciona para a página de erro com o erro({ erro: err.message });
    }
});
app.get('/erroLogin', (req, res) => {
    const erro = req.query.er;
    res.json({ erro: erro });
})

// Função para verificar se o usuário está autenticado
// Middleware para verificar se o usuário está autenticado
const verificarAutenticacao = (req, res, next) => {
    if (req.session && req.session.usuario) {
        return next();
    }
    res.redirect('/login');
};

// Rota para exibir a página de cadastro HTML
// app.get('/cadastro', (req, res) => {
//     res.sendFile(path.join(__dirname, './cadastro.html'));
// });

// Rota para exibir a página de cadastro EJS
app.get('/cadastro', (req, res) => {
    res.render('cadastro', { erro: null })
});

// Rota para processar o formulário de cadastro
app.post('/cadastro', async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        // Consulta SQL para inserir um novo usuário no banco de dados
        const inserirUsuario = await sql`
            INSERT INTO usuario (nome, email, senha)
            VALUES (${nome}, ${email}, ${senha});
        `;

        console.log(`Usuário registrado: ${nome}, ${email}, ${senha}`);
        res.redirect('/login');
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        res.status(400).render('cadsatro', { erro: 'Erro ao cadastrar usuário: ' + err.message });
    }
});


// Rota para exibir a página inicial, protegida pelo middleware de autenticação
app.get('/paginaInicial', verificarAutenticacao, (req, res) => {
    res.render('paginaInicial', { nomeUsuario: req.session.name })
    console.log('entrando em /paginaInicial');

});

// Função para consultar o banco de dados
async function consultaDB(e, condicional) {

    return await sql(`SELECT ${e} FROM usuario WHERE ${condicional}`);

}
// ----------------------------------------------

app.get('/useraccountSettings', verificarAutenticacao, async (req, res) => {
    try {
        const consulta = await consultaDB('*', `email = '${req.session.usuario.email}'`);
        log('consulta: ', consulta)
        res.json(consulta)
    } catch (error) {
        res.redirect(`/erroSettings?er=${encodeURI(error.message)}`);
    }
})

app.get('/getUserData', verificarAutenticacao, async (req, res) => {
    try {
        const response = await consultaDB('nome, email, cargo, sexo, wppcomercial', `email = '${req.session.usuario.email}'`);
        // log('response: ', response)
        if (!response || response.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        // 🔹 Pega o primeiro resultado da consulta
        let userData = response[0];

        // 🔹 Filtra os campos vazios ou null
        let filteredData = Object.fromEntries(
            Object.entries(userData).filter(([_, value]) => value !== null && value !== "")
        );

        res.json(filteredData); // Retorna apenas os dados preenchidos
    } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        res.status(500).send('Erro ao buscar dados do usuário');
    }
});

app.get('/accountSettings', verificarAutenticacao, (req, res) => {
    res.render('accountSettings', { savedSettings: null, erro: null })
})
app.post('/accountSettings', verificarAutenticacao, async (req, res) => {
    try {
        const tableName = 'usuario';
        const columnValues = req.body;
        const condition = `id = ${req.session.userID}`;

        const valoresFiltrados = Object.values(columnValues).filter(value => value.trim() !== '');
        log('valoresFiltrados: ', valoresFiltrados)

        if (Object.values(valoresFiltrados).length > 0) {
            const setClause = Object.keys(columnValues)
                .filter(key => columnValues[key].trim() !== '')
                .map((key, index) => `${key} = $${index + 1}`)
                .join(', ');

            const values = Object.keys(columnValues)
                .filter(key => columnValues[key].trim() !== '')
                .map(key => columnValues[key]);

            log('chaves: ', values)
            log('valores: ', setClause)

            const query = `UPDATE ${tableName} SET ${setClause} WHERE ${condition}`;

            if (setClause.includes('nome')) {
                log('nome sessao: ', req.session.name)
                log('nome: ', columnValues['nome'])
                req.session.name = columnValues['nome'];
                log('nome: ', req.session.name)
            }
            log('query: ', query)
            try {
                // throw new Error("Erro ao salvar sessão!");
                const resposta = await sql(query, values);
                console.log('Linha atualizada, redirecionando \n /accountSettings');
                console.log('Row updated:', resposta);

                res.render('accountSettings', { savedSettings: 'Configurações salvas com sucesso!', erro: null });
            } catch (erro) {
                console.error('Error updating row:', erro);
                if (erro.detail.includes('already exists')) {
                    log('erroDetalhe: ', erro.detail)
                    res.status(400).render('accountSettings', { erro: 'Esse email já está sendo utilizado, escolha outro!' });
                } else {
                    res.status(400).render('accountSettings', { erro: erro.message });
                }
            }
        }

    } catch (error) {
        console.log(error);
        res.status(400).render('accountSettings', { erro: erro.message });
    }
})

app.get('/erroSettings', verificarAutenticacao, (req, res) => {
    const msgErro = req.query.er || "Erro desconhecido"
    res.json({ erro: msgErro })
})


// Rota para exibir a página inicial, protegida pelo middleware de autenticação
app.get('/orcamento', verificarAutenticacao, (req, res) => {
    res.render('orcamento', { usuario: req.session.name })
});
app.get('/artefinal', verificarAutenticacao, (req, res) => {
    res.render('arteFinal', { usuario: req.session.name });
});
// app.get('/impr-adesivo', verificarAutenticacao, (req, res) => {
//     res.sendFile(path.join(__dirname, 'impr-adesivo.html'));
// });
// app.get('/impr-lona', verificarAutenticacao, (req, res) => {
//     res.sendFile(path.join(__dirname, 'impr-lona.html'));
// });

// Configure o multer para armazenar em memória em vez do disco
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024 // limite de 10MB por arquivo
    }
});

// Rota para lidar com o envio de e-mails
app.post('/send-email', verificarAutenticacao, upload.array('attachment'), async (req, res) => {
    try {
        const usuario = req.session.usuario;
        // Atualizar as configurações de SMTP com as credenciais fornecidas no formulário de envio de e-mails
        const smtpConfig = {
            host: 'smtp.emailemnuvem.com.br',
            port: 465,
            secure: true,
            auth: {
                user: usuario.email,
                pass: usuario.senha
            }
        };
        // Iterar sobre os arquivos recebidos
        req.files.forEach((file, index) => {
            console.log(`Anexo ${index + 1}: ${file.originalname}`);
        });

        // Exibindo os dados e o anexo no console do servidor
        console.log('Dados do formulário:', req.body);
        console.log('Anexos:', req.files);
        const attachments = req.files ? req.files.map(file => ({
            filename: file.originalname,
            content: file.buffer
        })) : [];
        // Coletando dados do formulário 0
        const {
            to,
            subject,
            arquivolinks,
            //UV
            cliente,
            ideiaproduto,
            tipoimpressao,
            dimensions,
            dataEntrega,
            dataFinal,
            material,
            quantity,
            printType,
            cores,
            calco,
            cut,
            acabamento,
            acabamentoset,
            //ADESIVO
            sangra,
            lamination,
            mascara,
            //LONA
            solda,
            //ORÇAMENTO
            terceiroServico,
            embalagem,
            frete,
            additionalInfo
        } = req.body;
        // Coletando dados do formulário 1
        const {
            //UV 
            ideiaproduto1,
            tipoimpressao1,
            dimensions1,
            dataEntrega1,
            dataFinal1,
            material1,
            quantity1,
            printType1,
            cores1,
            calco1,
            cut1,
            acabamento1,
            acabamentoset1,
            //ADESIVO
            sangra1,
            lamination1,
            mascara1,
            //LONA
            solda1,
            //ORÇAMENTO
            terceiroServico1,
            embalagem1,
            frete1,
            additionalInfo1,
            habilitarForm1
        } = req.body;
        const {
            //UV 
            ideiaproduto2,
            tipoimpressao2,
            dimensions2,
            dataEntrega2,
            dataFinal2,
            material2,
            quantity2,
            printType2,
            cores2,
            calco2,
            cut2,
            acabamento2,
            acabamentoset2,
            //ADESIVO
            sangra2,
            lamination2,
            mascara2,
            //LONA
            solda2,
            //ORÇAMENTO
            terceiroServico2,
            embalagem2,
            frete2,
            additionalInfo2,
            habilitarForm2
        } = req.body;
        const {
            //UV 
            ideiaproduto3,
            tipoimpressao3,
            dimensions3,
            dataEntrega3,
            dataFinal3,
            material3,
            quantity3,
            printType3,
            cores3,
            calco3,
            cut3,
            acabamento3,
            acabamentoset3,
            //ADESIVO
            sangra3,
            lamination3,
            mascara3,
            //LONA
            solda3,
            //ORÇAMENTO
            terceiroServico3,
            embalagem3,
            frete3,
            additionalInfo3,
            habilitarForm3
        } = req.body;

        const {
            //UV 
            ideiaproduto4,
            tipoimpressao4,
            dimensions4,
            dataEntrega4,
            dataFinal4,
            material4,
            quantity4,
            printType4,
            cores4,
            calco4,
            cut4,
            acabamento4,
            acabamentoset4,
            //ADESIVO
            sangra4,
            lamination4,
            mascara4,
            //LONA
            solda4,
            //ORÇAMENTO
            terceiroServico4,
            embalagem4,
            frete4,
            additionalInfo4,
            habilitarForm4
        } = req.body;

        const {
            //UV 
            ideiaproduto5,
            tipoimpressao5,
            dimensions5,
            dataEntrega5,
            dataFinal5,
            material5,
            quantity5,
            printType5,
            cores5,
            calco5,
            cut5,
            acabamento5,
            acabamentoset5,
            //ADESIVO
            sangra5,
            lamination5,
            mascara5,
            //LONA
            solda5,
            //ORÇAMENTO
            terceiroServico5,
            embalagem5,
            frete5,
            additionalInfo5,
            habilitarForm5
        } = req.body;


        // Acesse o arquivo enviado através de req.file

        // Construindo o corpo do e-mail
        let message = `
            <!DOCTYPE html>
            <html>
                <body>
                    <h1> Dados para Finalização </h1>
                    <ul>
        `;
        let message1 = '';
        let message2 = '';
        let message3 = '';
        let message4 = '';
        let message5 = '';

        message += `
        <h1> ${tipoimpressao}</h1>
        <h2> Arquivo 1</h2>
        <ul>
        `;
        const addItemToList = (label, value) => {
            if (value) {
                message += `<li><strong>${label}: </strong>${value}</li>`;
            }
        };
        // Adicionando os campos preenchidos à mensagem
        //FORMULARIO 0
        //UV
        addItemToList('Links de Arquivos', arquivolinks);
        addItemToList('Ideia do produto', ideiaproduto);
        addItemToList('Tipo de Impressão', tipoimpressao)

        // data-entrega 1
        let dataentrega = new Date(dataEntrega);
        dataentrega.setDate(dataentrega.getDate() + 1);
        let dataentregaformatada = dataentrega.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
        addItemToList('Data de entrega', dataentregaformatada);

        // data-final 1
        let datafinal = new Date(dataFinal);
        datafinal.setDate(datafinal.getDate() + 1);
        let datafinalformatada = datafinal.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
        addItemToList('Data de finalização', datafinalformatada);

        addItemToList('Material', material);
        addItemToList('Dimensão Final (L x A)', dimensions);
        addItemToList('Quantidade', quantity);
        addItemToList('Impressão', printType);
        addItemToList('Cores', cores);
        addItemToList('Calço', calco);
        addItemToList('Corte', cut);
        addItemToList('Acabamento (setor)', acabamentoset);
        addItemToList('Acabamento (material)', acabamento);
        //ADESIVO
        addItemToList('Sangra (L x A)', sangra);
        addItemToList('Laminação', lamination);
        addItemToList('Máscara', mascara);
        //LONA
        addItemToList('Solda', solda);
        //ORÇAMENTO
        addItemToList('Prestação de Serviço', terceiroServico);
        addItemToList('Embalagem', embalagem);
        addItemToList('Frete', frete);
        addItemToList('Informações Adicionais', additionalInfo);

        message += `
                    </ul>
        `;

        if (req.body.habilitarForm1 === 'true') {
            message1 = `
            <h1> ${tipoimpressao1} </h1>
                    <h2> Arquivo 2 </h2>
                    <ul>
        `;
        }
        const addItemToList1 = (label, value, visible) => {
            if (value) {
                message1 += `<li><strong>${label}: </strong>${value}</li>`;
            }
        };

        //Formulário 1
        //UV1
        if (req.body.habilitarForm1 === 'true') {
            // data-final 2

            addItemToList1('Ideia do produto', ideiaproduto1);
            addItemToList1('Tipo de Impressão', tipoimpressao1);

            // data-entrega 2
            let dataentrega1 = new Date(dataEntrega1);
            dataentrega1.setDate(dataentrega1.getDate() + 1);
            let dataentregaformatada1 = dataentrega1.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
            addItemToList1('Data de entrega', dataentregaformatada1);

            let datafinal1 = new Date(dataFinal1);
            datafinal1.setDate(datafinal1.getDate() + 1);
            let datafinalformatada1 = datafinal1.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
            addItemToList1('Data de finalização', datafinalformatada1);

            addItemToList1('Material', material1);
            addItemToList1('Dimensão Final (L x A)', dimensions1);
            addItemToList1('Quantidade', quantity1);
            addItemToList1('Impressão', printType1);
            addItemToList1('Cores', cores1);
            addItemToList1('Calço', calco1);
            addItemToList1('Corte', cut1);
            addItemToList1('Acabamento (setor)', acabamentoset1);
            addItemToList1('Acabamento (material)', acabamento1);
            //ADESIVO1
            addItemToList1('Sangra (L x A)', sangra1,);
            addItemToList1('Laminação', lamination1);
            addItemToList1('Máscara', mascara1);
            //LONA1
            addItemToList1('Solda', solda1);
            //ORÇAMENTO
            addItemToList1('Prestação de Serviço', terceiroServico1);
            addItemToList1('Embalagem', embalagem1);
            addItemToList1('Frete', frete1);
            addItemToList1('Informações Adicionais', additionalInfo1);
        }
        message1 += `
                    </ul>
        `;

        if (req.body.habilitarForm2 === 'true') {
            message2 = `
    <h1> ${tipoimpressao2} </h1>
            <h2> Arquivo 3 </h2>
            <ul>
    `;
        }

        const addItemToList2 = (label, value, visible) => {
            if (value) {
                message2 += `<li><strong>${label}: </strong>${value}</li>`;
            }
        };

        //Formulário 2
        //UV2
        if (req.body.habilitarForm2 === 'true') {
            // data-final 2

            addItemToList2('Ideia do produto', ideiaproduto2);
            addItemToList2('Tipo de Impressão', tipoimpressao2);

            // data-entrega 2
            let dataentrega2 = new Date(dataEntrega2);
            dataentrega2.setDate(dataentrega2.getDate() + 1);
            let dataentregaformatada2 = dataentrega2.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
            addItemToList2('Data de entrega', dataentregaformatada2);

            let datafinal2 = new Date(dataFinal2);
            datafinal2.setDate(datafinal2.getDate() + 1);
            let datafinalformatada2 = datafinal2.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
            addItemToList2('Data de finalização', datafinalformatada2);

            addItemToList2('Material', material2);
            addItemToList2('Dimensão Final (L x A)', dimensions2);
            addItemToList2('Quantidade', quantity2);
            addItemToList2('Impressão', printType2);
            addItemToList2('Cores', cores2);
            addItemToList2('Calço', calco2);
            addItemToList2('Corte', cut2);
            addItemToList2('Acabamento (setor)', acabamentoset2);
            addItemToList2('Acabamento (material)', acabamento2);
            //ADESIVO2
            addItemToList2('Sangra (L x A)', sangra2,);
            addItemToList2('Laminação', lamination2);
            addItemToList2('Máscara', mascara2);
            //LONA2
            addItemToList2('Solda', solda2);
            //ORÇAMENTO
            addItemToList2('Prestação de Serviço', terceiroServico2);
            addItemToList2('Embalagem', embalagem2);
            addItemToList2('Frete', frete2);
            addItemToList2('Informações Adicionais', additionalInfo2);
        }
        message2 += `
            </ul>
`;

        if (req.body.habilitarForm3 === 'true') {
            message3 = `
    <h1> ${tipoimpressao3} </h1>
            <h2> Arquivo 4 </h2>
            <ul>
    `;
        }

        const addItemToList3 = (label, value, visible) => {
            if (value) {
                message3 += `<li><strong>${label}: </strong>${value}</li>`;
            }
        };

        //Formulário 3
        //UV3
        if (req.body.habilitarForm3 === 'true') {
            // data-final 3

            addItemToList3('Ideia do produto', ideiaproduto3);
            addItemToList3('Tipo de Impressão', tipoimpressao3);

            // data-entrega 1
            let dataentrega3 = new Date(dataEntrega3);
            dataentrega3.setDate(dataentrega3.getDate() + 1);
            let dataentregaformatada3 = dataentrega3.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
            addItemToList3('Data de entrega', dataentregaformatada3);

            let datafinal3 = new Date(dataFinal3);
            datafinal3.setDate(datafinal3.getDate() + 1);
            let datafinalformatada3 = datafinal3.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
            addItemToList3('Data de finalização', datafinalformatada3);

            addItemToList3('Material', material3);
            addItemToList3('Dimensão Final (L x A)', dimensions3);
            addItemToList3('Quantidade', quantity3);
            addItemToList3('Impressão', printType3);
            addItemToList3('Cores', cores3);
            addItemToList3('Calço', calco3);
            addItemToList3('Corte', cut3);
            addItemToList3('Acabamento (setor)', acabamentoset3);
            addItemToList3('Acabamento (material)', acabamento3);
            //ADESIVO3
            addItemToList3('Sangra (L x A)', sangra3,);
            addItemToList3('Laminação', lamination3);
            addItemToList3('Máscara', mascara3);
            //LONA3
            addItemToList3('Solda', solda3);
            //ORÇAMENTO
            addItemToList3('Prestação de Serviço', terceiroServico3);
            addItemToList3('Embalagem', embalagem3);
            addItemToList3('Frete', frete3);
            addItemToList3('Informações Adicionais', additionalInfo3);
        }
        message3 += `
            </ul>
`;

        if (req.body.habilitarForm4 === 'true') {
            message4 = `
    <h1> ${tipoimpressao4} </h1>
            <h2> Arquivo 5 </h2>
            <ul>
    `;
        }

        const addItemToList4 = (label, value, visible) => {
            if (value) {
                message4 += `<li><strong>${label}: </strong>${value}</li>`;
            }
        };

        //Formulário 4
        //UV4
        if (req.body.habilitarForm4 === 'true') {
            // data-final 4

            addItemToList4('Ideia do produto', ideiaproduto4);
            addItemToList4('Tipo de Impressão', tipoimpressao4);

            // data-entrega 4
            let dataentrega4 = new Date(dataEntrega4);
            dataentrega4.setDate(dataentrega4.getDate() + 1);
            let dataentregaformatada4 = dataentrega4.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
            addItemToList4('Data de entrega', dataentregaformatada4);

            let datafinal4 = new Date(dataFinal4);
            datafinal4.setDate(datafinal4.getDate() + 1);
            let datafinalformatada4 = datafinal4.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
            addItemToList4('Data de finalização', datafinalformatada4);

            addItemToList4('Material', material4);
            addItemToList4('Dimensão Final (L x A)', dimensions4);
            addItemToList4('Quantidade', quantity4);
            addItemToList4('Impressão', printType4);
            addItemToList4('Cores', cores4);
            addItemToList4('Calço', calco4);
            addItemToList4('Corte', cut4);
            addItemToList4('Acabamento (setor)', acabamentoset4);
            addItemToList4('Acabamento (material)', acabamento4);
            //ADESIVO4
            addItemToList4('Sangra (L x A)', sangra4,);
            addItemToList4('Laminação', lamination4);
            addItemToList4('Máscara', mascara4);
            //LONA4
            addItemToList4('Solda', solda4);
            //ORÇAMENTO
            addItemToList4('Prestação de Serviço', terceiroServico4);
            addItemToList4('Embalagem', embalagem4);
            addItemToList4('Frete', frete4);
            addItemToList4('Informações Adicionais', additionalInfo4);
        }
        message4 += `
            </ul>
`;

        if (req.body.habilitarForm5 === 'true') {
            message5 = `
    <h1> ${tipoimpressao5} </h1>
            <h2> Arquivo 6 </h2>
            <ul>
    `;
        }

        const addItemToList5 = (label, value, visible) => {
            if (value) {
                message5 += `<li><strong>${label}: </strong>${value}</li>`;
            }
        };

        //Formulário 5
        //UV5
        if (req.body.habilitarForm5 === 'true') {
            // data-final 5

            addItemToList5('Ideia do produto', ideiaproduto5);
            addItemToList5('Tipo de Impressão', tipoimpressao5);

            // data-entrega 5
            let dataentrega5 = new Date(dataEntrega5);
            dataentrega5.setDate(dataentrega5.getDate() + 1);
            let dataentregaformatada5 = dataentrega5.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
            addItemToList5('Data de entrega', dataentregaformatada5);

            let datafinal5 = new Date(dataFinal5);
            datafinal5.setDate(datafinal5.getDate() + 1);
            let datafinalformatada5 = datafinal5.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });
            addItemToList5('Data de finalização', datafinalformatada5);

            addItemToList5('Material', material5);
            addItemToList5('Dimensão Final (L x A)', dimensions5);
            addItemToList5('Quantidade', quantity5);
            addItemToList5('Impressão', printType5);
            addItemToList5('Cores', cores5);
            addItemToList5('Calço', calco5);
            addItemToList5('Corte', cut5);
            addItemToList5('Acabamento (setor)', acabamentoset5);
            addItemToList5('Acabamento (material)', acabamento5);
            //ADESIVO5
            addItemToList5('Sangra (L x A)', sangra5,);
            addItemToList5('Laminação', lamination5);
            addItemToList5('Máscara', mascara5);
            //LONA5
            addItemToList5('Solda', solda5);
            //ORÇAMENTO
            addItemToList5('Prestação de Serviço', terceiroServico5);
            addItemToList5('Embalagem', embalagem5);
            addItemToList5('Frete', frete5);
            addItemToList5('Informações Adicionais', additionalInfo5);
        }
        message5 += `
            </ul>
`;


        // Criar um transporte SMTP com as configurações definidas durante o login
        const transporter = nodemailer.createTransport(smtpConfig);

        const htmlBody = message + message1 + message2 + message3 + message4 + message5;
        const assunto = cliente + ' - ' + material + ' - ' + datafinalformatada;

        // Configurar as opções do e-mail
        const mailOptions = {
            from: {
                address: smtpConfig.auth.user,
                name: req.session.name
            },
            to: to,
            subject: assunto,
            html: htmlBody,
            attachments: attachments
        };

        // Enviando o e-mail

        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail enviado: ' + info.response);
        res.redirect('/paginaInicial'); // Redireciona de volta para a página inicial
    } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        res.status(500).send(
            `<head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="icon" href="/img/erro-icon2.png">
                <link rel="stylesheet" href="/style-erroSendMail">
                <title>Erro ao enviar e-mail</title>
            </head>
            <body>
                <div class="container">
                    <div class="erro"></div>
                    <h1>Erro ao enviar e-mail</h1><br>
                    <h2> ${error.message}</h2>
                    <br>Entre em contato com o suporte técnico
                    <br><br>
                    <a href="javascript:history.back()">Voltar</a>
                </div>
            </body>`
        );
    }
});

app.get('/logout', (req, res) => {
    //Destroi a sessao do usuario
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao fazer logout: ', err);
            res.status(500).send('Erro ao fazer logout');
        }
        else {
            // Redirecione o usuário de volta para a página de login
            res.redirect('/login');
        }
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
    // console.log(`${__dirname + '\\css\\'}`);
});
module.exports = app