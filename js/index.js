

import manager from "./sqlite/manager.js";
import {DatabasePath} from './db-path.js'

const ui = {
    buttons: {
        openFile: document.querySelector('#open-file')
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
}

// startFromFile loads existing database from binary file
async function startFromFile(file, contents) {
    console.log('index startFromFile');
    const path = new DatabasePath(contents);
    const name = file.name;
    const success = await start(name, path);
}

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
});
