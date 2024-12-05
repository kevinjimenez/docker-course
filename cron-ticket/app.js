const { syncDB } = require('./task/sync-db');
const cron = require('node-cron');

console.log('Inicio app');

cron.schedule('1-59/5 * * * * *', syncDB);