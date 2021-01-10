CREATE TABLE playlists (
	id VARCHAR(50) PRIMARY KEY,
	name VARCHAR(200),
	tracks VARCHAR(200)[]
);

--INSERT IGNORE INTO playlists (id, name, tracks) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING;, ['id24ikdmlsfnsle', 'example2 playlist', '{"id1safasdasdsa", "id2afdsfsdfasfsaf", "id3fdfafasdfdsaf"}']

--INSERT INTO playlists (id, name, tracks) 
--VALUES ('id34ikdmlsfnsle', 
--	'example playlist', 
--	'{"id1safasdasdsa", "id2afdsfsdfasfsaf", "id3fdfafasdfdsaf"}') 
--ON CONFLICT (id)
--DO NOTHING;

CREATE TABLE tracks(
	id VARCHAR(50) PRIMARY KEY,
	name VARCHAR(200),
	artist_id VARCHAR(50),
	artist_name VARCHAR(200),
	album_id VARCHAR(50),
	album_name VARCHAR(200)
);

CREATE TABLE artists (
	id VARCHAR(50) PRIMARY KEY,
	name VARCHAR(200),
	genre_ids VARCHAR(50)[]
);

CREATE TABLE artists (
	id VARCHAR(50) PRIMARY KEY,
	name VARCHAR(200),
	genre_ids VARCHAR(50)[]
);

CREATE TABLE genres (
	id UUID PRIMARY KEY,
	name VARCHAR(200)
);


