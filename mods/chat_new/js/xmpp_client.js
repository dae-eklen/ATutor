
var Client = {
	connection: null,
	roster: new Array(),
	subscribe: new Array(),
	subscribed: new Array(),
	
	// handlers
	on_roster: function (iq) {
		jQuery(iq).find('item').each(function () {
			var jid = jQuery(this).attr('jid');
			if (jid != '[object object]') {
				Client.roster.push(jid);
			}
		});
		console.log('roster: ' + Client.roster);
		
		// set up presence handler and send initial presence
		Client.connection.addHandler(Client.on_presence, null, "presence");
		Client.connection.addHandler(Client.on_presence_subscribe, null, "presence", "subscribe");
		Client.connection.addHandler(Client.on_presence_subscribed, null, "presence", "subscribed");
		Client.connection.send($pres());
	},
	/*
	 <message to='dae-eklen@talkr.im'
type='chat'>
<body>Come, Darcy, I must have you dance. I hate to see you standing about by
yourself in this stupid manner. You had much better dance.</body>
</message>

<presence 
to='dae-eklen@talkr.im'
type='subscribe'/>

	 */
	
	on_presence_subscribe: function (presence) {	
		var from = jQuery(presence).attr('from');
		var from_bare = Strophe.getBareJidFromJid(from);
		
		// do nothing if received data is not from course members
		if (Client.check_membership(from_bare) == false) {
			console.log("presence from non-member: " + from_bare);
			return;
		}
		
			console.log('subscribe - ' + from);
			if (jQuery.inArray(from_bare, Client.subscribe) == -1 && jQuery.inArray(from_bare, Client.subscribed) > -1) {
				// i initiated, finishing subscription
				// auto approve
				Client.connection.send($pres({
					to: from,
					"type": "subscribed"}));
				Client.subscribe.push(from_bare);				
				
			} else if (jQuery.inArray(from_bare, Client.subscribe) == -1 && jQuery.inArray(from_bare, Client.subscribed) == -1) {
				// he initiated, starting
				// auto approve
				Client.connection.send($pres({
					to: from,
					"type": "subscribed"}));
				Client.connection.send($pres({
					to: from,
					"type": "subscribe"}));
				Client.subscribe.push(from_bare);
			}
			
			if (jQuery.inArray(from_bare, Client.subscribe) > -1 && jQuery.inArray(from_bare, Client.subscribed) > -1) {
				// remove
				removeItem = from_bare;
				Client.subscribe = jQuery.grep(Client.subscribe, function(value) {
					return value != removeItem;
				});
				Client.subscribed = jQuery.grep(Client.subscribed, function(value) {
					return value != removeItem;
				});
				
				Client.roster.push(from_bare);
				console.log("just added- " + Client.roster);
			}
			
			console.log("Client.subscribed- " + Client.subscribed + "; Client.subscribe-" + Client.subscribe);
	},
	
	on_presence_subscribed: function (presence) {
		var from = jQuery(presence).attr('from');
		var from_bare = Strophe.getBareJidFromJid(from);
		
		// do nothing if received data is not from course members
		if (Client.check_membership(from_bare) == false) {
			console.log("presence from non-member: " + from_bare);
			return;
		}
		
			console.log('subscribed - ' + from);
			if (jQuery.inArray(from_bare, Client.subscribe) > -1 && jQuery.inArray(from_bare, Client.subscribed) == -1) {
				// he initiated, finishing subscription
				Client.connection.send($pres({
					to: from,
					"type": "subscribe"}));
				Client.subscribed.push(from_bare);
				
			} else if (jQuery.inArray(from_bare, Client.subscribe) == -1 && jQuery.inArray(from_bare, Client.subscribed) == -1) {
				// i initiated
				Client.subscribed.push(from_bare);
			}
			
			if (jQuery.inArray(from_bare, Client.subscribe) > -1 && jQuery.inArray(from_bare, Client.subscribed) > -1) {
				// remove
				removeItem = from_bare;
				Client.subscribe = jQuery.grep(Client.subscribe, function(value) {
					return value != removeItem;
				});
				Client.subscribed = jQuery.grep(Client.subscribed, function(value) {
					return value != removeItem;
				});
				
				Client.roster.push(from_bare);
				console.log("just added- " + Client.roster);
			}
			
			console.log("Client.subscribed- " + Client.subscribed + "; Client.subscribe-" + Client.subscribe);
	},
	
	on_presence: function (presence) {
		var ptype = jQuery(presence).attr('type');
		var from = jQuery(presence).attr('from');
		var from_bare = Strophe.getBareJidFromJid(from);
		var to_bare = Strophe.getBareJidFromJid(jQuery(presence).attr('to'));
		
		// do nothing if received data is not from course members
		if (Client.check_membership(from_bare) == false) {
			console.log("presence from non-member: " + from_bare);
			return;
		}

		if (ptype !== 'error' && from_bare != to_bare) {
			var contact = document.getElementById(from_bare);
			if (ptype === 'unavailable') {
				console.log(from_bare + ' unavailable');
				online = false;
			} else {
				var show = jQuery(presence).find("show").text();
				if (show === "" || show === "chat") {
					console.log(from_bare + ' online');
					online = true;
				} else {
					console.log(from_bare + ' away');
					online = true;
				}
			}			
			Client.replace_contact(contact, online);	
		}

		return true;
	},
	
	
	
	
	
	// helpers
	replace_contact: function (elem, online) {
		if (online == true){
			group_el = jQuery('.online');
			group = 'online';
			group_other = 'offline';
			
			elem.className = "friends_column_wrapper online";
			elem.getElementsByTagName("td")[2].innerHTML = "Online";
		} else {
			group_el = jQuery('.offline');
			group = 'offline';
			
			elem.className = "friends_column_wrapper offline";
			elem.getElementsByTagName("td")[2].innerHTML = "";
		}
		
		jQuery('#roster')[0].removeChild(elem);

		if (group_el.length > 0) {			
			var name = elem.getElementsByTagName("td")[1].innerText;
			var inserted = false;
			group_el.each(function () {
				var cmp_name = jQuery(this).find('.friends_item_name')[0].innerText;
				if (name < cmp_name) {
					jQuery(this).before(elem);
					inserted = true;
				}
			});
			if (!inserted) {
				// insert after last element of group
				jQuery('.' + group).last().after(elem);
			}
		} else {
			if (group == 'online'){
				jQuery('.' + group_other).first().before(elem);
			} else if (group == 'offline'){
				jQuery('.' + group_other).last().after(elem);
			}
		}
	},
	
	show_new_contact: function (jid, name, pic) {
		group_el = jQuery('.online');
		to_insert = "<div class='friends_column_wrapper online' id=" + jid + " onclick='console.log(jQuery(this).attr('id'));'>" + 
	                    	"<table class='friends_item'><tr>" + 
	         					"<td><img class='friends_item_picture' src='" + pic + "' alt='userphoto'/></td>" +
	                        	"<td class='friends_item_name'>" + name + "</td>" + 
	                        	"<td class='friends_item_status'>Online</td>" +
	                    	"</tr></table>" + 
	              		"</div>";
		if (group_el.length > 0) {
			var inserted = false;
			group_el.each(function () {
				var cmp_name = jQuery(this).find('.friends_item_name')[0].innerText;
				if (name < cmp_name) {
					jQuery(this).before(to_insert);
					inserted = true;
				}
			});

			if (!inserted) {
				// insert after last element of group
				jQuery('.' + 'online').last().after(to_insert);
			}
		} else {
			jQuery('.' + 'offline').first().before(to_insert);
		}
	},
	
	check_membership: function (jid) {
		var dataString = 'jid=' + jid;
		jQuery.ajax({
			type: "POST",
			url: "ATutor/mods/chat_new/check_membership.php",
			data: dataString,
			cache: false,
			success: function (returned) {
				if (returned == 1){
					return true;
				} else {
					return false;
				}
			},
			error: function (xhr, errorType, exception) {
			    console.log("error: " + exception);
			}		
		});
	},
	
	
	
	
	// console-related methods
	log: function (msg) {
		jQuery('#log').append("<p>" + msg + "</p>");
	},
	
	clear_log: function (){
		jQuery('#log').empty();
	},
	
	show_traffic: function (body, type) {
        if (body.childNodes.length > 0) {
            var console = jQuery('#console').get(0);
            var at_bottom = console.scrollTop >= console.scrollHeight - console.clientHeight;

            jQuery.each(body.childNodes, function () {
                jQuery('#console').append("<div class='" + type + "'>" + 
                                     Client.pretty_xml(this) +
                                     "</div>");
            });

            if (at_bottom) {
                console.scrollTop = console.scrollHeight;
            }
        }
    },

    pretty_xml: function (xml, level) {
        var i, j;
        var result = [];
        if (!level) { 
            level = 0;
        }

        result.push("<div class='xml_level" + level + "'>");
        result.push("<span class='xml_punc'>&lt;</span>");
        result.push("<span class='xml_tag'>");
        result.push(xml.tagName);
        result.push("</span>");

        // attributes
        var attrs = xml.attributes;
        var attr_lead = []
        for (i = 0; i < xml.tagName.length + 1; i++) {
            attr_lead.push("&nbsp;");
        }
        attr_lead = attr_lead.join("");

        for (i = 0; i < attrs.length; i++) {
            result.push(" <span class='xml_aname'>");
            result.push(attrs[i].nodeName);
            result.push("</span><span class='xml_punc'>='</span>");
            result.push("<span class='xml_avalue'>");
            result.push(attrs[i].nodeValue);
            result.push("</span><span class='xml_punc'>'</span>");

            if (i !== attrs.length - 1) {
                result.push("</div><div class='xml_level" + level + "'>");
                result.push(attr_lead);
            }
        }

        if (xml.childNodes.length === 0) {
            result.push("<span class='xml_punc'>/&gt;</span></div>");
        } else {
            result.push("<span class='xml_punc'>&gt;</span></div>");

            // children
            jQuery.each(xml.childNodes, function () {
                if (this.nodeType === 1) {
                    result.push(Client.pretty_xml(this, level + 1));
                } else if (this.nodeType === 3) {
                    result.push("<div class='xml_text xml_level" + 
                                (level + 1) + "'>");
                    result.push(this.nodeValue);
                    result.push("</div>");
                }
            });
            
            result.push("<div class='xml xml_level" + level + "'>");
            result.push("<span class='xml_punc'>&lt;/</span>");
            result.push("<span class='xml_tag'>");
            result.push(xml.tagName);
            result.push("</span>");
            result.push("<span class='xml_punc'>&gt;</span></div>");
        }
        
        return result.join("");
    },

    text_to_xml: function (text) {
        var doc = null;
        if (window['DOMParser']) {
            var parser = new DOMParser();
            doc = parser.parseFromString(text, 'text/xml');
        } else if (window['ActiveXObject']) {
            var doc = new ActiveXObject("MSXML2.DOMDocument");
            doc.async = false;
            doc.loadXML(text);
        } else {
            throw {
                type: 'PeekError',
                message: 'No DOMParser object found.'
            };
        }

        var elem = doc.documentElement;
        if (jQuery(elem).filter('parsererror').length > 0) {
            return null;
        }
        return elem;
    }
};


