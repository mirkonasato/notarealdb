const { existsSync, mkdirSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');
const shortid = require('shortid');

class Database {
  constructor(dataDir, collections) {
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir);
    }
    collections.forEach((name) => {
      this[name] = new Collection(dataDir, name);
    });
  }
}

class Collection {
  constructor(dataDir, name) {
    this.name = name;
    this.dataFile = join(dataDir, name + '.json');
    if (existsSync(this.dataFile)) {
      this.items = JSON.parse(readFileSync(this.dataFile, {encoding: 'utf8'}));
    } else {
      this.items = [];
    }
  }

  create(item) {
    const id = shortid.generate();
    this.items.push({id, ...item});
    this._save();
    return id;
  }

  delete(id) {
    const index = this._findIndex(id);
    this.items.splice(index, 1);
    this._save();
  }

  get(id) {
    return this.items.find((item) => item.id === id);
  }

  list() {
    return this.items;
  }

  update(item) {
    const index = this._findIndex(item.id);
    this.items[index] = item;
    this._save();
  }

  _findIndex(id) {
    const index = this.items.findIndex((current) => current.id === id);
    if (index === -1) {
      throw new Error(`No ${this.name} found with id "${id}"`);
    }
    return index;
  }

  _save() {
    writeFileSync(this.dataFile, JSON.stringify(this.items, null, 2), {encoding: 'utf8'});
  }
}

module.exports = { Database };
