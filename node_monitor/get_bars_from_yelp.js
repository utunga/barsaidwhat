var nano = require('nano')
var config = require('./config')

var yelp = require("yelp").createClient({
	consumer_key: config.yelp.consumer_key,
	consumer_secret: config.yelp.consumer_secret,
	token: config.yelp.access_token_key,
	token_secret: config.yelp.access_token_secret
});


//set up couchdb stuff.. 
nano = nano(config.couchdb.server);
var db = nano.use(config.couchdb.db);


// See http://www.yelp.com/developers/documentation/v2/search_api
// unfortunately, Wellington just gives a Yelp "not supported location" error
["Manhattan", "Brooklyn", "Queens"].forEach(function(location)  
{
  yelp.search({term: "bars", location: location + ", New York"}, function(error, data) {
	  console.log("Yelp search for bars in " + location);
	  if (error) 
	  {
		  console.log(error);
	  }
	  else
	  {
		  console.log(data.total + " businesses found");
		  limit = 10;
		  offset = 0;
		  for (var i = 0; i <= 100; i++)  // max limit from yelp is 1000
		  {
			  offset = i*limit;
			  yelp.search({term: "bars", location: location + ", New York", limit: limit, offset:offset}, function(error, data) {
				  if (error) 
				  {
					  console.log(error);
				  }
				  else
				  {
					  data.businesses.forEach(function(bar) 
					  {		  
				  		console.log(bar.name); 
				  		console.log(bar.location.coordinate);
				  		if ((bar.location) && (bar.location.coordinate)) {
				  			bar_doc_id = "bar_yelp_" + bar.id;
				  			bar.rough_geo = "nyc";
				  			bar.rough_location = location;
				  			bar.doc_type = "bar";
				  			bar.doc_type_version = "0.1";
				  			
				  			// this is one time only deal - throws errors when  you try to insert again, but i guess that's OK
				  			db.insert(bar, { doc_name: bar_doc_id },
			  					function (error,http_body,http_headers) {
				  					if(error) 
				  					{
				  						if (error.error=="conflict")
				  						{
				  							return console.log("document update conflict, bar already exists" + bar_doc_id)
				  						}
				  						else
				  						{
				  							return console.log(error); 
				  						}
				  					}
				  					console.log(http_body);
				  					console.log("added " + bar.name);
				  			});
				  		}
					  });
					  console.log("-------");
				  }
			  });
		  }
	  }
	});
});

// See http://www.yelp.com/developers/documentation/v2/business
//yelp.business("yelp-san-francisco", function(error, data) {
//  console.log(error);
//  console.log(data);
//});