// console buttons
function console_disconnect() {
	/*if (Client.roster.length > 0) {
    	for (i = 0; i < Client.roster.length; ++i) {
		    console.log("will send unavailable to " + Client.roster[i]);
			Client.connection.send($pres({
				to: Client.roster[i],
				"type": "unavailable"}));
		}
	}*/ 
	Client.connection.disconnect();
	return false;
}

function console_send() {
        var input = jQuery('#input').val();
        var error = false;
        if (input.length > 0) {
            if (input[0] === '<') {
                var xml = Client.text_to_xml(input);
                if (xml) {
                    Client.connection.send(Strophe.copyElement(xml));
                    jQuery('#input').val('');
                } else {
                    error = true;
                }
            } else if (input[0] === '$') {
                try {
                    var builder = eval(input);
                    Client.connection.send(builder);
                    jQuery('#input').val('');
                } catch (e) {
                    console.log(e);
                    error = true;
                }
            } else {
                error = true;
            }
        }

        if (error) {
            jQuery('#input').animate({backgroundColor: "#faa"});
        }
}

jQuery('#input').keypress(function () {
	jQuery(this).css({backgroundColor: '#fff'});
});


// logging in
function connect(jid, pass) {
	Client.clear_log();
	document.body.style.cursor = "wait";
	if (jid==null && pass==null){
		jQuery(document).trigger('connect', {
			jid: jQuery('#welcome_form_jid').val() + "@" + jQuery('#welcome_form_select').val(),
			password: jQuery('#welcome_form_pass').val(),
			id: jQuery('#welcome_form_member_id').val()
		});
	} else {
		jQuery(document).trigger('connect', {
			jid: jid,
			password: pass
		});
	} 
	//jQuery('#welcome_form_pass').val('');
}

