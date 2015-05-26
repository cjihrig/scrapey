# Scrapey

**DEPRECATED**

Web page scraping utility written in Node.js. Scrapey acts as a glue layer between [`request`](https://github.com/mikeal/request), [`cheerio`](https://github.com/cheeriojs/cheerio), [`async`](https://github.com/caolan/async), and other modules useful in page scraping.

Scrapey is still in **very** early stage development, but the underlying modules are stable.

## Basic Usage

The simplest usage of Scrapey is shown below.

```
var Scrapey = require("scrapey");

Scrapey({
  request: {
    url: "http://coolsite.org"
  }
}, function(error, result) {
  var dom = result.dom;
  var title = result.dom("head").text();

});
```

Scrapey takes two arguments, `options` and `callback`.

`options` is an object used to configure Scrapey and the underlying modules. The expected format of `options` is described below.

  - `dom` - A Boolean specifying if `cheerio` will be invoked to parse the response. Defaults to `true`.
  - `request` - An object passed to `request`. Defaults to `{}`, meaning that the user will have to modify the defaults or set values on each call.
    - *A note on cookie jars* - Scrapey uses a cookie jar on every request. If a cookie jar is not passed in, then a new one will be created prior to making the request. By passing in a cookie jar, state is able to be maintained across multiple requests.
  - `parser` - An object passed to `cheerio`. Scrapey does not modify this object, and instead passes it directly to `cheerio` if it is invoked. Defaults to `{}`.

`callback` is a function that is invoked once the page scrape is complete. `callback` is passed two arguments, `error` and `result`. If an error occurs at any point in the scraping process, the error is passed in the first argument. The `result` argument is an object containing the following fields.

  - `response` - The `response` object passed to the `request` callback. Scrapey does not modify this value.
  - `body` - The `body` object passed to the `request` callback. Scrapey does not modify this value.
  - `jar` - The `request` cookie jar used for the request. The `jar` should reflect any `Set-Cookie` headers sent back by the requested page.
  - `dom` - The result of `cheerio.load()` if parsing is enabled (`dom` set to `true` in the request). If parsing is not enabled, this will be `undefined`.

## Methods

The Scrapey module implements the following methods.

### `defaults(options)`

Each time Scrapey is invoked, the options passed by the user are combined with a set of default vaues. `defaults()` is used to overwrite the default values used with every request. The initial defaults are shown below.

```
{
  dom: true,
  request: {},
  parser: {}
}
```

A description of the defaults:

  - `dom` - A Boolean specifying if `cheerio` will be invoked to parse the response.
  - `request` - An object passed to `request`. Scrapey does not modify this object, and instead passes it directly to `request`.
  - `parser` - An object passed to `cheerio`. Scrapey does not modify this object, and instead passes it directly to `cheerio` if it is invoked.

An example call to defaults is shown below:

```
Scrapey.defaults({
  dom: false
});
```

After this call, `cheerio` will no longer be invoked on any requests unless explicity enabled. The resulting defaults are shown below. Note that the values of `request` and `parser` are not modified, as no corresponding values were passed in.

```
{
  dom: false,
  request: {},
  parser: {}
}
```

### `jar()`

Creates an empty `request` cookie jar. An example call is shown below.

```
var jar = Scrapey.jar();
```

### `cookie(cookieString, [jar, url])`

Creates a `request` cookie based on the value of `cookieString`. If `jar` and `url` are included, the resulting cookie is added to `jar` for the corresponding `url`. The newly created cookie is returned, no matter what. An example use of `cookie()` is shown below.

```
var jar = Scrapey.jar();
var cookie = Scrapey.cookie("foo=bar", jar, "/");
```

### `cookieHeader(cookieHeader, jar, url)`

Description pending.

### `waterfall()`

Not yet implemented. The idea is to create an `Async.waterfall()` of requests.

### `parallel()`

Not yet implemented. The idea is to call `Async.parallel()`.
