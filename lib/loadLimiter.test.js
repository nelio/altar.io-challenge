const { loadLimiter } = require('./loadLimiter');
const os = require('./os');
const logger = require('./logger');
const config = require('config');

jest.mock('./os');
jest.mock('./logger');
jest.mock('config');

describe('Load Limiter Middleware Tests', () => {
    const mockReq = {};
    const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };
    const mockNext = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('allows requests under normal load', async () => {
        os.getCPUPercentage.mockResolvedValue(30); // Below threshold
        os.getMemoryUsage.mockResolvedValue(40); // Below threshold
        config.get.mockImplementation((key) => {
            if (key === 'maxCPULoad') return 70;
            if (key === 'maxMemoryUsage') return 80;
        });

        await loadLimiter(mockReq, mockRes, mockNext);

        expect(mockRes.status).not.toHaveBeenCalled();
        expect(mockRes.send).not.toHaveBeenCalled();
        expect(mockNext).toHaveBeenCalled();
    });

    test('blocks requests when CPU load is too high', async () => {
        os.getCPUPercentage.mockResolvedValue(80); // Above threshold
        os.getMemoryUsage.mockResolvedValue(40); // Below threshold
        config.get.mockImplementation((key) => {
            if (key === 'maxCPULoad') return 70;
            if (key === 'maxMemoryUsage') return 80;
        });

        await loadLimiter(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(429);
        expect(mockRes.send).toHaveBeenCalledWith('System is under heavy load');
        expect(mockNext).not.toHaveBeenCalled();
    });

    test('blocks requests when memory usage is too high', async () => {
        os.getCPUPercentage.mockResolvedValue(30); // Below threshold
        os.getMemoryUsage.mockResolvedValue(90); // Above threshold
        config.get.mockImplementation((key) => {
            if (key === 'maxCPULoad') return 70;
            if (key === 'maxMemoryUsage') return 80;
        });

        await loadLimiter(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(429);
        expect(mockRes.send).toHaveBeenCalledWith('System is under heavy load');
        expect(mockNext).not.toHaveBeenCalled();
    });
});