const tmp = require('tmp');
const { Database } = require('./notarealdb');

const tmpDir = () => tmp.dirSync().name;

describe('CRUD operations', () => {
  const db = new Database(tmpDir(), ['apples']);
  expect(db.apples.list()).toEqual([]);  

  const id1 = db.apples.create({variety: 'Akane', weight: 101});
  const id2 = db.apples.create({variety: 'Braeburn', weight: 102});
  const id3 = db.apples.create({variety: 'Cox', weight: 103});  

  test('list', () => {
    expect(db.apples.list()).toEqual([
      {id: id1, variety: 'Akane', weight: 101},
      {id: id2, variety: 'Braeburn', weight: 102},
      {id: id3, variety: 'Cox', weight: 103}
    ]);
  });

  test('get', () => {  
    expect(db.apples.get(id3)).toEqual({id: id3, variety: 'Cox', weight: 103});
  });

  test('update', () => {
    db.apples.update({id: id2, variety: 'Barry', weight: 112})
    expect(db.apples.get(id2)).toEqual({id: id2, variety: 'Barry', weight: 112});
  });

  test('delete', () => {
    db.apples.delete(id2);
    expect(db.apples.list()).toEqual([
      {id: id1, variety: 'Akane', weight: 101},
      {id: id3, variety: 'Cox', weight: 103}
    ]);
  });  
});

describe('Persistence', () => {
  test('restore saved data', () => {
    const dataDir = tmpDir();
    const db1 = new Database(dataDir, ['apples']);
    const id = db1.apples.create({variety: 'Braeburn', weight: 102});
    
    // let's pretend the app is restarted and a new db instance used
    const db2 = new Database(dataDir, ['apples']);

    expect(db2.apples.list()).toEqual([{id, variety: 'Braeburn', weight: 102}]);
  });
});
