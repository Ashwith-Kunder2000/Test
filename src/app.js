const express = require('express');
require('../config/dbConfig');   // ✅ correct path
const notificationRoutes = require('./routes/notificationRoute');


const app = express();

app.use(express.json());
app.use('/api/notifications', notificationRoutes);

module.exports = app;           // ✅ correct export
