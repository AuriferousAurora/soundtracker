const db = require('./db');
const format = require('pg-format')

const { Genre, Artist } = require("./models");

async function updateArtistWithGenreIDs() {
    const genreQuery = await Genre.all();
    const genres = genreQuery.rows;

    for await (let genre of genres) {
        const aritistQuery = await Artist.select_array_col(Artist.formatArray([genre.name]), 'genre_names');
        const matchingArtists = aritistQuery.rows;
        for await (let artist of matchingArtists) {
            const artistQuery = await Artist.update_array_col(Artist.formatArray([genre.id]), 'genre_ids', artist.id);
        }
    }
}
  
// updateArtistWithGenreIDs();
// Todo: When I come back to this, I'll need to redesign the genre and artist table to use an array of uuids instead of varchar. 
async function test() {
    // const sql = 'select t.name, a.name, t.album_name from artists a join tracks t on a.id = t.artist_id;'
    const sql = 'select g.id, g.name, a.name from artists a join genres g on g.id = ANY (a.genre_ids);'
    const query = await db.query(sql);
    console.log(query);
    return query;
}

test();