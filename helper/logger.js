const simpleLogger = require("simple-node-logger");
const option = {
    logFilePath: "logs.txt",
    timeStampFormat: "DD-MM-YYYY HH:mm:ss.sss"
};
const logger = simpleLogger.createSimpleLogger(option);

module.exports = logger;