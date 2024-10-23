// Importa os módulos necessários
const jsonServer = require('json-server'); // JSON Server para simular a API REST
const express = require('express'); // Express para criar o servidor
const cors = require('cors'); // Middleware para habilitar CORS

// Cria o servidor JSON
const server = express();

// Define o caminho do arquivo JSON (simulando o banco de dados)
const router = jsonServer.router('server/db.json');

// Define as configurações padrão do JSON Server (logger, static, etc.)
const middlewares = jsonServer.defaults();

// Habilita CORS e configura as permissões necessárias
server.use(cors({
    origin: '*', // Permite todas as origens
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Permite esses métodos HTTP
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
    credentials: true // Habilita credenciais, se necessário
}));

// Usa os middlewares padrão do JSON Server
server.use(middlewares);

// Permite o uso de POST, PUT, PATCH e DELETE com JSON
server.use(express.json());

// Usa o roteador do JSON Server, que simula as rotas para o db.json
// server.use('/api', router); // Adiciona um prefixo para as rotas, ex.: /api/pessoas

// Define a porta que o servidor vai escutar
const PORT = process.env.PORT || 3000;

// Inicia o servidor na porta definida
server.listen(PORT, () => {
  console.log(`JSON Server is running on http://localhost:${PORT}`);
});
