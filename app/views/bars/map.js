map = function(doc) {
    if (doc.doc_type=="bar")
    {
        
        // all bars sorted by location accuracy
        key = []
        key.push(doc.rough_location);
        key.push(doc.location.display_address[2]);
//        key.push(doc.location.geo_accuracy);
        key.push(doc.id)
        emit(key, doc);
    }
}