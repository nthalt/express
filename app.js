require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./userRoutes');

const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
    res.send('hello world again');
});

const { Pool } = require('pg');
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT,10)
});

app.get('/test-db', async(req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ message: 'Database connected successfully', time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database connection failed' });   
    }
});

console.log('DB Port:', process.env.DB_PORT);
console.log('DB Host:', process.env.DB_HOST);

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});

module.exports = { pool };