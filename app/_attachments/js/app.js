
// Apache 2.0 J Chris Anderson 2011
$(function() {   
    // friendly helper http://tinyurl.com/6aow6yn
    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    var path = unescape(document.location.pathname).split('/'),
        design = "app",
        db = $.couch.db("pub");
    
    function drawItems() {
        db.view(design + "/recent-items", {
            descending : "true",
            reduce: false,
            limit : 30,
            update_seq : true,
            success : function(data) {
                setupChanges(data.update_seq);
                var them = $.mustache($("#recent-messages").html(), {
                    items : data.rows.map(function(r) {return r.value;})
                });
                $("#main_content").html(them);
                fix_relative_times();
            }
        });
    };
    
    drawItems();
    var changesRunning = false;
    function setupChanges(since) {
        if (!changesRunning) {
            var changeHandler = db.changes(since);
            changesRunning = true;
            changeHandler.onChange(drawItems);
        }
    }
//    $.couchProfile.templates.profileReady = $("#new-message").html();
//    $("#account").couchLogin({
//        loggedIn : function(r) {
//            $("#profile").couchProfile(r, {
//                profileReady : function(profile) {
//                    $("#create-message").submit(function(e){
//                        e.preventDefault();
//                        var form = this, doc = $(form).serializeObject();
//                        doc.created_at = new Date();
//                        doc.profile = profile;
//                        db.saveDoc(doc, {success : function() {form.reset();}});
//                        return false;
//                    }).find("input").focus();
//                }
//            });
//        },
//        loggedOut : function() {
//            $("#profile").html('<p>Please log in to see your profile.</p>');
//        }
//    });
 });



//helper functions

function fix_relative_times() {
	$("#main_content .created_at_time").each(function(index) {
		// inner text starts out (after mustache template) as tweet.created_date
		// convert this to a relative time (inside browser for obvious reasons)
		$(this).text(relative_time($(this).text()));
	});
	
}


function relative_time(time_value) {
	var values = time_value.split(" ");
	time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
	var parsed_date = Date.parse(time_value);
	var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
	var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
	delta = delta + (relative_to.getTimezoneOffset() * 60);
	
	var r = '';
	if (delta < 60) {
	      r = 'a minute ago';
	} else if(delta < 120) {
	      r = 'couple of minutes ago';
	} else if(delta < (45*60)) {
	      r = (parseInt(delta / 60)).toString() + ' minutes ago';
	} else if(delta < (90*60)) {
	      r = 'an hour ago';
	} else if(delta < (24*60*60)) {
	      r = '' + (parseInt(delta / 3600)).toString() + ' hours ago';
	} else if(delta < (48*60*60)) {
	      r = '1 day ago';
	} else {
	      r = (parseInt(delta / 86400)).toString() + ' days ago';
	}
	return r;
};

