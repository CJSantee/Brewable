const beansData = require('./assets/Beans.json');
const brewData = require('./assets/Brews.json');

// CoffeeLab.db
const createTables = (db) => {
    db.transaction((tx) => {
        tx.executeSql("DROP TABLE IF EXISTS beans;");
        tx.executeSql("DROP TABLE IF EXISTS brews;");

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
    for (let beans of beansData) {
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

const populateBrews = (db) => {
  db.transaction((tx) => {
    for (let brew of brewData) {
      tx.executeSql(
        `INSERT INTO brews
        (acidity, aftertaste, aroma, beans_id, body, brew_method, coffee, coffee_unit, date, flavor, grind_setting, notes, sweetness, temp_unit, temperature, water, water_unit)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
        [brew.acidity, brew.aftertaste, brew.aroma, brew.beans_id, brew.body, brew.brew_method, brew.coffee, brew.coffee_unit, brew.date, brew.flavor, brew.grind_setting, brew.notes, brew.sweetness, brew.temp_unit, brew.temperature, brew.water, brew.water_unit]
      );
    }
  },
  (e) => console.log(e),
  null);
}

export { createTables, populateBeans, populateBrews };