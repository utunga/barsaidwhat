
var nano = require('nano')
    , twitter = require('ntwitter')
    , http = require('http')
    , config = require('./config')
    , bar_range_check = require('./bar_range_check')
var app = module.exports 
  
// set up couchdb stuff.. 
  
nano = nano(config.couchdb.server);
var db = nano.use(config.couchdb.db);

// FIXME add support for auto inserting or updating by tweet_id
//       as it's a *much* more stable way of ensuring you dont get dupes
function insert_doc(doc, tried) {
    db.insert(doc,
      function (error,http_body,http_headers) {
        if(error) {
          if(error.message === 'no_db_file'  && tried < 1) {
            // create database and retry
            return nano.db.create(db_name, function () {
              insert_doc(doc, tried+1);
            });
          }
          else { return console.log(error); }
        }
        console.log(http_body);
    });
 }

// set up ntwitter object..
var t = new twitter({
	consumer_key: config.twitterapi.consumer_key,
	consumer_secret: config.twitterapi.consumer_secret,
	access_token_key: config.twitterapi.access_token_key,
	access_token_secret: config.twitterapi.access_token_secret,
});

// actual program 'loop'..

// bounding box set up in config.js
// this one gets too much data so need to add per-bar filters b4 we use it
var bounding_box = config.geo.nyc_bar_box;
t.stream('statuses/filter',  {'locations': bounding_box}, function(stream) {
  stream.on('data', function (data) {
    data.doc_type = 'tweet';
    data.doc_type_version = '0.7';
    data.rough_geo = 'nyc';
    if ((data.coordinates) && (data.coordinates.coordinates)) {
    	lat = data.geo.coordinates[0];
    	lon = data.geo.coordinates[1];
    } else if ((data.geo) && (data.geo.coordinates)) {
    	lat = data.geo.coordinates[1];
    	lon = data.geo.coordinates[0];    
    }
    else {
    	console.log("nyc: could not find coordinates for " + data);
    	return;
    }
    matching_bars = bar_range_check.bars_matching_loc(lat, lon);
    data.lat = lat;
    data.lon = lon;
    data.bars = matching_bars;
    if (matching_bars) {
    	matching_bars.forEach(function(bar) {
    		console.log("nyc: tweet was near to " + bar.yelp_id);
    	});
    	insert_doc(data,0);
    }
    else {
    	console.log("nyc: tweet coords found but not near a bar")
    }
  });
  stream.on('error', function (protocol, errCode) {
	   //FIXME after code is deployed to nodejitsu you can still access logs... unfortunately
	   //      usual twitter errors doesnt tell you much as to what went wrong
	   console.log('ERROR FROM TWITTER API:' + protocol + ":" + errCode);
  });
  console.log('nyc monitor service started (i hope) ..');
});

var bounding_box = config.geo.wlg_bounding_box;
t.stream('statuses/filter',  {'locations': bounding_box}, function(stream) {
  stream.on('data', function (data) {
    data.doc_type = 'tweet'
    data.doc_type_version = '0.6'
    data.rough_geo = "wlg"
	console.log("wlg tweet: " + data.text);
    insert_doc(data,0);
  });
  stream.on('error', function (protocol, errCode) {
	   //FIXME after code is deployed to nodejitsu you can still access logs... unfortunately
	   //      usual twitter errors doesnt tell you much as to what went wrong
	   console.log('ERROR FROM TWITTER API:' + protocol + ":" + errCode);
  });
  console.log('wlg monitor service started (i hope) ..');
});

// purpose of this dummy listener is just to stop nodejitsu from killing the service with a
// 'Script took too long to listen on a socket' error.. maybe do something with this later anyway
http.createServer().listen(8080);
