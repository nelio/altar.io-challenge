const osu = require('node-os-utils');
const basicAuth = require("express-basic-auth");

const getCPUPercentage = async () => {
    const cpu = osu.cpu;
    return cpu.usage();
};

const getMemoryUsage = async () => {
    const memory = osu.mem;
    const memoryInfo = await memory.info();
    return memoryInfo.freeMemPercentage;
};

module.exports = { getCPUPercentage, getMemoryUsage };

