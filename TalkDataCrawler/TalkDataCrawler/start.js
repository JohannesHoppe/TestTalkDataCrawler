/**
 * A simple crawler to get the events from DWX 2014
 */

var fs = require('fs'),
    DwxCrawler = require('./dwxCrawler'),
    dwxCrawler,

    crawlerConfig = {
        host: 'www.developer-week.de',
        initialPath: '/Programm',
        discoverRegex: [
            /(\shref\s?=\s?)['"](\/Programm\/Veranstaltung\/\(event\)\/[^"']+)/ig
        ],
        userAgent: 'DWX 2014 TalkDataCrawler (by Johannes Hoppe)'
    },
    fileNameJsonP = '../talks_callback.json';

var saveStringify = function (obj) {
    return JSON.stringify(obj)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u??2029');
}

dwxCrawler = new DwxCrawler(crawlerConfig);
dwxCrawler.on('complete', function (talks) {

    var content = saveStringify(talks);
    fs.writeFile(fileNameJsonP, content, 'utf8', console.log);
});

dwxCrawler.start();
