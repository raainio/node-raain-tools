const dotenv = require('dotenv').config();
const {src, dest, task, parallel, series} = require('gulp');
const {crawler} = require('./src/crawler');

// Extra configs :
let myExtraOptions = {};
try {
    myExtraOptions = require('./extra').myExtraOptions;
} catch (e) {
}

// Tasks :

exports.default = [];
