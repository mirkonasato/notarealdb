import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { generate as generateId } from 'shortid';
import { Entity } from './Entity';

export class Collection {
  private file: string;
  private entities: Entity[] = [];

  constructor(dir: string, private name: string) {
    this.file = join(dir, name + '.json');
    this.load();
  }

  create(entity: Entity): string {
    const id = generateId();
    this.entities.push({id, ...entity});
    this.save();
    return id;
  }

  delete(id): void {
    const index = this.findIndex(id);
    this.entities.splice(index, 1);
    this.save();
  }

  get(id): Entity {
    return this.entities.find((item) => item.id === id);
  }

  list(): Entity[] {
    return this.entities;
  }

  update(item): void {
    const index = this.findIndex(item.id);
    this.entities[index] = item;
    this.save();
  }

  private findIndex(id) {
    const index = this.entities.findIndex((current) => current.id === id);
    if (index === -1) {
      throw new Error(`No ${this.name} found with id "${id}"`);
    }
    return index;
  }

  private load() {
    if (existsSync(this.file)) {
      this.entities = JSON.parse(readFileSync(this.file, {encoding: 'utf8'}));
    }
  }

  private save() {
    writeFileSync(this.file, JSON.stringify(this.entities, null, 2), {encoding: 'utf8'});
  }
}
