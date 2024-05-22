import mongoose from "mongoose";
import config from "./config.js";
import { logger } from "./logger_CUSTOM.js";

const MONGO_URL = config.mongo_url;

export default class MongoSingleton {
  static #instance;

  constructor() {
    this.#connectMongoDB();
  }
  static getInstance() {
    if (this.#instance) {
      logger.info("Ya se ha abierto una conexion a MongoDB.");
    } else {
      this.#instance = new MongoSingleton();
    }
    return this.#instance;
  }
  #connectMongoDB = async () => {
    try {
      await mongoose.connect(MONGO_URL);
      logger.info("Data base connected OK");
    } catch (error) {
      logger.error("No se pudo conectar a la BD usando Moongose: " + error);
      process.exit();
    }
  };
}