require('dotenv').config();

const express = require('express');
const app = express();
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const { authenticateToken } = require('./middleware/auth.js');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function initializeListDB() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS list_praylist (
            id SERIAL PRIMARY KEY,
            task VARCHAR(255) NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            user_id INTEGER NOT NULL REFERENCES users_praylist(id) ON DELETE CASCADE
            )
            `)
        console.log('Tabela list criada ou já existente')
    } catch (error) {
        console.error('Erro ao criar tabela list:', error);
    }
}

initializeListDB();

app.post('/list', authenticateToken, async (req, res) => {
    const { task, completed } = req.body;
    const userId = req.user.id;

    try {
        const taskCheck = await pool.query(
            `SELECT * FROM list_praylist WHERE task = $1 AND user_id = $2`,
            [task, userId]
        );
        if (taskCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Essa tarefa já existe na lista.' });
        }

        const SQL = await pool.query(
            `INSERT INTO list_praylist (task, completed, user_id)
            VALUES ($1, $2, $3)
            RETURNING id`,
            [task, completed, userId]
        )
        res.json({ id: SQL.rows[0].id });

        console.log('Tarefa inserida com sucesso!');
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
})

app.get('/list', authenticateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const SQL = await pool.query(
            `SELECT * FROM list_praylist WHERE user_id = $1`,
            [userId]
        );
        res.json(SQL.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar tarefas' });
    }
})

app.put('/list/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { task, completed } = req.body;
    const userId = req.user.id;

    try {
        await pool.query(
            `UPDATE list_praylist SET task = $1, completed = $2 WHERE id = $3 AND user_id = $4`,
            [task, completed, id, userId]
        );
        res.json({ message: 'Tarefa atualizada com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar tarefa' });
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

        res.json({ message: 'Tarefa excluída com sucesso!' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir tarefa' });
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

app.listen(3002, '0.0.0.0', () => {
    console.log('Servidor rodando na porta 3002');
});