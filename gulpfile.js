const dotenv = require('dotenv').config();
const {src, dest, task, parallel, series} = require('gulp');
const RaainImport = require('./src/raain.import');

let tasks = {};
[RaainImport]
    .forEach((classObject) => {
        const propNames = Object.getOwnPropertyNames(classObject);
        console.log('' + propNames);
        const allFunction = propNames.filter(prop => (
            (typeof classObject[prop] === "function") && (prop.substr(0, 1) !== '_'))
        );
        allFunction.forEach((fnName) => {
            tasks['' + classObject.name + '-' + fnName] = classObject[fnName];
        });
    });

// Extra tasks :
// try {
const {extraTasks} = require('./extra');
tasks = extraTasks(tasks);
//} catch (e) {
//    console.log('Some extra tasks can be created and used (ask raain sales)')
//}

// Tasks :
module.exports = tasks;
