const createTables = (db) => {
    db.transaction((tx) => {
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
              bloom_time TEXT,
              temperature REAL,
              brew_method TEXT,
              date TEXT,
              notes TEXT,
              flavor INTEGER,
              acidity INTEGER,
              aroma INTEGER,
              body INTEGER,
              sweetness INTEGER,
              aftertaste INTEGER
          );`
        );

    },
    (e) => {console.log(e)},
    null);
};


export { createTables };