

import manager from "./sqlite/manager.js";
import {DatabasePath} from './db-path.js'

const ui = {
    buttons: {
        openFile: document.querySelector('#open-file'),
        open: document.querySelector('#file'),
        check: document.querySelector('#check'),
        save: document.querySelector('#save'),
        reset: document.querySelector('#reset')
    },
    texts: { 
        result: document.querySelector('#result')
    },
    elements: {
        card: document.querySelector('#card'),
        body: document.querySelector('#body')
    }
};

let database;

// start loads existing database or creates a new one
// using specified database path
async function start(name, path) {
    console.log('index start');
    try {
        const loadedDatabase = await manager.init(name, path);
        database = loadedDatabase;
        console.log('index start database', database);
    } catch (exc) {
        console.log('function start failure');
        return false;
    }
//    const sql_query = 'SELECT * FROM translations ORDER BY random() LIMIT 1;'
//    database.query = sql_query;
//    console.log('essai de changement de texte');
//    const res = database.execute(sql_query);
//    console.log('test result:', res);
//    ui.texts.result.innerHTML = 'new blabla';
    return true;
}

// startFromFile loads existing database from binary file
async function startFromFile(file, contents) {
    console.log('index startFromFile');
    const path = new DatabasePath(contents);
    const name = file.name;
    const success = await start(name, path);
    showStarted();
}

let rows_number; 

function showStarted() {
    console.log('index showStarted');
    let sql_query = 'SELECT * FROM translations ORDER BY random() LIMIT 1';
    database.query = sql_query;
    const res = database.execute(sql_query);
    sql_query = 'SELECT count() FROM translations';
    rows_number = database.execute(sql_query).values[0][0];
    console.log('test result:', res);
    console.log('number of rows:', rows_number);
    ui.texts.result.innerHTML = 'new blabla';
}



// execute runs SQL query on the database
// and shows results
function execute(sql) {
    console.log('index execute');
    sql = sql.trim();
    if (!sql) {
        ui.result.clear();
        return Promise.resolve();
    }
    try {
        const result = database.execute(sql);
        console.log('result', result);
        return Promise.resolve();
    } catch (exc) {
        console.log('error');
        return Promise.reject(exc);
    }
}



let filehandle;
ui.buttons.open.addEventListener('click', async (event) => {
    [filehandle] = await window.showOpenFilePicker(); 
    console.log('fileHandle', filehandle);
    const file = await filehandle.getFile() ;
    const contents = await file.arrayBuffer();
    startFromFile(file, contents);
    console.log('file', file);
});

ui.buttons.openFile.addEventListener('change', (event) => {
    if (!event.target.files.length) {
        return ;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
        event.target.value = '';
        console.log('uri buttons reader on load');
        startFromFile(file, reader.result);
    };
    reader.readAsArrayBuffer(file);
    console.log('end blabla');
});

let state = 0;
let row_id = 1;

ui.elements.card.addEventListener('click', () => {
    console.log('card clicked', database);
    console.log('row id', row_id);
    const sql = `SELECT * FROM translations WHERE rowid = ${row_id}`;
    const res = database.execute(sql);
    console.log('card clicked result', res.values);
    if (state === 0){
        state = 1;
        ui.texts.result.innerHTML = res.values[0][0];
    }
    else {
        state = 0;
        ui.texts.result.innerHTML = res.values[0][1];
    }
});

ui.buttons.check.addEventListener('click', () => {
    row_id = Math.floor(Math.random() * rows_number) + 1;
    console.log('check: row id', row_id);
    const sql = `SELECT * FROM translations WHERE rowid = ${row_id}`;
    const res = database.execute(sql);
    ui.texts.result.innerHTML = res.values[0][0];
});

ui.buttons.reset.addEventListener('click', () => {
    row_id = Math.floor(Math.random() * rows_number) + 1;
    const sql = `UPDATE translations SET Field3 = 10`;
    const res = database.execute(sql);
    console.log('set to zero', res);
    console.log('set to zero db', database);
});

const saveFile = async (handle) => {
  console.log('save file pointer', database.db.pointer);
  const writable = await handle.createWritable();
  const byteArray = database.capi.sqlite3_js_db_export(database.db.pointer);

  const blob = new Blob([byteArray.buffer], {
    type: "application/x-sqlite3",
  });

  await writable.write(blob);
  await writable.close();
};

ui.buttons.save.addEventListener('click', async () => {
    console.log('save file', filehandle);
    await saveFile(filehandle)
});



ui.elements.body.addEventListener('touchstart', (event) => {
    console.log('start, delta X:',event.changedTouches[0].screenY);
},false);
//ui.elements.body.addEventListener('touchend', (event) => {
//    console.log('end, delta Y:',event);
//},false);