// connection
jQuery(document).bind('connect', function (ev, data) {
	// get value from cookies 
	temp = jQuery.cookie("connection");
	var cookie_conn = JSON.parse(temp);
	
	if (cookie_conn != null){
		var conn = new Strophe.Connection("http://bosh.metajack.im:5280/xmpp-httpbind");	
			
		conn.xmlInput = function (body) {
		    Client.show_traffic(body, 'incoming');
		};
		conn.xmlOutput = function (body) {
		    Client.show_traffic(body, 'outgoing');
		};
		    
		conn.connect(data.jid, data.password, function (status) {
			if (status === Strophe.Status.CONNECTED) {
				var course_members_jids = new Array();
				if (data.id != undefined){
					// make db entry if not exists yet
					var course_id = jQuery('#chat')[0].getElementsByTagName("div")[0].id;
					var dataString = 'id=' + data.id + '&jid=' + data.jid + '&pass=' + data.password + '&course_id=' + course_id;
					jQuery.ajax({
						type: "POST",
						url: "ATutor/mods/chat_new/check_auth.php",
						data: dataString,
						cache: false,
						success: function (returned) {
							if (returned == 0){
								console.log('Error: Cannot insert!!.');
								
							} else {
								document.getElementById('welcome').style.display = 'none';
								jQuery('#chat').show();
								
								// add div to side box menu
								var data = returned.split(' ');
								var jid = data[0];
								var name = data[1] + ' ' + data[2];
								var pic = data[3];
								Client.show_new_contact(jid, name, pic);
								
								course_members_jids = data.slice(4, data.length);
								console.log(course_members_jids);
								
								jQuery(document).trigger('connected', [course_members_jids]);
							}
				        },
				        error: function (xhr, errorType, exception) {
				            console.log("error: " + exception);
				        }		
					});
				} else {
					// store connection into cookies for later use
					var json_text = JSON.stringify(conn);
					jQuery.cookie("connection", json_text, {expires:365});		
					
					jQuery(document).trigger('connected', [course_members_jids]);
				}
			} 
			else if (status === Strophe.Status.AUTHFAIL) {
				jQuery(document).trigger('authfail');
			} 
			else if (status === Strophe.Status.DISCONNECTED) {
				jQuery(document).trigger('disconnected');
			}
		});
		Client.connection = conn;
		console.log(Strophe.Connection.prototype.isPrototypeOf(conn));
	} else {
		Client.connection = cookie_conn;
		console.log(Strophe.Connection.prototype.isPrototypeOf(conn));
		
		jQuery(document).trigger('connected');
	}
});


