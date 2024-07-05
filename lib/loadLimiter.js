const {getCPUPercentage, getMemoryUsage} = require("./os");
const logger = require("./logger");
const config = require("config");
const loadLimiter = async (req, res, next) => {
    const cpuLoad = await getCPUPercentage();
    const memoryUsage = await getMemoryUsage();
    logger.info(`CPU Load: ${cpuLoad}, Memory Usage: ${memoryUsage}`);
    if(cpuLoad > config.get('maxCPULoad') || memoryUsage > config.get('maxMemoryUsage')) {
        res.status(429).send('System is under heavy load');
    } else {
        next();
    }
};
module.exports = { loadLimiter };