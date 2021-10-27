const beansData = require('./assets/data/Beans.json');
const brewData = require('./assets/data/Brews.json');
const brewMethodData = require('./assets/data/BrewMethods.json');
const flavorData = require('./assets/data/Flavors.json');

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
            flavor_notes TEXT,
            rating INTEGER,
            photo_uri TEXT,
            favorite INTEGER
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
              rating INTEGER,
              FOREIGN KEY (beans_id) REFERENCES beans(id) ON DELETE CASCADE
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
        (region, roaster, origin, roast_date, price, roast_level, weight, weight_unit, flavor_notes, rating, photo_uri, favorite)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        [beans.region, beans.roaster, beans.origin, beans.roast_date, beans.price, beans.roast_level, beans.weight, beans.weight_unit, beans.flavor_notes, randomInt(0,5), randomInt(1,5).toString(), randomInt(0,1)]
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

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomTime() {
  const min = randomInt(0,5);
  const sec = randomInt(0,59);
  const minText = '0'+min;
  const secText = (sec < 10) ? ('0'+sec) : ''+sec;
  return minText+":"+secText;
}
function randomDate() {
  const start = new Date(2012, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toJSON();
}
function randomText() {
  const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ut dapibus ante. Aliquam ac laoreet ex. Etiam luctus neque ante, ut pellentesque justo posuere eu. Pellentesque pharetra odio et arcu hendrerit, blandit efficitur mi scelerisque. Proin tincidunt ultricies turpis, ullamcorper tempor tortor pharetra ac. Aliquam dapibus velit vel convallis cursus. Ut non vestibulum diam, eu molestie magna. Donec interdum velit id lectus vehicula, quis viverra dolor semper. Aliquam erat volutpat. Aenean feugiat orci efficitur, aliquet sapien a, iaculis ex. Vestibulum ullamcorper augue non ante ornare finibus. Quisque accumsan, metus non aliquet consectetur, tortor turpis laoreet nulla, non porttitor metus augue eu eros. Etiam porta magna vitae nulla rhoncus eleifend. Proin auctor nisi sit amet fringilla condimentum.';
  return loremIpsum.substring(0, randomInt(1, loremIpsum.length));
}
function randomBrewMethod() {
  let brewMethods = [];
  for (let method of brewMethodData) {
    brewMethods.push(method.method);
  }
  return brewMethods[randomInt(0,brewMethods.length-1)];
}

const populateRandomBrews = (db) => {
  const numBrews = 100;

  db.transaction((tx) => {
    for (let i = 0; i < numBrews; i++) {
      tx.executeSql(
        `INSERT INTO brews
        (acidity, aftertaste, aroma, beans_id, body, brew_method, coffee, coffee_unit, time, date, flavor, grind_setting, notes, sweetness, temp_unit, temperature, water, water_unit, favorite, rating)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
        [randomInt(0,100), randomInt(0,100), randomInt(0,100), randomInt(1,beansData.length), randomInt(0,100), randomBrewMethod(), randomInt(15,30), 'g',              randomTime(), randomDate(), randomInt(0,100), randomInt(1,10),    randomText(), randomInt(0,5), 'f',            randomInt(200, 212), randomInt(250,500), 'g',             randomInt(0,1), randomInt(0,5)]
      //[brew.acidity,     brew.aftertaste,  brew.aroma,       brew.beans_id,                 brew.body,        brew.brew_method,   brew.coffee,      brew.coffee_unit, brew.time,    brew.date,    brew.flavor,      brew.grind_setting, brew.notes,   brew.sweetness, brew.temp_unit, brew.temperature,    brew.water,         brew.water_unit, brew.favorite   brew.rating]
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

const populateFlavors = (db) => {
  db.transaction((tx) => {
    for (let flavor of flavorData) {
      tx.executeSql(
        `INSERT INTO flavors
        (flavor) VALUES (?);`,
        [flavor.flavor]
      );
    }
  },
  (e) => console.log(e),
  null);
}

export { createTables, populateBeans, populateBrews, populateRandomBrews, populateBrewMethods, populateFlavors };