// CoffeeLab.db

const createTables = (db) => {
    db.transaction((tx) => {
        tx.executeSql("DROP TABLE IF EXISTS beans;");
        tx.executeSql("DROP TABLE IF EXISTS brews;");

        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS beans (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT,
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

export { createTables };