require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    port: 5432,
    database: process.env.DB_NAME
});

(async () => {
    try {
        await client.connect();
        console.log('Connected to the database!');
    } catch (err) {
        console.error('Database connection error', err.stack);
    }
})();

module.exports = client;