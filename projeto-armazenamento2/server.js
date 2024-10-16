// server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware para servir os arquivos estáticos da pasta 'public'
app.use(express.static('public'));
app.use(express.json()); // Para interpretar JSON no body

// Configuração do multer para salvar as imagens na pasta 'img'
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'img');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Rota para o envio do formulário e da imagem
app.post('/submit', upload.single('imagem'), (req, res) => {
    const { nome, email, idade } = req.body;
    const imagePath = req.file ? `/img/${req.file.filename}` : null;

    // Dados a serem gravados no arquivo JSON
    const formData = {
        nome: nome,
        email: email,
        idade: idade,
        imagem: imagePath
    };

    // Grava os dados do formulário em um arquivo na pasta 'assets'
    fs.writeFile(`assets/${Date.now()}-form.json`, JSON.stringify(formData, null, 2), (err) => {
        if (err) {
            return res.status(500).send('Erro ao salvar os dados do formulário.');
        }
        res.status(200).send('Formulário e imagem enviados com sucesso!');
    });
});

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
