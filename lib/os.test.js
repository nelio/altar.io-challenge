const { getCPUPercentage, getMemoryUsage } = require('./os');
const osu = require('node-os-utils');

jest.mock('node-os-utils', () => ({
    cpu: {
        usage: jest.fn(),
    },
    mem: {
        info: jest.fn(),
    },
}));

describe('OS Module Unit Tests', () => {
    test('getCPUPercentage returns correct CPU usage', async () => {
        osu.cpu.usage.mockResolvedValue(25); // Mock 25% CPU usage
        const cpuUsage = await getCPUPercentage();
        expect(cpuUsage).toBe(25);
    });

    test('getMemoryUsage returns correct memory usage', async () => {
        osu.mem.info.mockResolvedValue({ freeMemPercentage: 40 }); // Mock 40% free memory
        const memoryUsage = await getMemoryUsage();
        expect(memoryUsage).toBe(40);
    });
});