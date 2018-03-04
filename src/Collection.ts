import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { generate as generateId } from 'shortid';
import { Entity } from './Entity';

export class Collection<T extends Entity> {
  private file: string;
  private entities: T[] = [];

  constructor(dir: string, private name: string) {
    this.file = join(dir, name + '.json');
    this.load();
  }

  create(obj: object): string {
    const entity = {id: generateId(), ...obj} as T;
    this.entities.push(entity);
    this.save();
    return entity.id;
  }

  delete(id): void {
    const index = this.findIndex(id);
    this.entities.splice(index, 1);
    this.save();
  }

  get(id: string): T {
    return this.entities.find((item) => item.id === id);
  }

  list(): T[] {
    return this.entities;
  }

  update(entity: T): void {
    const index = this.findIndex(entity.id);
    this.entities[index] = entity;
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
