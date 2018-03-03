const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const shortid = require('shortid');

class Database {
  constructor(dataDir) {
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir);
    }
    this.dataDir = dataDir;
  }

  table(name) {
    return new Table(this.dataDir, name);
  }
}

class Table {
  constructor(dataDir, name) {
    this.name = name;
    this._dataFile = join(dataDir, name + '.json');
    this._reload();
  }

  create(item) {
    const id = shortid.generate();
    this._items.push({id, ...item});
    this._save();
    return id;
  }

  delete(id) {
    const index = this._findIndex(id);
    this._items.splice(index, 1);
    this._save();
  }

  get(id) {
    return this._items.find((item) => item.id === id);
  }

  list() {
    return this._items;
  }

  update(item) {
    const index = this._findIndex(item.id);
    this._items[index] = item;
    this._save();
  }

  _findIndex(id) {
    const index = this._items.findIndex((current) => current.id === id);
    if (index === -1) {
      throw new Error(`No ${this.name} found with id "${id}"`);
    }
    return index;
  }

  _reload() {
    if (existsSync(this._dataFile)) {
      this._items = JSON.parse(readFileSync(this._dataFile, {encoding: 'utf8'}));
    } else {
      this._items = [];
    }
  }

  _save() {
    writeFileSync(this._dataFile, JSON.stringify(this._items, null, 2), {encoding: 'utf8'});
  }
}

module.exports = { Database };
