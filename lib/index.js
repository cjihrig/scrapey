var Async = require("async");
var Request = require("request");
var Cheerio = require("cheerio");
var Hoek = require("hoek");

var _defaults = {
  dom: true,
  request: {},
  parser: {}
};

function scrape(options, callback) {
  var settings = Hoek.applyToDefaults(_defaults, options);

  if (!settings.request.jar) {
    settings.request.jar = Request.jar();
  }

  Request(settings.request, function(error, response, body) {
    if (error) {
      return callback(error);
    }

    var result = {
      response: response,
      body: body,
      jar: settings.request.jar
    };

    if (settings.dom === true) {
      try {
        result.dom = Cheerio.load(body, settings.parser);
      } catch (error) {
        return callback(error);
      }
    }

    callback(null, result);
  });
};

scrape.defaults = function(options) {
  Hoek.merge(_defaults, options);
};

scrape.jar = function() {
  return Request.jar();
};

scrape.cookie = function(cookieString, jar, url) {
  var cookie = Request.cookie(cookieString);

  if (jar && typeof jar === "object") {
    jar.setCookie(cookie, url);
  }

  return cookie;
};

scrape.cookieHeader = function(cookieHeader, jar, url) {
  var cookies = [];

  cookieHeader.split(";").forEach(function(cookie) {
    if (cookie) {
      cookies.push(this.cookie(cookie, jar, url));
    }
  });

  return cookies;
};

/*
scrape.waterfall = function(requests) {
  Hoek.assert(Array.isArray(requests), "Array of requests expected.");

  // TODO: Implement waterfall
  // Async.waterfall([], function(error, result) {

  // });
};

scrape.parallel = function(requests) {
  // TODO: Implement parallel
};
*/

module.exports = scrape;
