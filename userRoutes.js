const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const router = express.Router();

const { pool } = require('./app');

router.post('/register', async(req, res) => {
    try {
        const { username, email, password } = req.body;

        const userCheck = await pool.query('select * from users where username = $1 or email = $2', [username, email]);
        if(userCheck.rows.length > 0 ) {
            return res.status(400).json({ error: 'username or email already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await pool.query(
            'insert into users (username, email, password) values($1, $2, $3) returning id, username, email',
            [username, email, hashedPassword]
        );

        res.status(201).json({
            message: 'user registered successfully',
            user: newUser.rows[0]
        });
    } catch (err) {
        console.error('Detailed error:', err);
        res.status(500).json({ error: 'Server error', details: err.message });
      }
});

module.exports = router;