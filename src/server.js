import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/users', async (req, res) => {
    try{
        const [rows] = await pool.query('SELECT * FROM users;');

        return res.status(200).json({
            message: "Usuários recuperados com sucesso!",
            data: rows
        })
    }
    catch(error) {
        console.log(error);
        return res.status(500).json({
            message: "Erro no servidor, tente novamente!"
        })
    }
    finally {
        console.log("Teste")
    }
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