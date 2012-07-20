
var Client = {
	connection: null,
	roster: new Array(),
	subscribe: new Array(),
	subscribed: new Array(),
	my_full_jid: new String(),
	
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
		
		// everyone in roster except me is shown as offline till presence is received
		jQuery('.friends_column_wrapper').each(function () {
			if (jQuery(this)[0].className.search('me') == -1) {
				Client.replace_contact(jQuery(this)[0], false);
			}
		});
	},
	
	on_presence_subscribe: function (presence) {	
		var from = jQuery(presence).attr('from');
		var from_bare = Strophe.getBareJidFromJid(from);
		
		// do nothing if received data is not from course members
		if (Client.check_membership(from_bare) == false) {
			console.log("presence subscribe from non-member: " + from_bare);
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
			console.log("presence subscribed from non-member: " + from_bare);
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
		//console.log('from: ' + from + '  to: ' + jQuery(presence).attr('to') + '  ptype: ' + ptype + '  show: ' + jQuery(presence).find("show").text());
		
		if (Client.my_full_jid == '') {
			Client.my_full_jid = jQuery(presence).attr('to');
			Client.connection.send($pres().c('show').t(Client.my_full_jid));
		}
		
		// do nothing if received data is not from course members
		if (Client.check_membership(from_bare) == false) {
			console.log("presence from non-member: " + from_bare);
			return true;
		}

		if (ptype !== 'error' && from_bare != to_bare) {
			var contact = document.getElementById(from_bare);
			if (jQuery(presence).find("show").text() == from) {
				jQuery("div").filter(contact).data('full_jid', from);
				//console.log('!!! put ' + from);
			}
			
			if (ptype === 'unavailable' && jQuery("div").filter(contact).data('full_jid') == from) {
				// ATutor chat user
				//console.log(from_bare + ' unavailable from ATutor chat');
				online = false;
			} else if (ptype === 'unavailable' && jQuery("div").filter(contact).data('full_jid') == undefined) {
				// other client user
				//console.log(from_bare + ' unavailable from other client');
				online = false;
			} else {
				var show = jQuery(presence).find("show").text();
				if (show === "" || show === "chat") {
					//console.log(from_bare + ' online');
					online = true;
				} else {
					//console.log(from_bare + ' away');
					online = true;
				}
			}			
			Client.replace_contact(contact, online);	
		}

		// reset addressing for user since their presence changed
		var jid_id = Client.jid_to_id(from);
		jQuery('#chat_' + jid_id).data('jid', Strophe.getBareJidFromJid(from));
		
		return true;
	},
	
	on_message: function (message) {		
		var from = jQuery(message).attr('from');
		var from_bare = Strophe.getBareJidFromJid(from);
		var jid_id = Client.jid_to_id(from_bare);
		var sender_name = jQuery("div").filter(document.getElementById(from_bare)).find('.friends_item_name').text();
		
		// do nothing if received data is not from course members
		if (Client.check_membership(from_bare) == false) {
			console.log("message from non-member: " + from_bare);
			return true;
		}
		
		if (jQuery('#chat_' + jid_id).length !== 0){
			var composing = jQuery(message).find('composing');
			if (composing.length > 0) {
				jQuery('#chat_' + jid_id + ' .chat_messages').parent().find('.chat_event').text(sender_name + ' started typing...');
			}
			
			var paused = jQuery(message).find('paused');
			if (paused.length > 0) {
				jQuery('#chat_' + jid_id + ' .chat_messages').parent().find('.chat_event').text();
			}
		}


		var body = jQuery(message).find("html > body");

		if (body.length === 0) {
			body = jQuery(message).find('body');
			if (body.length > 0) {
				body = body.text()
			} else {
				body = null;
			}
		} else {
			body = body.contents();
			var span = jQuery("<span></span>");
			body.each(function () {
				if (document.importNode) {
					jQuery(document.importNode(this, true)).appendTo(span);
				} else {
					// IE workaround
					span.append(this.xml);
				}
			});

			body = span;
		}

		if (body) {
			if (jQuery('#chat_' + jid_id).length === 0) {
				jQuery('#subtabs').tabs('add', '#chat_' + jid_id, sender_name);
				jQuery('#chat_' + jid_id).append(
					"<div class='chat_messages'></div><hr/>" +
					"<table class='conversations_table'><tr>" +
						"<td class='conversations_table_spacer'></td>" +
						"<td><div class='chat_event'></div><textarea class='conversations_textarea' id='text_" + from_bare + "'></textarea></td>" +
						"<td class='conversations_table_button'><input class='conversations_send' type='button' label='submit' value='Send'/></td>" +
					"</tr></table>");
			}
			jQuery('#chat_' + jid_id).data('jid', from);
			//console.log('msg: got new res - ' + from);
			
			jQuery('#subtabs').tabs('select', '#chat_' + jid_id);
			jQuery('#chat_' + jid_id + ' textarea').focus();
			
			// remove notifications since user is now active
			jQuery('#chat_' + jid_id + ' .chat_messages').parent().find('.chat_event').text('');

			// add the new message
			var sender_img_src = jQuery("div").filter(document.getElementById(from_bare)).find('.friends_item_picture').attr("src");
			var sender_id = document.getElementById(from_bare).getElementsByTagName('table')[0].id;	
			var timestamp = +new Date;		
			jQuery('#chat_' + jid_id + ' .chat_messages').append(
						"<hr/><table><tr>" + 
         					"<td  class='conversations_picture'>" + 
                            "<img class='picture' src='" + sender_img_src + "' alt='userphoto'/>" + 
                        	"</td>" + 
                        	
                        	"<td  class='conversations_middle'>" + 
                        	"<label class='conversations_name'><a href='profile.php?id=" + sender_id + "'>" + sender_name + "</a></label>" + 
                        	"<div class='conversations_msg'>" + body + 
							"</div>" + 
                        	"</td>" + 
                        	
                        	"<td class='conversations_time'>" + 
                        	"<span><nobr>" + moment(timestamp).format('HH:mm:ss') + "</nobr></span> " +                            
                        	"</td>" + 
                        "</tr></table>");
                        
            // make db entry for message
            Client.message_to_db(from_bare, Strophe.getBareJidFromJid(jQuery(message).attr('to')), body, timestamp);

			Client.scroll_chat(jid_id);
		}
		return true;
	},
	
	
	// logs
	log: function (msg) {
		jQuery('#log').append("<p>" + msg + "</p>");
	},
	
	clear_log: function (){
		jQuery('#log').empty();
	},
	
		
	// helpers
	replace_contact: function (elem, online) {
		if (online == true){
			group_el = jQuery('.online');
			group = 'online';
			group_other = 'offline';
			
			if (elem.className.search('me') > 0) {
				elem.className = "friends_column_wrapper online me";
			} else {
				elem.className = "friends_column_wrapper online";
			}
			jQuery("div").filter(elem).find("td")[2].textContent = "Online";
		} else {
			group_el = jQuery('.offline');
			group = 'offline';
			group_other = 'online';
			
			if (elem.className.search('me') > 0) {
				elem.className = "friends_column_wrapper offline me";
			} else {
				elem.className = "friends_column_wrapper offline";
			}			
			jQuery("div").filter(elem).find("td")[2].textContent = "";
		}
		
		jQuery('#roster')[0].removeChild(elem);

		if (group_el.length > 0) {
			//console.log('1');			
			var name = elem.getElementsByTagName("td")[1].textContent;
			var inserted = false;
			group_el.each(function () {
				var cmp_name = jQuery(this).find('.friends_item_name')[0].textContent;
				//console.log('name: '+ name + 'cmp_name: ' + cmp_name);
				//console.log(name < cmp_name);
				if (name < cmp_name) {
					jQuery(this).before(elem);
					inserted = true;
					return false;
				}
			});
			if (!inserted) {
				//console.log('2');	
				// insert after last element of group
				jQuery('.' + group).last().after(elem);
			}
		} else {
			if (group == 'online'){
				//console.log('3');	
				jQuery('.' + group_other).first().before(elem);
			} else if (group == 'offline'){
				//console.log('4');	
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
				var cmp_name = jQuery(this).find('.friends_item_name')[0].textContent;
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
			url: "ATutor/mods/chat_new/ajax/check_membership.php",
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
	
	message_to_db: function (from, to, msg, timestamp) {
		var dataString = 'from=' + from + '&to=' + to + '&msg=' + msg + '&timestamp=' + timestamp;
		jQuery.ajax({
			type: "POST",
			url: "ATutor/mods/chat_new/ajax/new_message.php",
			data: dataString,
			cache: false,
			success: function (returned) {
				if (returned != 1) {
					console.log('An error while saving message into database occured.');
				}
			},
			error: function (xhr, errorType, exception) {
			    console.log("error: " + exception);
			}		
		});
	}, 
	
	jid_to_id: function (jid) {
		return Strophe.getBareJidFromJid(jid)
			.replace(/@/g, "-")
			.replace(/\./g, "-");
	},
	
	scroll_chat: function (jid_id) {
		var div = jQuery('#chat_' + jid_id + ' .chat_messages').get(0);
		div.scrollTop = div.scrollHeight;
	},

	disconnect: function () {
		Client.connection.sync = true; // Switch to using synchronous requests since this is typically called onUnload.
	    Client.connection.flush();
	    Client.connection.disconnect();
	    return false;
	}
};

jQuery(window).unload(function() {
  Client.disconnect();
});

// connection
jQuery(document).bind('connect', function (ev, data) {
	// get value from cookies 
	temp = jQuery.cookie("connection");
	var cookie_conn = JSON.parse(temp);
	
	if (cookie_conn != null){
		var conn = new Strophe.Connection("http://bosh.metajack.im:5280/xmpp-httpbind");	
			
		conn.xmlInput = function (body) {
		    Console.show_traffic(body, 'incoming');
		};
		conn.xmlOutput = function (body) {
		    Console.show_traffic(body, 'outgoing');
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
						url: "ATutor/mods/chat_new/ajax/check_auth.php",
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


// XMPP statuses
jQuery(document).bind('connected', function (event, course_members_jids) {
	console.log("Connection established.");	
	
    var iq_roster = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
    Client.connection.sendIQ(iq_roster, Client.on_roster);
    Client.connection.addHandler(Client.on_message, null, "message", "chat");
    
    // send subscription request to all course members (on first login course_members_jids.length > 0)
    if (course_members_jids.length > 0) {
    	for (i = 0; i < course_members_jids.length; ++i) {
		    console.log("will send to " + course_members_jids[i]);
			Client.connection.send($pres({
				to: course_members_jids[i],
				"type": "subscribe"}));
		}
	}    
	
	jQuery('#buttonbar').find('input').removeAttr('disabled');
    jQuery('#console_input').removeClass('disabled').removeAttr('disabled');
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
	
	jQuery('#buttonbar').find('input').attr('disabled', 'disabled');
    jQuery('#console_input').addClass('disabled').attr('disabled', 'disabled');
	document.body.style.cursor = "auto";
});

