// import pino from "pino"
// const pino = require("pino")

// const logger = pino({ transport: { target: "pino-pretty", options: { colorize: true } } });

// module.exports = logger

const pino = require("pino");

const logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,  // Habilita cores no terminal para facilitar a leitura dos logs
    },
  },
});

module.exports = logger;