var sys = require(process.binding('natives').util ? 'util' : 'sys'),
    http = require("http"),
    https = require("https"),
    fs = require("fs"),
    path = require("path"),
    qs = require("querystring"),
    url_parse = require("url").parse,
    less = require("less"),
    config = require("./config");

function forEachIn(obj, f) {
  var hop = Object.prototype.hasOwnProperty;
  for (var n in obj) if (hop.call(obj, n)) f(n, obj[n]);
}

function parseQuery(query) {
  var parsed = qs.parse(query);
  forEachIn(parsed, function(prop, val) {
    if (!Array.isArray(val)) parsed[prop] = [val];
  });
  return parsed;
}
function queryVal(query, name) {
  return query.hasOwnProperty(name) ? query[name][0] : null;
}

function readData(obj, c) {
  var received = [];
  obj.setEncoding("utf8");
  obj.addListener("data", function(chunk) {received.push(chunk);});
  obj.addListener("end", function() {c(received.join(""));});
}

http.createServer(function(req, resp) {
  var question = req.url.indexOf("?");
  var query = question == -1 ? {} : parseQuery(req.url.slice(question + 1));

  if (req.method == "POST" && req.headers["content-type"] == "application/x-www-form-urlencoded") {
    readData(req, function(data) {
      forEachIn(parseQuery(data), function(name, val) {
        var current = query.hasOwnProperty(name) && query[name];
        query[name] = current ? current.concat(val) : val;
      });
      respond(query, resp);
    });
  } else {
    respond(query, resp);
  }
}).listen(config.port, config.host);

function respond(query, resp) {
  var direct = queryVal(query, "less_code"),
      urls = query.code_url || [],
      header = (queryVal(query, "header") || "").replace(/\r\n/g, "\n");
  if (header && !/\n$/.test(header)) header += "\n";
    less.render(direct, {}, function(error, css) {
        if (error) {
            respondError(direct, urls, header + css, error, resp);
            process.exit(2);
        }
        try {
            if (typeof css == 'string') {
                respondDirect(queryVal(query, "download"), header + css, error, resp);
            } else {
                respondDirect(queryVal(query, "download"), header + css.css, error, resp);
            }
        } catch (e) {
            respondError(direct, urls, header + css, error, resp);
            process.exit(3);
        }
    });
}

function respondError(direct, urls, output, error, resp) {
  if (error) {
    resp.writeHead(500, {"Content-Type": "text/html"});
    resp.write(JSON.stringify(error));
    resp.end();
  }
}

function respondDirect(download, output, error, resp) {
  var headers = {"Content-Type": "text/javascript"};
  if (download) headers["Content-Disposition"] = "attachment; filename=" + download;
  resp.writeHead(200, headers);
  resp.write(output);
  resp.end();
}
