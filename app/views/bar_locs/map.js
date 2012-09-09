map = function(doc) {
    if (doc.doc_type=="bar" &&
    	doc.location.geo_accuracy >= 8)
    {
        // all bars sorted by location accuracy
        key = []
        key.push(doc.rough_location); //yelp query from whence it came
        key.push(doc.location.coordinate.latitude); 
        key.push(doc.location.coordinate.longitude);
        key.push(doc.id); //yelp id
        key.push(doc.name);
        emit(key, doc);
    }
}