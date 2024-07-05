const express = require('express');
const multer  = require('multer');
const config = require('config');

const logger = require('./lib/logger');
const {decreaseUsers, customAuth, getCurrentUsers} = require("./lib/auth");
const {getCPUPercentage, getMemoryUsage} = require("./lib/os");
const {upload} = require('./lib/multer');
const {loadLimiter} = require('./lib/loadLimiter');

const app = express();
const port = config.get('port') || 3000;

app.use(customAuth);

app.get('/', (req, res) => {
  res.send('Multi-part upload service - use /upload to upload a file.');
});

app.use('/upload', loadLimiter);

app.post('/upload',  upload.single('file'), (req, res) => {
  const endTime = Date.now();
  const uploadTime = endTime - req.startTime;
  logger.log({
    level: 'info',
    message: `User ${req.username} uploaded file ${req.file.originalname}, upload time: ${uploadTime}ms`
  });
  // req.body will hold the text fields, if there were any
  decreaseUsers();
  res.send('File uploaded successfully.');
});

app.get('/status', async (req, res) => {
  const cpu = await getCPUPercentage();
  const memory = await getMemoryUsage();
  res.send({cpu, memory, currentUsers: getCurrentUsers()});
});

app.listen(port, () => {
  console.log(`Upload app listening on port ${port}`);
});
