import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const port = 3000;

app.use(express.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'usuarios',
    port: 3333,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/users', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM users;');

    return res.status(200).json({
        message: "Usuários recuperados com sucesso!",
        data: rows
    })
});

app.post('/users', async (req,res) => {
    const {name, email} = req.body;

    const [result] = await pool.query(
        `INSERT INTO users (id, name, email)
            VALUES (null, ?, ?)`,
            [name, email]
    );

    return res.status(201).json({
        message: "Usuário criado com sucesso!"
    })
});

//delete
app.delete('/users/:id', async (req,res) => {
    const {id} = req.params;

    const [result] = await pool.query(
        `DELETE FROM users WHERE id = ?`,
            [id]
    );

    return res.status(200).json({
        message: "Usuário criado com sucesso!"
    })
})

app.put('/users/:id', async (req, res) => {
    const {id} = req.params;
    const {name, email} = req.body;

    const [result] = await pool.query(
        `UPDATE users SET name = ?, email = ?
            WHERE id = ?`,
            [name, email, id]
    )

    return res.status(200).json({
        message: "Sucesso ao atualizar usuário"
    })
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
})