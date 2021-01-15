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
  
updateArtistWithGenreIDs();