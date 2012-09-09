
barsaidwhat
===========

**what**

* node.js twitter monitor to find tweets within geo-box and then only keep the ones near bars

* couchdb, couchapp to display tweets near bars

**eh?**

quick and simple app to monitor twitter for tweets tagged in a given bounding box, then further refine the stream to ones near bars and then display them

see <a href="http://barsaidwhat.com">barsaidwhat.com</a> for an example (if its still up)

**to use**

*  install couchdb, node, couchapp
*  edit node_monitor/config.js to add your api keys for yelp, twitter, couchdb config
*  edit node_monitor/config.js to define the bounding box you are interested in (currently NYC and Wellington)
*  run node_monitor/get_bars_from_yelp.js to populate geo locations of bars
* npm install to install dependencies for node_monitor
* cd ./node_monitor; node server.js to run node monitor service
* edit ./app/.couchapprc to define your couchdb settings
* cd ./app; coucahpp push (to create the couchapp)


**to deploy**

currently, the node.js bits are hosted by <a href="http://nodejitsu.com">nodejitsu</a>, and the couchapp bits hosted by <a href="http://cloudant.com">cloudant.com</a> both on free trial/beta versions though so no idea how long this will last.