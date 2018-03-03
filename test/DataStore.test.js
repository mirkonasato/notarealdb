const tmp = require('tmp');
const { DataStore } = require('../dist/');

const store = new DataStore(tmp.dirSync().name);
const apples = store.collection('apples');

const ids = {};

test('can create and list items', () => {
  ids.a = apples.create({variety: 'Akane', weight: 101});
  ids.b = apples.create({variety: 'Braeburn', weight: 102});
  ids.c = apples.create({variety: 'Cox', weight: 103});  

  expect(apples.list()).toEqual([
    {id: ids.a, variety: 'Akane', weight: 101},
    {id: ids.b, variety: 'Braeburn', weight: 102},
    {id: ids.c, variety: 'Cox', weight: 103}
  ]);
});

test('creations are persisted', () => {
  apples.load();
  expect(apples.list()).toEqual([
    {id: ids.a, variety: 'Akane', weight: 101},
    {id: ids.b, variety: 'Braeburn', weight: 102},
    {id: ids.c, variety: 'Cox', weight: 103}
  ]);
});

test('can get an item by its id', () => {  
  expect(apples.get(ids.c)).toEqual({id: ids.c, variety: 'Cox', weight: 103});
});

test('can update an item', () => {
  apples.update({id: ids.b, variety: 'Barry', weight: 112})
  expect(apples.get(ids.b)).toEqual({id: ids.b, variety: 'Barry', weight: 112});
});

test('updates are persisted', () => {
  apples.load();
  expect(apples.get(ids.b)).toEqual({id: ids.b, variety: 'Barry', weight: 112});
});

test('can delete an item', () => {
  apples.delete(ids.b);
  expect(apples.list()).toEqual([
    {id: ids.a, variety: 'Akane', weight: 101},
    {id: ids.c, variety: 'Cox', weight: 103}
  ]);
});  

test('deletions are persisted', () => {
  apples.load();
  expect(apples.list()).toEqual([
    {id: ids.a, variety: 'Akane', weight: 101},
    {id: ids.c, variety: 'Cox', weight: 103}
  ]);
});  
