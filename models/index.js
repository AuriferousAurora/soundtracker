const db = require('../db');
const format = require('pg-format')

class Model {
  constructor(table_name, table_cols) {
    this.table_name = table_name;
    this.table_cols = table_cols; 
  }

  value_format = () => { 
    let length = this.table_cols.length;
    let array = [...Array(length).keys()].map((i) => i + 1);
    let dollars = array.map((i) => '$' + i);
    return dollars;
  }

  async all() {
    const sql = format('SELECT * FROM %I', this.table_name);
    const data = await db.query(sql);

    return data;
  }

  async insert() {
    const sql = format('INSERT INTO %I (%L) VALUES (%L);', this.table_name, this.table_cols, this.value_format());
    const values = format(['a', 'b', 'c', 'd']);
    const data = await db.query(sql, ['test playlist', 'test playlist', values]);
    return null;
  }
}

class Playlist extends Model{ 
  async insert() {
    const sql = 'INSERT INTO $1';
  }
}

module.exports = { Model, Playlist };