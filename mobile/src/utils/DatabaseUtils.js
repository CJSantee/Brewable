const beansData = require("../../assets/data/Beans.json");
const brewData = require("../../assets/data/Brews.json");
const brewMethodData = require("../../assets/data/BrewMethods.json");
const flavorData = require("../../assets/data/Flavors.json");

// CoffeeLab.db
const createTables = (db) => {
    db.transaction(
        (tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS beans (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT,
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
              grind_setting REAL,
              water REAL,
              water_unit TEXT,
              coffee REAL,
              coffee_unit TEXT,
              temperature REAL,
              temp_unit TEXT,
              brew_method TEXT,
              time TEXT,
              bloom TEXT,
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
            );
        },
        (e) => {
            console.log(e);
        },
        null
    );
};

const updateTables110 = (db) => {
    // v1.1.0 -> Added 'bloom' to 'brews' table
    db.transaction(
        (tx) => {
            tx.executeSql(
                `ALTER TABLE brews
        ADD COLUMN bloom TEXT;`
            );
        },
        (e) => console.log(e),
        null
    );
};

const updateTables113 = (db) => {
    // v1.1.3 -> Changed 'grind_setting' to type REAL in 'brews' table
    console.log("Attempting update to 1.1.3");
    db.transaction(
        (tx) => {
            tx.executeSql("PRAGMA foreign_keys=off;");
        },
        (e) => console.log(e),
        null
    );
    db.transaction(
        (tx) => {
            tx.executeSql("ALTER TABLE brews RENAME TO _brews_old;");
            tx.executeSql(
                `CREATE TABLE brews (
        id INTEGER PRIMARY KEY NOT NULL,
        grind_setting REAL,
        water REAL, water_unit TEXT,
        coffee REAL, coffee_unit TEXT,
        temperature REAL, temp_unit TEXT,
        brew_method TEXT,
        time TEXT, bloom TEXT,
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
                `INSERT INTO brews (
        id, 
        grind_setting, 
        water, water_unit, 
        coffee, coffee_unit, 
        temperature, temp_unit, 
        brew_method, 
        time, bloom, 
        date,
        notes,
        flavor, acidity, aroma, body, sweetness, aftertaste,
        beans_id, 
        favorite, rating)
      SELECT 
        id, 
        grind_setting, 
        water, water_unit, 
        coffee, coffee_unit, 
        temperature, temp_unit, 
        brew_method, 
        time, bloom, 
        date,
        notes,
        flavor, acidity, aroma, body, sweetness, aftertaste,
        beans_id, 
        favorite, rating
      FROM _brews_old;`
            );
        },
        (e) => console.log(e),
        () => console.log("UPDATED")
    );
    db.transaction(
        (tx) => {
            tx.executeSql("PRAGMA foreign_keys=on;");
            tx.executeSql("DROP TABLE _brews_old");
        },
        (e) => console.log(e),
        null
    );
};

const updateTables120 = (db) => {
    // v1.2.0 -> Renamed 'region' to 'name' in 'beans' table
    db.transaction(
        (tx) => {
            tx.executeSql(
                `ALTER TABLE beans
        RENAME COLUMN region TO name;`
            );
        },
        (e) => console.log(e),
        null
    );
};

const checkForUpdate = (db) => {
    let sql = "";
    db.transaction(
        (tx) => {
            tx.executeSql(
                `SELECT sql
        FROM sqlite_master
        WHERE tbl_name = 'brews';`,
                [],
                (_, { rows: { _array } }) => {
                    sql = _array[0].sql;
                    if (!sql.includes("bloom TEXT")) {
                        updateTables110(db);
                    }
                    if (sql.includes("grind_setting TEXT")) {
                        updateTables113(db);
                    }
                }
            );
            tx.executeSql(
                `SELECT sql
        FROM sqlite_master
        WHERE tbl_name = 'beans';`,
                [],
                (_, { rows: { _array } }) => {
                    sql = _array[0].sql;
                    if (sql.includes("region TEXT")) {
                        updateTables120(db);
                    }
                }
            );
        },
        (e) => console.log(e),
        null
    );
};

const populateBeansFlavors = (db, flavorObjArr) => {
    var dbFlavors = [];
    for (let obj of flavorObjArr) {
        dbFlavors.push(obj.flavor);
    }

    db.transaction(
        (tx) => {
            for (let beans of beansData) {
                var flavors = beans.flavor_notes.split(",");
                for (let flavor of flavors) {
                    if (flavor === "") break;
                    if (!dbFlavors.includes(flavor)) {
                        tx.executeSql(
                            `INSERT INTO flavors
            (flavor) VALUES (?);`,
                            [flavor]
                        );
                    }
                }
            }
        },
        (e) => console.log(e),
        null
    );
};

const selectBeansFlavorsForPopulate = (db) => {
    var flavorObjArr;
    db.transaction(
        (tx) => {
            tx.executeSql(
                "SELECT * FROM flavors;",
                [],
                (_, { rows: { _array } }) => {
                    flavorObjArr = _array;
                }
            );
        },
        (e) => console.log(e),
        () => populateBeansFlavors(db, flavorObjArr)
    );
};

const populateBeans = (db) => {
    db.transaction(
        (tx) => {
            for (let beans of beansData) {
                beans.roast_date = new Date(beans.roast_date).toJSON();
                tx.executeSql(
                    `INSERT INTO beans
        (name, roaster, origin, roast_date, price, roast_level, weight, weight_unit, flavor_notes, rating, photo_uri, favorite)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                    [
                        beans.name,
                        beans.roaster,
                        beans.origin,
                        beans.roast_date,
                        beans.price,
                        beans.roast_level,
                        beans.weight,
                        beans.weight_unit,
                        beans.flavor_notes,
                        randomInt(0, 5),
                        randomInt(1, 7).toString(),
                        randomInt(0, 1),
                    ]
                );
            }
        },
        (e) => console.log(e),
        () => selectBeansFlavorsForPopulate(db)
    );
};

