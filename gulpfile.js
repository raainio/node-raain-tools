const dotenv = require('dotenv').config();
const {src, dest, task, parallel, series} = require('gulp');
const {crawler} = require('./src/crawler');

// Extra tasks :
let tasks = {crawler: crawler};
try {
    const extraTasks = require('./extra').extraTasks;
    tasks = extraTasks(crawler);
} catch (e) {
    console.log('Some extra tasks can be created and used (ask raain sales)')
}

// Tasks :
module.exports = tasks;
