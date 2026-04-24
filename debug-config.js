require('dotenv').config();
const config = require('./sequelize-config.js');
console.log('Development config:', JSON.stringify(config.development, null, 2));
console.log('DATABASE_URL from env:', process.env.DATABASE_URL);