// handlers
jQuery(document).bind('connected', function (event, course_members_jids) {
	console.log("Connection established.");	
    var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
    Client.connection.sendIQ(iq, Client.on_roster);
    // Client.connection.addHandler(Client.on_roster_changed, "jabber:iq:roster", "iq", "set");
    // Client.connection.addHandler(Client.on_message, null, "message", "chat");
    
    // send subscription request to all course members (on first login)
    if (course_members_jids.length > 0) {
    	for (i = 0; i < course_members_jids.length; ++i) {
		    console.log("will send to " + course_members_jids[i]);
			Client.connection.send($pres({
				to: course_members_jids[i],
				"type": "subscribe"}));
		}
	}    
	
	jQuery('.button').removeAttr('disabled');
    jQuery('#input').removeClass('disabled').removeAttr('disabled');
	document.body.style.cursor = "auto";
});

jQuery(document).bind('authfail', function () {
	console.log("Authentication failed.");
	Client.log("Authentication failed.");
	// remove dead connection object
	Client.connection = null;
	
	jQuery('.button').attr('disabled', 'disabled');
    jQuery('#input').addClass('disabled').attr('disabled', 'disabled');
	document.body.style.cursor = "auto";
});

jQuery(document).bind('disconnected', function () {
	console.log("Connection terminated.");
	// remove dead connection object
	Client.connection = null;
	
	jQuery('.button').attr('disabled', 'disabled');
    jQuery('#input').addClass('disabled').attr('disabled', 'disabled');
	document.body.style.cursor = "auto";
});

