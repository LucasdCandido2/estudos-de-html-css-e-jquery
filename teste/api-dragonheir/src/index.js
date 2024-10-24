const createServer = require("./server");

async function incializacao() {
    const server = await createServer();
    server.listen({port:3000},(err,address) => {
        if (err) {
            alert('error port')
        }

        server.log.info(`server iniciando em ${address}`)
    })
};

incializacao();