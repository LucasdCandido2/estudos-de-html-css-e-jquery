const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const PORT = 3000;

server.use(jsonServer.rewriter({
  // Reescrever URLs se necessário
}));

// Middleware para converter ID em número
server.use((req, res, next) => {
    // Verifica se o corpo da requisição existe
    if (req.body && (req.method === 'POST' || req.method === 'PUT')) {
      // Converte o ID para número, se ele existir
      if (req.body.id && !isNaN(req.body.id)) {
        req.body.id = Number(req.body.id);
      }
    }
    next();
});

server.use(middlewares);
server.use(router);
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
