const { increaseUsers, decreaseUsers, getCurrentUsers, isMoreThanTenSecondsAgo, customAuth } = require('./auth');
const config = require('config');
const logger = require('./logger');

jest.mock('config');
jest.mock('./logger');

describe('Auth Module Unit Tests', () => {
    beforeEach(() => {
        // Reset user count before each test
        while(getCurrentUsers() > 0) {
            decreaseUsers();
        }
    });

    test('increaseUsers increases user count by 1', () => {
        increaseUsers();
        expect(getCurrentUsers()).toBe(1);
    });

    test('decreaseUsers decreases user count by 1', () => {
        increaseUsers(); // Ensure there is a user to decrease
        decreaseUsers();
        expect(getCurrentUsers()).toBe(0);
    });

    test('getCurrentUsers returns the current user count', () => {
        expect(getCurrentUsers()).toBe(0); // Initial state
        increaseUsers();
        expect(getCurrentUsers()).toBe(1); // After increase
    });

    test('isMoreThanTenSecondsAgo returns true for dates more than 10 seconds ago', () => {
        const moreThanTenSecondsAgo = new Date(Date.now() - 11000);
        expect(isMoreThanTenSecondsAgo(moreThanTenSecondsAgo)).toBe(true);
    });

    test('isMoreThanTenSecondsAgo returns false for dates less than 10 seconds ago', () => {
        const lessThanTenSecondsAgo = new Date(Date.now() - 5000);
        expect(isMoreThanTenSecondsAgo(lessThanTenSecondsAgo)).toBe(false);
    });
});