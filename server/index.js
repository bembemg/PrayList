require('dotenv').config();

const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const { authenticateToken } = require('./middleware/auth.js');
const SECRET_KEY = process.env.JWT_SECRET;
const caCert = process.env.CA_CERT ? process.env.CA_CERT.replace(/\\n/g, '\n') : null;
const schedule = require('node-schedule');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true,
        ca: caCert
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

async function initializeListDB() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS list_praylist (
            id SERIAL PRIMARY KEY,
            task VARCHAR(255) NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            user_id INTEGER NOT NULL REFERENCES users_praylist(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            `)
        console.log('Tabela list criada ou já existente')
    } catch (error) {
        console.error('Erro ao criar tabela list:', error);
    }
}

initializeListDB();

app.get('/list', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const SQL = await pool.query(
            `SELECT * FROM list_praylist WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        res.json(SQL.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar orações' });
    }
})

app.post('/list', authenticateToken, async (req, res) => {
    const { task, completed } = req.body;
    const userId = req.user.id;

    try {
        const taskCheck = await pool.query(
            `SELECT * FROM list_praylist WHERE task = $1 AND user_id = $2`,
            [task, userId]
        );
        
        if (taskCheck.rows.length > 0) {
            console.log('Erro: A oração já existe');
            return res.status(400).json({ error: 'Essa oração já existe na lista' })
        } 

        const SQL = await pool.query(
            `INSERT INTO list_praylist (task, completed, user_id)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [task, completed, userId]
        )
        res.json( SQL.rows[0] );

        console.log('Oração inserida com sucesso!');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao criar oração' });
    }
})

app.put('/list/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;
    const userId = req.user.id;

    try {

        const editTaskCheck = await pool.query(
            `SELECT * FROM list_praylist WHERE task = $1 AND user_id = $2 AND id != $3`,
            [task, userId, id]
        );
        
        if (editTaskCheck.rows.length > 0) {
            console.log('Erro ao editar oração: A oração já existe');
            return res.status(400).json({ error: 'Essa oração já existe na lista' })
        } 

        await pool.query(
            `UPDATE list_praylist SET task = $1, completed = $2 WHERE id = $3 AND user_id = $4`,
            [task, completed, id, userId]
        );

        console.log('Oração atualizada com sucesso!');
        res.json({ message: 'Oração atualizada com sucesso!' });
    } catch (error) {
        console.log('Erro ao atualizar oração:', error);
        res.status(500).json({ error: 'Erro ao atualizar oração' });
    }
})

app.delete('/list/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        await pool.query(
            `DELETE FROM list_praylist WHERE id = $1 AND user_id = $2`,
            [id, userId]
        );

        res.json({ message: 'Oração excluída com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir oração' });
    }
})

schedule.scheduleJob('0 0 * * *', async () => {
    try {
        await pool.query(`
            UPDATE list_praylist SET completed = false
            `)
        console.log("Todos os estados 'completed' redefinidos com sucesso!");
    } catch (error) {
        console.log("Erro ao redefinir estados 'completed':", error);
    }
})

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});