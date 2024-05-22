import { Command } from "commander";
import { logger } from "./config/logger_CUSTOM.js";

const program = new Command();

program
  .option("-d", "Varaible para debug", false)
  .option("-p <port>", "Puerto del servidor", 8080)
  .option("--mode <mode>", "Modo de trabajo", "develop")

  .requiredOption(
    "-u <user>",
    "Usuario que va a utilizar el aplicativo.",
    "No se ha declarado un usuario."
  ); //RequireOption usa un mensaje por defecto si no está presente la opción.
program.parse();

//Listeners
process.on("exit", (code) => {
  logger.warning("Este codigo se ejecuta antes de salir del proceso.");
  logger.info("Codigo de salida del proceso: " + code);
});

process.on("uncaughtException", (exception) => {
  logger.warning("Esta excepción no fue capturada, o controlada.");
  logger.info(`Exception no capturada: ${exception}`);
});

process.on("message", (message) => {
  logger.info(
    "Este codigo se ejecutará cuando reciba un mensaje de otro proceso."
  );
  logger.info(`Mensaje recibido: ${message}`);
});
export default program;