const { Pool } = require('pg');

require('dotenv').config();

// Creating new pool allows for default env variables to be used if named correctly.
// Otherwise I would need to manually specify the properties by passing an object to the new Pool()
// e.g. { database: process.env.POSTGRES_DATABASE_NAME }
const pool = new Pool();

module.exports = {
    query: (text, params) => pool.query(text, params)
}