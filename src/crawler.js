'use strict';

const fs = require('fs');
const through = require('through2');

function isEmpty(map) {
    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

const readFile = (path, opts = 'utf8') => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, opts, (err, data) => {
            if (err) reject(err)
            else resolve(data)
        })
    });
};

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const crawler = (inTestMode) => {
        let myModule = {};
        myModule.internal = {};
        myModule.public = {};

        myModule.internal.readTimeLimit = new Date();
        myModule.internal.database = null;

        myModule.internal.$init = async () => {

            // todo crawler init
            return Promise.resolve();
        };


//todo npm i website-scraper, npm i puppeteer, npm i cheerio, npm i scrape-it

// const puppeteer = require('puppeteer');
//
// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://example.com');
//   await page.screenshot({path: 'example.png'});
//
//   await browser.close();
// })();

// Tasks :
//exports.crawlImages = crawler.crawlImages;

        myModule.public.searchForDocumentsAndReadThem = (options) => {

            const jobDate = new Date();

            return through.obj((file, encoding, cb) => {
                    new Promise.resolve()
                        .then(() => {
                            cb(null, file);
                        })
                        .catch((err) => {
                            cb(err);
                        });
                },
                (cb) => {
                    cb(null);
                }
            );
        };

        return myModule;
    }
;

exports.crawler = crawler(false).public;
