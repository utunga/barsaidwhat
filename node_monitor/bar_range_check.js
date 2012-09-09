var bar_range_check = exports;
var nano = require('nano')  
	, config = require('./config')
nano = nano(config.couchdb.server);
var db = nano.use(config.couchdb.db);

var bars = []
var bars_by_loc = {}

//[40.789253,-73.81429] -> "+40.7,-73.8" == accuracy 5
//[40.789253,-73.81429] -> "+40.789,-73.814" == accuracy 7
var digits_accurate = config.geo.match_by_digits_accurate;

db.view('app','bar_locs', { group:true, group_level:5},
	function(err, body) {
		if (err) {
			console.log(err);
			return;
		}
		console.log("loading initial list of bars..")
		bars = []
		body.rows.forEach(function(doc) {
			bar = {}
			bar.rough_loc = doc.key[0];
			bar.lat = doc.key[1];
			bar.lon = doc.key[2];
			bar.yelp_id = doc.key[3];
			bar.name = doc.key[4];
			bar.hash_key = build_hash_key(bar.lat, bar.lon);
			bars.push(bar);
			if (!(bars_by_loc[bar.hash_key]))
				bars_by_loc[bar.hash_key] = [];
			bars_by_loc[bar.hash_key].push(bar);
		});
		console.log(bars.length + " bars.. loaded")
		bar_range_check._loaded = true;
	});

// creates a string to match on - accuracy to about 30 meters 
//[40.789253,-73.81429] -> "+40.7892,-73.8145"
// helpful for searching for locations by hash table key, instead of geo comparisons (much faster this way)
function build_hash_key(lat, lon) {
	lat = (lat>0) ? "+" + lat : "" + lat;
	lon = (lon>0) ? "+" + lon : "" + lon;
	return "" + lat.substring(0,digits_accurate) + "," + lon.substring(0,digits_accurate);
}

bar_range_check.bars_matching_loc = function(lat, lon) {
	if (!bar_range_check._loaded)
		return null;
	var hash_key = build_hash_key(lat, lon);
	console.log(".. test location hash : "+ hash_key);
	return (bars_by_loc[hash_key] === undefined) ? null : bars_by_loc[hash_key] ;	
}

//test code
function test_bar_range_check() {
	console.log("Testing bar range check..");
	var bars = bar_range_check.bars_matching_loc(40.789253,-73.81429);
	if (bar==null) {
		console.log("Bar range check (still) not working - no match near (40.789253,-73.81429)");
		setTimeout(test_bar_range_check, 1000);
	}
	else {
		bars.forEach(function(bar) {
			console.log("Bar range check working! - " + bar.name + " found near (40.789253,-73.81429)");
		});
	}
}

setTimeout(test_bar_range_check, 1000);

