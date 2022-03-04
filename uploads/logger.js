const { createLogger, format, transports } = require("winston");

const logConfiguration = {
    transports: [
        new transports.Console(),

        new transports.File({
            level: 'error',
            level: 'info',
            // Create the log directory if it does not exist
            filename: 'logs/server.log'
        })
    ],
    format: format.combine(
        format.label({
            label: `Logs`
        }),
        format.timestamp({
           format: 'MMM-DD-YYYY HH:mm:ss'
       }),
        format.printf(info => `${info.level}: ${info.label}: [${info.timestamp}]: ${info.message}`),
    )
};

module.exports = createLogger(logConfiguration);

// Log a message