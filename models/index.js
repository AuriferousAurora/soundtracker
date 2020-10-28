const db = require('../db');
const format = require('pg-format')

class Abstract {
  constructor() { 
    if(new.target === Abstract) { throw new TypeError('Cannot construct instance of abstract class directly.'); }
    // if(this.insert === undefined) { throw new TypeError('Must override create method.'); }
    // if(this.select === undefined) { throw new TypeError('Must override create method.'); }
    // if(this.update === undefined) { throw new TypeError('Must override create method.'); }
    // if(this.remove === undefined) { throw new TypeError('Must override create method.'); }
  }
}

class Model extends Abstract {

  constructor(table_name, table_cols) {
    super();
    this.table_name = table_name;
    this.table_cols = table_cols;
  }

  // value_format = () => { 
  //   let length = this.table_cols.length;
  //   try {
  //     let array = [...Array(length).keys()].map((i) => i + 1);
  //     let dollars = array.map((i) => '$' + i);
      
  //     return dollars;
  //   } catch (err) {
  //     throw new Error(err.message);
  //   }
  // }

  async all() {
    const sql = format('SELECT * FROM %I', this.table_name);
    const data = await db.query(sql);

    return data;
  }

  async insert() {
    const values = ['testID', 'testName', ['a', 'b', 'c']];
    const sql = format('INSERT INTO %I (%L) VALUES (%L);', this.table_name, this.table_cols, values);

    const data = await db.query(sql, ['test playlist', 'test playlist', values]);

    return data;
  }
}

class Playlists extends Model { 
  constructor(table_name, table_cols) {
    super(table_name, table_cols);
  } 
}

module.exports.playlist = new Playlists('playlist', ['id', 'playlist', 'tracks']);