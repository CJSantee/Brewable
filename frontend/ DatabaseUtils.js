const beansData = require('./assets/Beans.json');

// CoffeeLab.db
const createTables = (db) => {
    db.transaction((tx) => {
        // tx.executeSql("DROP TABLE IF EXISTS beans;");
        // tx.executeSql("DROP TABLE IF EXISTS brews;");

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS beans (
            id INTEGER PRIMARY KEY NOT NULL,
            region TEXT,
            roaster TEXT,
            origin TEXT,
            roast_date TEXT,
            price REAL,
            roast_level TEXT,
            weight REAL,
            flavor_notes TEXT
          );`
        );

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS brews (
              id INTEGER PRIMARY KEY NOT NULL,
              grind_setting TEXT,
              water REAL,
              coffee REAL,
              temperature REAL,
              brew_method TEXT,
              date TEXT,
              notes TEXT,
              flavor INTEGER,
              acidity INTEGER,
              aroma INTEGER,
              body INTEGER,
              sweetness INTEGER,
              aftertaste INTEGER,
              beans_id INTEGER,
              FOREIGN KEY (beans_id) REFERENCES beans(id)
          );`
        );

    },
    (e) => {console.log(e)},
    null);
};

const populateBeans = (db) => {
  db.transaction((tx) => {
    for (let beans of beansData){
      tx.executeSql(
        `INSERT INTO beans
        (region, roaster, origin, roast_date, price, roast_level, weight, flavor_notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
        [beans.region, beans.roaster, beans.origin, beans.roast_date, beans.price, beans.roast_level, beans.weight, beans.flavor_notes]
      );
    }
  },
  (e) => console.log(e),
  null);
}

export { createTables, populateBeans };