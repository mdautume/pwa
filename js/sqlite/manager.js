// SQLite database manager.

import { SQLite } from "./db.js";

// global SQLite WASM API object.
let sqlite3;

// required by the SQLite WASM API.
const CONFIG = {
    print: console.log,
    printErr: console.error,
};

// init loads a database from the specified path
// using the SQLite WASM API.
async function init(name, path) {
    console.log('manager init');
    if (sqlite3 === "loading") {
        return Promise.reject(Error("loading"));
    }
    if (sqlite3 === undefined) {
        sqlite3 = "loading";
        sqlite3 = await sqlite3InitModule(CONFIG);
        const version = sqlite3.capi.sqlite3_libversion();
        console.log(`Loaded SQLite ${version}`);
    }
    if (path.type == "binary") {
        console.log('manager init path type is binary');
        return await loadArrayBuffer(name, path);
    }
    // empty
    return await create(name, path);
}

// create creates an empty database.
async function create(name, path) {
    console.log('manager create');
    console.debug("Creating new database...");
    const db = new sqlite3.oo1.DB();
    return new SQLite(name, path, sqlite3.capi, db);
}

// loadArrayBuffer loads a database from the binary database file content.
async function loadArrayBuffer(name, path) {
    console.log('manager loadArrayBuffer');
    console.debug("Loading database from array buffer...");
    const db = loadDbFromArrayBuffer(path.value);
    path.value = null;
    const database = new SQLite(name, path, sqlite3.capi, db);
    database.gatherTables();
    return database;
}



// loadDbFromArrayBuffer loads an SQLite database from the array buffer.
function loadDbFromArrayBuffer(buf) {
    console.log('manager loadDbFromArrayBuffer');
    const bytes = new Uint8Array(buf);
    const p = sqlite3.wasm.allocFromTypedArray(bytes);
    const db = new sqlite3.oo1.DB();
    sqlite3.capi.sqlite3_deserialize(
        db.pointer,
        "main",
        p,
        bytes.length,
        bytes.length,
        sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE
    );
    return db;
}

export default { init};
