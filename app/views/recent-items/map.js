function parseTwitterDate(text) {
	if (!Date.prototype.toISOString) {
			//with luck it should do this once only - if at all
		    Date.prototype.toISOString = function() {
	        function pad(n) { return n < 10 ? '0' + n : n }
	        return this.getUTCFullYear() + '-'
	            + pad(this.getUTCMonth() + 1) + '-'
	            + pad(this.getUTCDate()) + 'T'
	            + pad(this.getUTCHours()) + ':'
	            + pad(this.getUTCMinutes()) + ':'
	            + pad(this.getUTCSeconds()) + 'Z';
	    };
	}
	var newtext = text.replace(/(\+\S+) (.*)/, '$2 $1')
	var date = new Date(Date.parse(newtext)); 
	return date.toISOString();
};

String.prototype.linkify = function() {
    return this.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/, function(m) {
           return m.link(m);
   });
};

map = function(doc) {
    if ((doc.doc_type=="tweet") &&
    	((doc.geo)||(doc.coordinates)))
    {
        var timestamp = parseTwitterDate(doc.created_at);
        var bar_names_arr = [];
        var bar_names;
        if (doc.bars) {
        	doc.bars.forEach(function(bar) {
        		bar_names_arr.push(bar.name);
        	});
        	bar_names = bar_names_arr.join(",");
        } else if (doc.bar) {
        	bar_names = doc.bar.name;
        }
        else {
        	bar_names = null;
        }
        var geo_lat = doc.geo.coordinates[0];
        var geo_lon = doc.geo.coordinates[1];
        // all messages sorted by timestamp
        key = []
        key.push(timestamp)
  
        var p = doc.user || {};
        emit(key, {
        	linkified_text: doc.text.linkify(),
            tweet_id : doc.id_str,
            screen_name : p.screen_name,
            name : p.name,
            timestamp: timestamp,
            user_profile_image_url: p.profile_image_url,
            created_at: doc.created_at,
            geo_lat: geo_lat,
            geo_lon: geo_lon,
            doc_id: doc._id,
            bar_names: bar_names
        });
    }
}