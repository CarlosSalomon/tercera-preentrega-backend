import winston from 'winston'
import config from './config.js'


const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'red',
        error: 'yellow',
        warning: 'magenta',
        http: 'cyan',
        info: 'blue',
        debug: 'grey',
    }
};


winston.addColors(customLevelsOptions.colors);


//Loggers para desarrollo 
const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    // Declaramos el transport
    transports: [
        new winston.transports.Console(
            {
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize({ colors: customLevelsOptions.colors }),
                    winston.format.simple()
                )
            }
        ),
         new winston.transports.File(
             {
                 filename: './erros.log',
                 level: "error",
                format: winston.format.simple()
            }
        )
    ]
});
export const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({ colors: customLevelsOptions.colors }),
          winston.format.simple()
        ),
      }),
    ],
  });



//Loggers para producción
const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    // Declaramos el transport
    transports: [
        new winston.transports.Console({ level: "info" }),
        new winston.transports.File({ filename: './erros.log', level: "error" })
    ]
})


// creamos el middlware
export const addLogger = (req, res, next) => {


    if (config.environment === "prod") {
        req.logger = prodLogger;

        req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`)
        req.logger.warning(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`)
        req.logger.debug(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`)


    } else {
        req.logger = devLogger;

        req.logger.http(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`)
        req.logger.warning(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`)
        req.logger.debug(`${req.method} en ${req.url} - at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`)
    }
    next();
};

