// server.js
// where your node app starts

var compression = require("compression");
var cors = require("cors");
var express = require("express");
var app = express();
var request = require("request");
// compress our client side content before sending it over the wire
app.use(compression());
var parseString = require("xml2js").parseString;

var zwsid = process.env.zwsid;
console.log("Zillow API Key", zwsid);
// your manifest must have appropriate CORS headers, you could also use '*'
app.use(cors({ origin: "https://trello.com" }));

app.get("/zillow/zpid", function(req, res, next) {
  console.log(req.query);

  //send back as JSON
  res.sendStatus(200);
});

app.get("/zillow/address", function(req, res, next) {
  console.log("got addr");
  var querystring = {
        "zws-id": zwsid,
        address: req.query.address,
        citystatezip:
          req.query.addressSearchType === "zipcode"
            ? req.query.zipcode
            : req.query.city + ", " + req.query.state,
        rentzestimate: req.query.rentOrBuy === "buy" ? "false" : "true"
      };
  //get XML from zillow
  request(
    {
      method: "GET",
      url: "http://www.zillow.com/webservice/GetDeepSearchResults.htm",
      qs: querystring,
    },
    
  //convert
    function(err, body) {
      //console.log(err,body.body);
      parseString(body.body, {explicitArray: false},function(err, result) {
        console.dir(result);
        res.json(result);
      });
    }
  );

});

// sassMiddleware = require("node-sass-middleware");
// //console.log(__dirname);
// app.use(sassMiddleware({
//   src: __dirname + '/public',
//   dest: __dirname + '/public/css'
//   //,debug: true,
//   //outputStyle: 'compressed',
// }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.info(`Node Version: ${process.version}`);
  console.log(
    "Trello Power-Up Server listening on port " + listener.address().port
  );
});
