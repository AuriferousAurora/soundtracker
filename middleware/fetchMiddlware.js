const fetch = require('node-fetch');

async function fetchPlaylistTracks(access, playlists) {
    let playlistArray = [];
    // For await ... of creates a loop iterating over async iterable objects
    for await (let p of playlists) {
        let playlist = { 'id': null, 'name': null, 'trackIDs': null };

        const tracks = await fetch(p.tracks.href, {
            headers: { 'Authorization': 'Bearer ' + access } })
        .catch((err) => console.log(err))
        .then((res) => res.json());
        
        let ids = [];
        tracks.items.forEach((track) => { if (track.track) ids.push(track.track.id); });
        
        playlist.id = p.id;
        playlist.name = p.name;
        playlist.trackIDs = ids;

        playlistArray.push(playlist);
    
    }

    return playlistArray;
}

module.exports = { fetchPlaylistTracks }