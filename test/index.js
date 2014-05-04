var Url = require("url");
var Hoek = require("hoek");
var Lab = require("lab");
var Scrapey = require("..");
var Server = require("./server");

// Test shortcuts
var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;

var server;

describe("Scrapey", function() {
  before(function(done) {
    Server.start(function(s) {
      server = s;
      done();
    });
  });

  after(function(done) {
    server.stop(done);
  });

  it("successfully parses HTML page", function(done) {
    Scrapey({
      request: {
        url: server.info.uri + "/static/test1.htm"
      }
    }, function(error, result) {

      expect(error).to.not.exist;
      expect(result && result.dom).to.exist;
      expect(result.dom("title").text()).to.equal("foo");
      done();
    });
  });

  it("does not parse HTML when dom is false", function(done) {
    Scrapey({
      dom: false,
      request: {
        url: server.info.uri + "/static/test1.htm"
      }
    }, function(error, result) {

      expect(error).to.not.exist;
      expect(result).to.exist;
      expect(result.dom).to.not.exist;
      done();
    });
  });

  describe("#jar()", function() {
    it("successfully creates an empty cookie jar", function(done) {
      var jar = Scrapey.jar();

      expect(jar).to.exist;
      expect(Hoek.reach(jar, "_jar.store.idx")).to.exist;
      done();
    });
  });

  describe("#cookie()", function() {
    it("successfully creates a cookie without a jar", function(done) {
      var cookie = Scrapey.cookie("foo=bar");

      expect(cookie.key).to.equal("foo");
      expect(cookie.value).to.equal("bar");
      done();
    });

    it("successfully adds a cookie to a jar", function(done) {
      var url = server.info.uri;
      var parsed = Url.parse(url, true);
      var jar = Scrapey.jar();
      var cookie = Scrapey.cookie("foo=bar", jar, url);
      var jarCookie = jar._jar.store.idx[parsed.hostname]["/"].foo

      expect(jarCookie).to.exist;
      expect(cookie.key).to.equal(jarCookie.key);
      expect(cookie.value).to.equal(jarCookie.value);
      expect(cookie.domain).to.equal(jarCookie.domain);
      expect(cookie.path).to.equal(jarCookie.path);
      done();
    });
  });
});
