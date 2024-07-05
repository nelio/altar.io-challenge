const basicAuth = require("express-basic-auth");
const config = require("config");
const logger = require("./logger");

let currentUsers = 0;

const increaseUsers = () => {
    currentUsers++;
};

const decreaseUsers = () => {
    currentUsers--;
};

const getCurrentUsers = () => (currentUsers);

const isMoreThanTenSecondsAgo = (date) => {
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10 * 1000);
    return date < tenSecondsAgo;

};

const userCredentials = {
    mike: { password: '1234', lastLogin: null },
    charlie: {password: '5647', lastLogin: null }
};

const customAuth = async (req, res, next) => {
    if (req.path === '/status' || req.path === '/') return next('route');
    const startTime = Date.now(); // capture start time
    const authorizer = (username, password) => {
        if(currentUsers >= config.get('maxConcurrentUsers')) {
            logger.warn(`User ${username} tried to authenticate while the server is at max capacity`);
            return false;
        }
        const userExists = Object.keys(userCredentials).includes(username);
        const passwordMatches = userExists && basicAuth.safeCompare(password, userCredentials[username].password);
        const lastLogin = userCredentials[username].lastLogin;
        if (lastLogin && !isMoreThanTenSecondsAgo(lastLogin)) {
            logger.warn(`User ${username} tried to authenticate within 10 seconds of their last login`);
            return false;
        }
        if (userExists && passwordMatches) {
            logger.info(`User ${username} has been authenticated`);
            req.username = username;
            userCredentials[username].lastLogin = new Date();
            currentUsers+=1;
            req.startTime = startTime;
            return true;
        } else {
            logger.warn(`User ${username} failed to authenticate`);
            return false;
        }
    };

    return basicAuth({ authorizer, users: userCredentials })(req, res, next);
};

module.exports = { customAuth, increaseUsers, decreaseUsers, getCurrentUsers, isMoreThanTenSecondsAgo };