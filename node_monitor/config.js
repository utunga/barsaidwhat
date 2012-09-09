var config = exports;

// twitter api stuff
config.twitterapi = {}
token_dummy = 'the node monitor ./bin/config.js needs editing';
config.twitterapi.consumer_key = token_dummy;
config.twitterapi.consumer_secret = token_dummy; 
config.twitterapi.access_token_key = token_dummy; 
config.twitterapi.access_token_secret = token_dummy; 
	
// to make it go, replace the next line with your actual keys... (no, these are not real keys)
//		 config.twitterapi.consumer_key = 'kldf98723jkldsf092',
//		 config.twitterapi.consumer_secret = 'opdf092klljkdsf092hjlkjdfs908rjer09eflkej',
//		 config.twitterapi.access_token_key = 'jkds90209jdsf980sadf908jdsljkasd908098e3',
//		 config.twitterapi.access_token_secret = '89023LJKDSJLKSDAF098JKL09as098sdljk38e'

config.yelp = {}
config.yelp.consumer_key = token_dummy
config.yelp.consumer_secret = token_dummy 
config.yelp.access_token_key = token_dummy 
config.yelp.access_token_secret = token_dummy 
	
// to make it go, replace the next line with your actual keys... (no, these are not real keys)
//		 config.yelp.consumer_key = 'kldf98723jkldsf092',
//		 config.yelp.consumer_secret = 'opdf092klljkdsf092hjlkjdfs908rjer09eflkej',
//		 config.yelp.access_token_key = 'jkds90209jdsf980sadf908jdsljkasd908098e3',
//		 config.yelp.access_token_secret = '89023LJKDSJLKSDAF098JKL09as098sdljk38e'

// couchdb stuff
config.couchdb = {}

// default server for dev, or, eg 'http://username:pass@username.cloudant.com
config.couchdb.server = 'http://localhost:5984';
config.couchdb.db = 'pub'; //pub being nz for 'bar'

// geo stuff
config.geo = {}

//fwiw i had the devil of a time getting wellington_bounding_box right 
// i think maybe twitter gives you a rude little 406 error if the region is too small?
config.geo.wlg_bounding_box = '174.41,-41.28,175.3,-40.9'
config.geo.nyc_rough_box = '-74,40,-73,41'

// includes everywhere in manhattan south of 79 most of bkln bars, some of queens. sorry weehawken.. 
// mmm actually stupid twitter seems to be pretty damn rough about this - getting stuff from way out on long island..  grr i dunno!
config.geo.nyc_bar_box = '-74.01772499084473,40.67849001723122,-73.91421318054199,40.778396646386895'

//failed region (too small?)
// t.stream('statuses/filter', {'locations':'174.97,-41.20,174.63,-41.36'} , function( stream ) {

// manhattan bounding box i think..
// t.stream('statuses/filter', {'locations':'-42,174,-41,175'}, function (stream) {

config.geo.match_by_digits_accurate = 8;
//[40.789253,-73.81429] -> "+40.7,-73.8" == accuracy 5
//[40.789253,-73.81429] -> "+40.789,-73.814" == accuracy 7


