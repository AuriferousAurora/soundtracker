const db = require('./db');

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