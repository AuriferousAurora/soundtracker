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

  constructor(table_name, table_cols, logging_enabled = false) {
    super();
    this.table_name = table_name;
    this.table_cols = table_cols;
    this.logging_enabled = logging_enabled;
  }

  formatArray = (array) => { "{" + array + "}" };

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

  async select(data) {
    // May want to rewrite this to include the abilityo select on columns other than id.
    const sql = format('SELECT * FROM %I WHERE id IN (%L);', this.table_name, data);
    const query = await db.query(sql);

    return query;
  }
}

class Playlists extends Model { 
  constructor(table_name, table_cols, logging_enabled) {
    super(table_name, table_cols, logging_enabled);
  }

  async insert(data) {
    // ? Should I update this to return the query instead of returning null?
    for await (let d of data) {
      if (d.trackIDs.includes(null)) continue;
      // Todo: Determine if I can get values dynamically instead of via object properties.
      // ? Why do calls to class method fail inside await loop.
      // * Attempted to format d.trackIDs with this.formatArray() and it returned null.
      const values = [d['id'], d['name'], "{" + d.trackIDs + "}"];
      const sql = format('INSERT INTO %I (%I) VALUES (%L);', this.table_name, this.table_cols, values);
      const query = await db.query(sql);

      if(this.logging_enabled) query.then((res) => console.log(res)).catch((err) => console.log(err));
    }
  }

}

// class Artist extends Model {
//   constructor(table_name, table_cols) {
//     super(table_name, table_cols);
//   } 
// }

// class Album extends Model {
//   constructor(table_name, table_cols) {
//     super(table_name, table_cols);
//   } 
// }

// class Track extends Model {
//   constructor(table_name, table_cols) {
//     super(table_name, table_cols);
//   } 
// }

module.exports.Playlist = new Playlists('playlists', ['id', 'name', 'tracks']);