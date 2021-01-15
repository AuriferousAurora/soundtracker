const db = require('./db');
const format = require('pg-format')

class Abstract {
  constructor() { 
    if(new.target === Abstract) { throw new TypeError('Cannot construct instance of abstract class directly.'); }
    // if(this.insert === undefined) { throw new TypeError('Must override create method.'); }
    // if(this.select === undefined) { throw new TypeError('Must override create method.'); }
    // if(this.remove === undefined) { throw new TypeError('Must override create method.'); }
  }
}

class Model extends Abstract {

  constructor(table_name, table_cols, logging_enabled = true) {
    super();
    this.table_name = table_name;
    this.table_cols = table_cols;
    this.logging_enabled = logging_enabled;
  }

  formatArray = (array) => "{" + array + "}";

  async all() {
    const sql = format('SELECT * FROM %I', this.table_name);
    const query = await db.query(sql);

    return query;
  }

  async delete(data) {
    const sql = format('DELETE FROM %I WHERE id IN (%L);', this.table_name, data);
    const query = await db.query(sql);

    return query;
  }

  async insert(data) {
    const sql = format('INSERT INTO %I (%I) VALUES (%L);', this.table_name, this.table_cols, data);
    const query = await db.query(sql);

    return query;
  }

  async update_array_col(data, column_name, id) {
    const sql = format('UPDATE %I SET %I = %I || %L WHERE id = %L;', this.table_name, column_name, column_name, data, id);
    const query = await db.query(sql);

    return query;
  }

  async select(data, column_name = 'id') {
    const sql = format('SELECT * FROM %I WHERE %I IN (%L);', this.table_name, column_name, data);
    const query = await db.query(sql);

    return query;
  }

  async select_array_col(data, column_name = 'id') {
    const sql = format('SELECT * FROM %I WHERE %I @> %L;', this.table_name, column_name, data);
    const query = await db.query(sql);

    return query;
  }

  async select_single_col(column) {
    const sql = format('SELECT DISTINCT %I FROM %I;', column, this.table_name);
    const query = await db.query(sql);

    let rows = [];
    query.rows.forEach(r => rows.push(r.artist_id));

    return rows;
  }
}

class Playlist extends Model { 
  constructor(table_name, table_cols, logging_enabled) {
    super(table_name, table_cols, logging_enabled);
  }

  async insert(data) {
    for await (let d of data) {
      if (d.trackIDs.includes(null)) continue;

      // Todo: Determine if I can get values dynamically instead of via object properties.
      // ? Why do calls to class method fail inside await loop ( Model.formatArray() )
      // * Attempted to format d.trackIDs with this.formatArray() and it returned null.
      
      const values = [d['id'], d['name'], "{" + d.trackIDs + "}"];
      const sql = format('INSERT INTO %I (%I) VALUES (%L);', this.table_name, this.table_cols, values);
      const query = await db.query(sql);

      if(this.logging_enabled) query.then((res) => console.log(res)).catch((err) => console.log(err));
    }
  }

}

class Artist extends Model {
  constructor(table_name, table_cols) {
    super(table_name, table_cols);
  } 

  async insert(data) {
    for await (let d of data) {
      const values = [d['id'], d['name'], null, "{" + d.genres + "}"];
      const sql = format('INSERT INTO %I (%I) VALUES (%L);', this.table_name, this.table_cols, values);
      const query = await db.query(sql);

      if(this.logging_enabled) query.then((res) => console.log(res)).catch((err) => console.log(err));
    }
  }
}

class Genre extends Model {
  constructor(table_name, table_cols) {
    super(table_name, table_cols);
  } 
  async insert(data) {
    for await (let d of data) {
      const values = [d];
      const sql = format('INSERT INTO %I (%I) VALUES (gen_random_uuid(), %L);', this.table_name, this.table_cols, values);
      const query = await db.query(sql);

      if(this.logging_enabled) query.then((res) => console.log(res)).catch((err) => console.log(err));
    }
  }
}

class Track extends Model {
  constructor(table_name, table_cols) {
    super(table_name, table_cols);
  } 

  async insert(data) {
    for await (let d of data) {
      const values = [d['id'], d['name'], d['artist_id'], d['artist_name'], d['album_id'], d['album_name']];
      const sql = format('INSERT INTO %I (%I) VALUES (%L);', this.table_name, this.table_cols, values);
      const query = await db.query(sql);

      if(this.logging_enabled) query.then((res) => console.log(res)).catch((err) => console.log(err));
    }
  }
}

module.exports.Playlist = new Playlist('playlists', ['id', 'name', 'track_ids']);
module.exports.Track = new Track('tracks', ['id', 'name', 'artist_id', 'artist_name', 'album_id','album_name']);
module.exports.Artist = new Artist('artists', ['id', 'name', 'genre_ids', 'genre_names']);
module.exports.Genre = new Genre('genres', ['id', 'name']);


