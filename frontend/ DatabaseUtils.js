const beansData = require('./assets/Beans.json');
const brewData = require('./assets/Brews.json');
const brewMethodData = require('./assets/BrewMethods.json');

// CoffeeLab.db
const createTables = (db) => {
    db.transaction((tx) => {
        tx.executeSql("DROP TABLE IF EXISTS beans;");
        tx.executeSql("DROP TABLE IF EXISTS brews;");
        tx.executeSql("DROP TABLE IF EXISTS brew_methods;");
        tx.executeSql("DROP TABLE IF EXISTS flavors;");

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS beans (
            id INTEGER PRIMARY KEY NOT NULL,
            region TEXT,
            roaster TEXT,
            origin TEXT,
            roast_level TEXT,
            roast_date TEXT,
            price REAL,
            weight REAL,
            weight_unit TEXT,
            flavor_notes TEXT
          );`
        );

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS brews (
              id INTEGER PRIMARY KEY NOT NULL,
              grind_setting TEXT,
              water REAL,
              water_unit TEXT,
              coffee REAL,
              coffee_unit TEXT,
              temperature REAL,
              temp_unit TEXT,
              brew_method TEXT,
              time TEXT,
              date TEXT,
              notes TEXT,
              flavor INTEGER,
              acidity INTEGER,
              aroma INTEGER,
              body INTEGER,
              sweetness INTEGER,
              aftertaste INTEGER,
              beans_id INTEGER,
              favorite INTEGER,
              FOREIGN KEY (beans_id) REFERENCES beans(id)
          );`
        );

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS brew_methods (
            id INTEGER PRIMARY KEY NOT NULL,
            method TEXT UNIQUE
          );`
        );

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS flavors (
            id INTEGER PRIMARY KEY NOT NULL,
            flavor TEXT UNIQUE
          );`
        )  

    },
    (e) => {console.log(e)},
    null);
};

const populateBeans = (db) => {
  db.transaction((tx) => {
    for (let beans of beansData) {
      beans.roast_date = new Date(beans.roast_date).toJSON();
      tx.executeSql(
        `INSERT INTO beans
        (region, roaster, origin, roast_date, price, roast_level, weight, weight_unit, flavor_notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [beans.region, beans.roaster, beans.origin, beans.roast_date, beans.price, beans.roast_level, beans.weight, beans.weight_unit, beans.flavor_notes]
      );
    }
  },
  (e) => console.log(e),
  null);
}

const populateBrews = (db) => {
  db.transaction((tx) => {
    for (let brew of brewData) {
      tx.executeSql(
        `INSERT INTO brews
        (acidity, aftertaste, aroma, beans_id, body, brew_method, coffee, coffee_unit, time, date, flavor, grind_setting, notes, sweetness, temp_unit, temperature, water, water_unit, favorite)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
        [brew.acidity, brew.aftertaste, brew.aroma, brew.beans_id, brew.body, brew.brew_method, brew.coffee, brew.coffee_unit, brew.time, brew.date, brew.flavor, brew.grind_setting, brew.notes, brew.sweetness, brew.temp_unit, brew.temperature, brew.water, brew.water_unit, brew.favorite]
      );
    }
  },
  (e) => console.log(e),
  null);
}

const populateBrewMethods = (db) => {
  db.transaction((tx) => {
    for (let method of brewMethodData) {
      tx.executeSql(
        `INSERT INTO brew_methods
        (method) VALUES (?);`,
        [method.method]
      );
    }
  },
  (e) => console.log(e),
  null);
}

export { createTables, populateBeans, populateBrews, populateBrewMethods };