const express = require('express');
const app = express();

app.use(express.json());
app.use('/health-check', require('./route/healthRoute'));

app.use('/api/v1', require('./route/fileRoute'));

module.exports = app;