# Not a Real DB

A "fake" database for Node.js that stores data in local JSON files, for testing and sample applications.

## Usage

Create a `Database` instance specifying in which folder to store the data, and what collections (or "tables") it contains:

```js
const { Database } = require('notarealdb');

const db = new Database('./data');
const apples = db.collection('apples');
const oranges = db.collection('oranges');
```

This will store apples in `./data/apples.json` and oranges in `./data/oranges.json`.

You can then and manipulate each collection using the following CRUD operations:

```js
// create a new item; returns a generated id
const id = apples.create({variety: 'Gala', weight: 133}); // => 'BJ4E9mQOG'

// list all items in a collection
apples.list(); // => [{id: 'BJ4E9mQOG', variety: 'Gala', weight: 133}]

// get a single item
apples.get('BJ4E9mQOG'); // => {id: 'BJ4E9mQOG', variety: 'Gala', weight: 133}

// update an item
apples.update({id: 'BJ4E9mQOG', variety: 'Braeburn', weight: 133});

// delete an item
apples.delete('BJ4E9mQOG');
```

That's it. All operations are synchronous.

Files are read at startup and written after each modification. You can manually edit a JSON file and provide some initial data, as long as you do that before you start the application.
