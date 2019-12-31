const sqlite3 = require('sqlite3');
const initSql = require('sql.js');

async function main() {
  let db;
  let stmt;

  db = new sqlite3.Database(':memory:');

  console.time('sqlite3');
  db.serialize(() => {
    db.run('CREATE TABLE lorem (info TEXT);');

    stmt = db.prepare('INSERT INTO lorem VALUES (?);');
    for (var i = 0; i < 1000; i++) {
      stmt.run('Ipsum ' + i);
    }
    stmt.finalize();
    stmt = undefined;
  });
  console.timeEnd('sqlite3');
  db.close();

  const SQL = await initSql();
  db = new SQL.Database();

  console.time('sql.js');
  db.run('CREATE TABLE lorem (info TEXT);');

  stmt = db.prepare('INSERT INTO lorem VALUES ($text);');
  for (var i = 0; i < 1000; i++) {
    stmt.run({ $text: 'Ipsum ' + i });
  }
  stmt.free();
  stmt = undefined;
  console.timeEnd('sql.js');
  db.close();
}

main();
