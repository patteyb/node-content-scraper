//---------------------------------------------------------------------------------------
// SCRAPER.JS
//
// Author:  Pattey Bleecker
// Date:    November 28th, 2016
// For:     teamTreehouse Project 6, Build a Content Scraper
//
// Build a command-line application that goes to an ecommerce site to get the latest
// prices and save them to a spreadsheet in CSV format.
//
// Third-party NPM packages used:
// 1. scrapper-x.js --  selected package for the following reasons: no open issues on GitHub,
//                      elegant configuration format that simply establishes the format
//                      of the returned JSON object, and it's small footprint. It retrieves the 
//                      desired page and scrapes it for the desired content in one step.
//
// 2. babyparse.js --   selected package for the following reasons: no open issues on GitHub 
//                      and it is a popular package in wide use (>36,000 downloads in one month),
//                      no dependencies gives it a small footprint, and easy-to-understand documentation,
//                      I tried another package (csv-file-creator) that would have generated
//                      a csv-formatted array and then write it to a file, but I couldn't get it
//                      to work properly. Babyparse requires a file handling package, but I would need
//                      that anyway to ensure that the data directory existed and, if not, create one.
//-----------------------------------------------------------------------------------------------------

var sX      = require('scrapper-x');
var request = require('request');
var Promise = require('bluebird');
var merge   = require('merge');
var baby    = require('babyparse');
var moment  = require('moment');
var fs      = require('graceful-fs');
var colors  = require('colors');

var baseURL = 'http://shirts4mike.com';
controller();

//------------------------------------------------------------------------------------
// FUNCTION controller() 
//
// Main function that drives the content scrapping and data manipulation,
// file and error handling.
//------------------------------------------------------------------------------------
function controller() {

    var arrShirts = [];
    var dir = 'data';
    var curDate = moment().format('YYYY-MM-DD');

    var configMain = {
        repeatItemGroup: '.nav > li',
        dataFormat: {
            url: {
                selector: 'li > a',
                type: 'attr:href'
            }
        }
    };

    getPage(baseURL, configMain).then( function(data) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].url.search('shirt') !== -1) {
                var url = baseURL + '/' + data[i].url;
                return url;
            }
        }
    }).then( function(url) {
        var configShirts = {
            repeatItemGroup: '.products > li',
            dataFormat: {
                imageURL: {
                    selector: 'li > a > img',
                    type: 'attr:src'
                },
                url: {
                    selector: 'li > a',
                    type: 'attr:href'
                },
                time: moment().format('LTS')
            }
        };
        return getPage(url, configShirts);
    }).then( function(data) {
        arrShirts = data;
        var configDetails = {
            repeatItemGroup: '.shirt-details',
            dataFormat: {
                title: {
                    selector: '.shirt-details > h1',
                    type: 'text'
                },
                price: {
                    selector: '.price',
                    type: 'text'
                }
            }
        };
        return (getDetailPage(data, configDetails));
    }).then( function(data) {

        // Combine two objects into one and remove price from title string and 
        for( var i = 0; i < arrShirts.length; i++) {
            // data is an array of objects, where each object is stored as an array. Odd, I know.
            arrShirts[i] = (merge(data[i][0], arrShirts[i]));
            arrShirts[i].title = arrShirts[i].title.replace(/\$\d+/g, '').trim();
        }

        //convert JSON to csv to prepare for writing to file
        var csv = baby.unparse(arrShirts);

        // Create data directory if one does not exist
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // Write to file
        var file = dir + '/' + curDate + '.csv';
        fs.writeFile(file, csv, (err) => {
            if (err) throw err;
            var msg = 'Data saved to file: ' + file + '.';
            console.log(msg.yellow);
        });

    }).catch(function(e) {
        var msg = '';
        // Create message to append to error log
        if (e.message.startsWith('getaddrinfo ENOTFOUND')) {
            msg = "--  Page couldn't be accessed: ";
        } else {
            msg = '--  Something went wrong: ';
        }
        msg = moment().format('dddd, MMM Do, YYYY, h:mm:ss a') + msg + e.message + '\n';
        fs.appendFile('scraper.error.log', msg, (err) => {
            if (err) throw err;
            console.log(msg.yellow);
        });
    });
}

//------------------------------------------------------------------------------------
// FUNCTION getRequest() 
//
// Promisified request()
//------------------------------------------------------------------------------------
function getRequest(url) {
    return new Promise(function(resolve, reject) {
        request(url, function(err, response, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        });
    });
}

//------------------------------------------------------------------------------------
// FUNCTION getPage() 
//
// Resolves to scraped contents for one page
//------------------------------------------------------------------------------------
function getPage(url, config) {
    return getRequest(url).then(function(body) {
        return sX.scrape(body, config);
    });
}

//------------------------------------------------------------------------------------
// FUNCTION getDetailPage() 
//
// Resolves to an array of scraped contents for an array of objects
// for the url that is stored in each item
//------------------------------------------------------------------------------------
function getDetailPage(arr, config) {
    return Promise.map(arr, function(item) {
        return getPage(baseURL + '/' + item.url, config);
    });
}



    