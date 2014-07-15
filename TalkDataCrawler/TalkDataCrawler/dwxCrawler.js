var util = require('util'),
    extend = require('extend'),
    events = require('events'),
    cheerio = require('cheerio'),
    SimpleCrawler = require("simplecrawler");

function Crawler(config) {

    this.config = config;
    this.talks = [];

    this._crawler = new SimpleCrawler(this.config.host);
    extend(this._crawler, config);
    
    this._crawler.on("fetchcomplete", this._fetchcomplete.bind(this));
    this._crawler.on("complete", function () {
        this.emit('complete', this.talks);
    }.bind(this));

}

util.inherits(Crawler, events.EventEmitter);


Crawler.prototype._fetchcomplete = function(queueItem , responseBuffer , response) {

    console.log("Completed fetching resource:", queueItem.url);

    var html = responseBuffer.toString();
    var $ = cheerio.load(html);

    var title = $(".container h2").first().text().trim();
    var description = $(".container p").first().text().trim();
    var time_and_track = $(".container .ezagenda_date").first().text().split("Track:");     
    var speaker = $("h4").next().find("a").first().text().trim();

    if (!title) {
        return;
    }

    this.talks.push({
        title: title,
        description: description,
        time_and_track: time_and_track,
        speaker: speaker
    });
};

Crawler.prototype.start = function() {
    this._crawler.start();
};

module.exports = Crawler;