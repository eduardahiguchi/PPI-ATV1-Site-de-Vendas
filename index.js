import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Para obter o __dirname em um módulo ES
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const porta = 5000;

// Middleware para analisar dados de formulários
app.use(bodyParser.urlencoded({ extended: true }));
// Serve arquivos estáticos (CSS, JS, Imagens) da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para configurar a sessão
app.use(session({
    secret: 'secret-key', 
    resave: false,
    saveUninitialized: true
}));

// Rota de login (POST)
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Verificação simples de credenciais (substitua com lógica de autenticação real)
    if (username === 'Eduarda' && password === '123') {
        req.session.user = { username }; // Armazenar informações do usuário na sessão
        res.redirect('/private/painel'); // Redireciona para o painel (sem .html)
    } else {
        res.send('Credenciais inválidas.');
    }
});

// Rota para verificar se o usuário está logado (usada para validação de sessão)
app.get('/session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});

// Rota para acessar páginas privadas com base na sessão
app.get('/private/:page', (req, res) => {
    if (req.session.user) {
        const page = req.params.page;
        const pagePath = path.join(__dirname, 'private', `${page}.html`);

        // Verificar se o arquivo realmente existe antes de enviar
        res.sendFile(pagePath, (err) => {
            if (err) {
                res.status(404).send('Página não encontrada.');
            }
        });
    } else {
        res.redirect('/login.html'); // Redireciona para o login caso não esteja autenticado
    }
});

// Rota de logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login.html'); // Redireciona para a tela de login após logout
    });
});

// Inicializa o servidor
app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});
