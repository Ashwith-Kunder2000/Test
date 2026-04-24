const express = require('express');
const tokenRoutes = require('./routes/token.routes');
const notificationRoutes = require('./routes/notification.routes');

const app = express();

app.use(express.json());

app.use('/api/token', tokenRoutes);
app.use('/api/notifications', notificationRoutes);

module.exports = app;