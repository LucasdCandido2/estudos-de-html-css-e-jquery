// import fastify from "fastify"
const Fastify = require("fastify");
const {logger} = require("./utils/logger");
// import { logger } from "./utils/logger"

async function createServer() {
    // const fastify = Fastify({
    //     logger
    //   })
    const fastify = Fastify({  // Renomeie aqui para evitar o conflito
        logger:true
    });

    //   fastify.get("/heroes", async(req,rep) => { 
    //     fastify.log.info(req)
    //   })
    fastify.get("/heroes", async (req, rep) => { 
        fastify.log.info(req);
        rep.send({ message: "Heroes endpoint" });
    });
      return fastify
}

module.exports = createServer