var Path = require("path");
var Hapi = require("hapi");

function start(callback) {
  var server = new Hapi.Server({
    files: {
      relativeTo: Path.join(__dirname, "files")
    }
  }, 0);

  server.route([
    {
      method: "GET",
      path: "/static/{path*}",
      handler: {
        directory: {
          path: "./"
        }
      }
    }
  ]);

  server.start(function() {
    callback(server);
  });
}

module.exports = {
  start: start
};
