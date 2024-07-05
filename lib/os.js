const osu = require('node-os-utils');

const getCPUPercentage = async () => {
    const cpu = osu.cpu;
    return cpu.usage();
};

const getMemoryUsage = async () => {
    const memory = osu.mem;
    const memoryInfo = await memory.info();
    return 100-memoryInfo.freeMemPercentage;
};

module.exports = { getCPUPercentage, getMemoryUsage };

