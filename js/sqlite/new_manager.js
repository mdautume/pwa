import { SQLite } from "./db.js";

let sqlite3;

// required by the SQLite WASM API.
const CONFIG = {
    print: console.log,
    printErr: console.error,
};

// init loads a database from the specified path
// using the SQLite WASM API.
async function init(name, path) {
    console.log('function init sqlite3', sqlite3);
    if (sqlite3 === "loading") {
        console.log('sqlite3 loading', sqlite3);
        return Promise.reject(Error("loading"));
    }
    if (sqlite3 === undefined) {
        sqlite3 = "loading";
        sqlite3 = await sqlite3InitModule(CONFIG);
        const version = sqlite3.capi.sqlite3_libversion();
        console.log(`Loaded SQLite ${version}`);
    }
    console.log('function init sqlite3', sqlite3);
    console.log('path type', path.type);
    if (path.type == 'binary') {
        console.log('manager init path type is binary');
    }
    if (path.type == "binary") {
        console.log('manager init path type is binary');
        return await loadArrayBuffer(name, path);
    }
    // empty
    console.log('empty database');
    return;
//    return await create(name, path);
}

// loadArrayBuffer loads a database from the binary database file content.
async function loadArrayBuffer(name, path) {
    console.log("Loading database from array buffer...");
    const db = loadDbFromArrayBuffer(path.value);
    path.value = null;
    const database = new SQLite(name, path, sqlite3.capi, db);
    database.gatherTables();
    return database;
}

// loadDbFromArrayBuffer loads an SQLite database from the array buffer.
function loadDbFromArrayBuffer(buf) {
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
