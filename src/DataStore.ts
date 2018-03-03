import { existsSync, mkdirSync } from 'fs';
import { Collection } from './Collection';

export class DataStore {
  constructor(private dir: string) {
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
    this.dir = dir;
  }

  collection(name): Collection {
    return new Collection(this.dir, name);
  }
}
