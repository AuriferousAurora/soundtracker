const db = require('./db');
const format = require('pg-format');

// Todo: Write script to run backup from command line
// * pg_dump -U postgres soundtracker > 'database/backups/filename.txt';
// Todo: Write script to restore backup from command line
// psql soundtracker < "database/backups/filename.txt"
// ! for some reason bash and powershell complain when attempting to perform this command; just use command prompt

async function createDatabase() {
    // ! Create backup before deleting and running.
    const ptSQL = 'CREATE TABLE playlists (id VARCHAR(50) PRIMARY KEY, name VARCHAR(200), tracks VARCHAR(200)[]);'
    const atSQL = 'CREATE TABLE artists (id VARCHAR(50) PRIMARY KEY, name VARCHAR(200), genre_ids UUID[]);'
    const ttSQL = 'CREATE TABLE tracks (id VARCHAR(50) PRIMARY KEY, name VARCHAR(200), artist_id VARCHAR(50),artist_name VARCHAR(200), album_id VARCHAR(50), album_name VARCHAR(200));';
    const gtSQL = 'CREATE TABLE genres (id UUID PRIMARY KEY, name VARCHAR(200));';

    const ptQuery = await db.query(ptSQL);
    const atQuery = await db.query(atSQL);
    const ttQuery = await db.query(ttSQL);
    const gtQuery = await db.query(gtSQL);

    console.log(ptQuery, atQuery, ttQuery, gtQuery);
}

// createDatabase();

async function dropTable(table_name) {
    const sql = format('DROP TABLE %I', table_name);
    await db.query(sql).catch( err => console.log(err)).then( res => console.log(res));
}

dropTable('test_table');