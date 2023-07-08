const {Pool} = require('pg')

const pool = new Pool({
    user: 'postgres',
    password: 'root7415',
    port: 5432,
    host: 'localhost',
    database: 'notes'
})

module.exports = pool   