const populateBrews = (db) => {
    db.transaction(
        (tx) => {
            for (let brew of brewData) {
                tx.executeSql(
                    `INSERT INTO brews
        (acidity, aftertaste, aroma, beans_id, body, brew_method, coffee, coffee_unit, time, date, flavor, grind_setting, notes, sweetness, temp_unit, temperature, water, water_unit, favorite)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
                    [
                        brew.acidity,
                        brew.aftertaste,
                        brew.aroma,
                        brew.beans_id,
                        brew.body,
                        brew.brew_method,
                        brew.coffee,
                        brew.coffee_unit,
                        brew.time,
                        brew.date,
                        brew.flavor,
                        brew.grind_setting,
                        brew.notes,
                        brew.sweetness,
                        brew.temp_unit,
                        brew.temperature,
                        brew.water,
                        brew.water_unit,
                        brew.favorite,
                    ]
                );
            }
        },
        (e) => console.log(e),
        null
    );
};

function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomTime() {
    const min = randomInt(0, 5);
    const sec = randomInt(0, 59);
    const minText = "0" + min;
    const secText = sec < 10 ? "0" + sec : "" + sec;
    return minText + ":" + secText;
}
function randomDate() {
    const start = new Date(2012, 0, 1);
    const end = new Date();
    return new Date(
        start.getTime() + Math.random() * (end.getTime() - start.getTime())
    ).toJSON();
}
function randomText() {
    const loremIpsum =
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ut dapibus ante. Aliquam ac laoreet ex. Etiam luctus neque ante, ut pellentesque justo posuere eu. Pellentesque pharetra odio et arcu hendrerit, blandit efficitur mi scelerisque. Proin tincidunt ultricies turpis, ullamcorper tempor tortor pharetra ac. Aliquam dapibus velit vel convallis cursus. Ut non vestibulum diam, eu molestie magna. Donec interdum velit id lectus vehicula, quis viverra dolor semper. Aliquam erat volutpat. Aenean feugiat orci efficitur, aliquet sapien a, iaculis ex. Vestibulum ullamcorper augue non ante ornare finibus. Quisque accumsan, metus non aliquet consectetur, tortor turpis laoreet nulla, non porttitor metus augue eu eros. Etiam porta magna vitae nulla rhoncus eleifend. Proin auctor nisi sit amet fringilla condimentum.";
    return loremIpsum.substring(0, randomInt(1, loremIpsum.length));
}
function randomBrewMethod() {
    let brewMethods = [];
    for (let method of brewMethodData) {
        brewMethods.push(method.method);
    }
    return brewMethods[randomInt(0, brewMethods.length - 1)];
}

const populateRandomBrews = (db, callback) => {
    const numBrews = 100;

    db.transaction(
        (tx) => {
            for (let i = 0; i < numBrews; i++) {
                tx.executeSql(
                    `INSERT INTO brews
        (acidity, aftertaste, aroma, beans_id, body, brew_method, coffee, coffee_unit, time, date, flavor, grind_setting, notes, sweetness, temp_unit, temperature, water, water_unit, favorite, rating)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
                    [
                        randomInt(0, 100),
                        randomInt(0, 100),
                        randomInt(0, 100),
                        randomInt(1, beansData.length),
                        randomInt(0, 100),
                        randomBrewMethod(),
                        randomInt(15, 30),
                        "g",
                        randomTime(),
                        randomDate(),
                        randomInt(0, 100),
                        randomInt(1, 10),
                        randomText(),
                        randomInt(0, 5),
                        "f",
                        randomInt(200, 212),
                        randomInt(250, 500),
                        "g",
                        randomInt(0, 1),
                        randomInt(0, 5),
                    ]
                    //[brew.acidity,     brew.aftertaste,  brew.aroma,       brew.beans_id,                 brew.body,        brew.brew_method,   brew.coffee,      brew.coffee_unit, brew.time,    brew.date,    brew.flavor,      brew.grind_setting, brew.notes,   brew.sweetness, brew.temp_unit, brew.temperature,    brew.water,         brew.water_unit, brew.favorite   brew.rating]
                );
            }
        },
        (e) => console.log(e),
        callback(false)
    ); // setLoading(false);
};

