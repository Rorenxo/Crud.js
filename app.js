const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
const port = process.env.PORT || 5000

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crud'
})

// para sa lahat ng data
app.get('', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from users', (err, rows) => {
            connection.release()

            if(!err){
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

// get ng data
app.get('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('SELECT * from users WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release()

            if(!err){
                res.send(rows)
            } else {
                console.log(err)
            }
        })
    })
})

//insert ng data
app.post('', (req, res) => {
    pool.getConnection((err, connection) => { 
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const params = req.body

        connection.query('INSERT INTO users SET ?', params, (err, rows) => {
            connection.release()

            if(!err){
                res.send(`The user id: ${params.id} has been added`)
            } else {
                console.log(err)
            }
        })
        console.log(req.body)
    })
})

//Update ng data
app.put('/:id', (req, res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        const { firstName, lastName, is_admin } = req.body
        const id = req.params.id

        connection.query(
            'UPDATE users SET firstName = ?, lastName = ?, is_admin = ? WHERE id = ?',
            [firstName, lastName, is_admin, id],
            (err, result) => {
                connection.release() // return the connection to pool

                if(!err) {
                    if(result.affectedRows > 0) {
                        res.send(`User with the id: ${id} has been updated.`)
                    } else {
                        res.status(404).send(`User with id: ${id} not found.`)
                    }
                } else {
                    console.log(err)
                }
            }
        )
        console.log(req.body)
    })
})

//delete ng data    
app.delete('/:id', (req, res) => {
    pool.getConnection((err, connection) => { 
        if(err) throw err
        console.log(`connected as id ${connection.threadId}`)

        connection.query('DELETE from users WHERE id = ?', [req.params.id], (err, rows) => {
            connection.release()

            if(!err){
                res.send(`The user id: ${[req.params.id]} has been removed`)
            } else {
                console.log(err)
            }
        })
    })
})

app.listen(port, () => console.log(`Listen on port ${port}`))