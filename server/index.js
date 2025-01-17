require('dotenv').config();

const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const { authenticateToken } = require('./middleware/auth.js');
const SECRET_KEY = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function initializeDB() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users_praylist (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL
            )
            `)
        console.log('Tabela users criada ou já existente');
    } catch (error) {
        console.error('Erro ao criar tabela users:', error);
    }
}

initializeDB();

app.post('/register', async (req, res) => {
    const { Email, UserName, Password } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
        return res.status(400).json({ error: 'Email inválido' }); 
    }
    try {
        const userCheck = await pool.query(
            `SELECT * FROM users_praylist WHERE username = $1`,
            [UserName]
        );
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'O nome de usuário já existe' });
        }

        const emailCheck = await pool.query(
            `SELECT * FROM users_praylist WHERE email = $1`,
            [Email]
        );
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'O email já está em uso' });
        }

        const SQL = await pool.query(
            `INSERT INTO users_praylist (email, username, password)
            VALUES ($1, $2, $3)
            RETURNING id`,
            [Email, UserName, Password]
        );
        res.json({ id: SQL.rows[0].id });

        console.log('Usuário inserido com sucesso!');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao criar usuário' });
    }
})

app.post('/login', async (req, res) => {
    const { LoginUserName, LoginPassword } = req.body;
    // console.log('Tentativa de login:', { LoginUserName, LoginPassword })

    try {
        const SQL = await pool.query(
            `SELECT * FROM users_praylist WHERE username = $1 AND password = $2`,
            [ LoginUserName, LoginPassword]
        );

        if (SQL.rows.length === 0) {
            return res.status(401).json({ error: 'Usuário ou senha incorretos' });
        }

        const token = jwt.sign(
            { id: SQL.rows[0].id, username: SQL.rows[0].username },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        // console.log('Token gerado:', token);
        res.json({ token, id: SQL.rows[0].id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
})

app.listen(3001, '0.0.0.0', () => {
    console.log('Servidor rodando na porta 3001');
});