const populateBrewMethods = (db) => {
    db.transaction(
        (tx) => {
            for (let method of brewMethodData) {
                tx.executeSql(
                    `INSERT INTO brew_methods
        (method) VALUES (?);`,
                    [method.method]
                );
            }
        },
        (e) => console.log(e),
        null
    );
};

const populateBrewMethodsIfEmpty = (db) => {
    let dbExists = false;
    db.transaction(
        (tx) => {
            tx.executeSql(
                "SELECT COUNT(*) as count FROM brew_methods;",
                [],
                (_, { rows: { _array } }) => {
                    if (_array[0].count > 0) {
                        dbExists = true;
                    }
                }
            );
        },
        (e) => console.log(e),
        () => {
            if (!dbExists) populateBrewMethods(db);
        }
    );
};

const populateFlavors = (db) => {
    db.transaction(
        (tx) => {
            for (let flavor of flavorData) {
                tx.executeSql(
                    `INSERT INTO flavors
        (flavor) VALUES (?);`,
                    [flavor.flavor]
                );
            }
        },
        (e) => console.log(e),
        null
    );
};

const populateFlavorsIfEmpty = (db) => {
    let dbExists = false;
    db.transaction(
        (tx) => {
            tx.executeSql(
                "SELECT COUNT(*) as count FROM flavors;",
                [],
                (_, { rows: { _array } }) => {
                    if (_array[0].count > 0) {
                        dbExists = true;
                    }
                }
            );
        },
        (e) => console.log(e),
        () => {
            if (!dbExists) populateFlavors(db);
        }
    );
};

export {
    createTables,
    checkForUpdate,
    populateBeans,
    populateBrews,
    populateRandomBrews,
    populateBrewMethodsIfEmpty,
    populateFlavorsIfEmpty,
};
