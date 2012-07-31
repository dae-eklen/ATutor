
var Client = {
	connection: null,
	roster: new Array(),
	subscribe: new Array(),
	subscribed: new Array(),
	my_full_jid: new String(),
	mucs: new Array(),
	
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
				Client.replace_contact(jQuery(this)[0], false, false);
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
		
		if (Client.my_full_jid == '') {
			Client.my_full_jid = jQuery(presence).attr('to');
			Client.connection.send($pres().c('show').t(Client.my_full_jid));
		}
		
		// do nothing if received data is not from course members (for 'chat')
		if (Client.check_membership(from_bare) == false) {
			console.log("presence from non-member: " + from_bare);
			return true;
		}
	
		if (Client.mucs[from_bare] != undefined) {
			// muc presence
			var nick = Strophe.getResourceFromJid(from);
			var from_bare_id = Client.jid_to_id(from_bare);
			
			if (jQuery(presence).attr('type') === 'error' && Client.mucs[from_bare]["joined"] == false) {

				console.log("error joining room; reset app");
			//} else if (Client.mucs[from_bare]["participants"].indexOf(nick) >= 0 && jQuery(presence).attr('type') !== 'unavailable') {
			} else if (jQuery(presence).attr('type') !== 'unavailable' && Client.mucs[from_bare]["nickname"] != nick) {
				// add to participant list
				var user_jid = jQuery(presence).find('item').attr('jid');
				Client.mucs[from_bare]["participants"].push(user_jid);
				if (Client.mucs[from_bare]["joined"] == true) {
					var member_id = jQuery("#roster").find(":contains('" + nick + "')").filter("td").parent().parent().parent().attr("id");
					if (member_id == undefined) {
						var profile_link = nick;
					} else {
						var profile_link = "<a href='profile.php?id=" + member_id + "'>" + nick + "</a>";
					}
					jQuery("#chat_" + from_bare_id).find(".muc_roster ul").append("<li>" + profile_link + "</li>");
				}
				var timestamp = +new Date;
				jQuery('#chat_' + from_bare_id).find('.chat_messages').append("<hr/><div class='notice'>" + moment(timestamp).format('HH:mm:ss ') + nick + " entered the room</div>");
				Client.focus_chat(from_bare_id);
				Client.scroll_chat(from_bare_id);
			//} else if (Client.mucs[from_bare]["participants"].indexOf(nick) >= 0 && jQuery(presence).attr('type') === 'unavailable') {
			} else if (jQuery(presence).attr('type') === 'unavailable' && Client.mucs[from_bare]["nickname"] != nick) {
				// remove from participants list
				var user_jid = jQuery(presence).find('item').attr('jid');
				delete Client.mucs[from_bare]["participants"][Client.mucs[from_bare]["participants"].indexOf(user_jid)];
				jQuery("#chat_" + from_bare_id).find(".muc_roster li").each(function () {
					if (nick === jQuery(this).text()) {
						jQuery(this).remove();
					}
				});
				var timestamp = +new Date;
				jQuery('#chat_' + from_bare_id).find('.chat_messages').append("<hr/><div class='notice'>" + moment(timestamp).format('HH:mm:ss ') + nick + " left the room</div>");
				Client.focus_chat(from_bare_id);
				Client.scroll_chat(from_bare_id);
			}
			
			if (jQuery(presence).attr('type') !== 'error' && Client.mucs[from_bare]["joined"] == false) {
				// check for status 110 to see if it's our own presence
				if (jQuery(presence).find("status[code='110']").length > 0) {
					// check if server changed our nick
					if (jQuery(presence).find("status[code='210']").length > 0) {
						Client.mucs[from_bare]["nickname"] = Strophe.getResourceFromJid(from);
					}
					// check if i'm owner
					if (jQuery(presence).find("item[affiliation='owner']").length > 0) {
						var request_id = Client.connection.muc.configure(from_bare);
						// handle muc config form
						Client.connection.addHandler(Client.on_room_form, null, "iq", "result", request_id);
					}

					// room join complete
					jQuery(document).trigger('room_joined', from_bare);
				}
			}
			
			
			
		} else {
			// contact presence
			
			if (ptype !== 'error' && from_bare != to_bare) {
				var contact_roster = document.getElementById(from_bare);
				if (jQuery(presence).find("show").text() == from) {
					jQuery("div").filter(contact_roster).data('full_jid', from);
				}

				if (ptype === 'unavailable' && jQuery("div").filter(contact_roster).data('full_jid') == from) {
					// ATutor chat user
					//console.log(from + ' unavailable from ATutor chat');
					online = false;
				} else if (ptype === 'unavailable' && jQuery("div").filter(contact_roster).data('full_jid') == undefined) {
					// other client user
					//console.log(from + ' unavailable from other client');
					online = false;
				} else {
					var show = jQuery(presence).find("show").text();
					if (show === "" || show === "chat") {
						//console.log(from + ' online');
						online = true;
					} else {
						//console.log(from + ' away', 'show: ' + show);
						online = true;
					}
				}			
				Client.replace_contact(contact_roster, online);
			}
	
			// reset addressing for user since their presence changed
			var jid_id = Client.jid_to_id(from);
			jQuery('#chat_' + jid_id).data('jid', Strophe.getBareJidFromJid(from));
		}
		
		return true;
	},
	
	on_room_form: function (iq) {
		var from = jQuery(iq).attr('from');
		// var from_bare = Strophe.getBareJidFromJid(from);
// 		
		// var config_array = {
			// "muc#roomconfig_membersonly": 1, 
			// "muc#roomconfig_changesubject": 0, 
			// "allow_private_messages": 0,
			// "muc#roomconfig_allowvisitorstatus": 0,
			// "muc#roomconfig_allowvisitornickchange": 0,
			// "muc#roomconfig_allowvoicerequests": 0
		// };
		//console.log(Client.connection.muc.saveConfiguration(from_bare, config_array));
		
		var config = "<field var='FORM_TYPE'>" + 
		"<value>http://jabber.org/protocol/muc#roomconfig</value></field>" + 
		"<field var='muc#roomconfig_roomdesc'><value></value></field>" + 
		"<field var='muc#roomconfig_persistentroom'><value>0</value></field>" + 
		"<field var='muc#roomconfig_publicroom'><value>0</value></field>" + 
		"<field var='public_list'><value>0</value></field>" + 
		"<field var='muc#roomconfig_passwordprotectedroom'><value>0</value></field>" + 
		"<field var='muc#roomconfig_roomsecret'><value></value></field>" + 
		"<field var='muc#roomconfig_maxusers'><value>200</value></field>" + 
		"<field var='muc#roomconfig_whois'><value>anyone</value></field>" + 
		"<field var='muc#roomconfig_membersonly'><value>1</value></field>" + 
		"<field var='muc#roomconfig_moderatedroom'><value>1</value></field>" + 
		"<field var='members_by_default'><value>1</value></field>" + 
		"<field var='muc#roomconfig_changesubject'><value>0</value></field>" + 
		"<field var='allow_private_messages'><value>0</value></field>" + 
		"<field var='allow_private_messages_from_visitors'><value>anyone</value></field>" + 
		"<field var='allow_query_users'><value>1</value></field>" + 
		"<field var='muc#roomconfig_allowinvites'><value>0</value></field>" + 
		"<field var='muc#roomconfig_allowvisitorstatus'><value>0</value></field>" + 
		"<field var='muc#roomconfig_allowvisitornickchange'><value>0</value></field>" + 
		"<field var='muc#roomconfig_allowvoicerequests'><value>0</value></field>" + 
		"<field var='muc#roomconfig_voicerequestmininterval'><value>1800</value></field>" + 
		"<field var='muc#roomconfig_captcha_whitelist'/><field var='muc#roomconfig_enablelogging'><value>0</value></field>";
		
		Client.connection.sendIQ($iq({to: from, type: "set"})
            .c("query", {xmlns: Strophe.NS.MUC_OWNER})
            .c("x", {xmlns: "jabber:x:data", type: "submit"}).t(config));
		
		return false;
	},
	
	on_message: function (message) {		
		var from = jQuery(message).attr('from');
		var from_bare = Strophe.getBareJidFromJid(from);
		var to_bare = Strophe.getBareJidFromJid(jQuery(message).attr('to'));
		var jid_id = Client.jid_to_id(from_bare);
		
		var sender_name = jQuery("div").filter(document.getElementById(from_bare)).find('.friends_item_name').text();
		var sender_img_src = jQuery("div").filter(document.getElementById(from_bare)).find('.friends_item_picture').attr("src");
		var sender_id = document.getElementById(from_bare).getElementsByTagName('table')[0].id;
		var timestamp = +new Date;
		
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
			var id = jQuery("div").filter(document.getElementById(from_bare)).find('.friends_item').attr('id');
			if (jQuery('#chat_' + jid_id).length === 0) {
				jQuery('#subtabs').tabs('add', '#chat_' + jid_id, sender_name);
				jQuery('#chat_' + jid_id).append(
					"<div class='chat_messages'></div><hr/>" +
					"<table class='conversations_table'><tr>" +
						"<td class='conversations_table_spacer'></td>" +
						"<td><div class='chat_event'></div><textarea class='conversations_textarea' id='text_" + from_bare + "'></textarea></td>" +
						"<td class='conversations_table_button'><input class='conversations_send' type='button' label='submit' value='Send'/></td>" +
					"</tr></table>");

				// load older messages
				Client.load_older_messages(from_bare, to_bare, jid_id);
				
			} else {
				// add the new message
				Client.append_new_msg(sender_img_src, sender_id, sender_name, body, timestamp, jid_id, from);
			}
		}
		return true;
	},
	
	on_public_message: function (message) {
		var from = jQuery(message).attr('from');
		var room = Strophe.getBareJidFromJid(from);
		var nick = Strophe.getResourceFromJid(from);
		var jid_id = Client.jid_to_id(room);

		// make sure message is from the right place
		if (Client.mucs[room] != undefined) {
			var notice = !nick;			
			var body = jQuery(message).children('body').text();
			var delayed = jQuery(message).children("delay").length > 0  || jQuery(message).children("x[xmlns='jabber:x:delay']").length > 0;

			if (!notice) {
				if (delayed == true) {
					console.log("delayed");
				}

				var timestamp = jQuery(message).children("delay").attr('stamp');
				if (timestamp == undefined) {
					var time = "<nobr>" + moment(timestamp).format('HH:mm:ss') + "</nobr>";
				} else  {
					var time = "<nobr>" + moment(timestamp).format('DD.MM.YY') + "</nobr><br/><nobr>" + moment(timestamp).format('HH:mm:ss') + "</nobr>";
				}
				
				var member_id = jQuery("#roster").find(":contains('" + nick + "')").filter("td").parent().parent().parent().attr("id");
				if (member_id == undefined) {
					var profile_link = nick;
				} else {
					var profile_link = "<a href='profile.php?id=" + member_id + "'>" + nick + "</a>";
				}

				var sender_img_src = jQuery("#roster").find(":contains('" + nick + "')").filter("td").parent().find('.friends_item_picture').attr("src");
				if (sender_img_src == undefined) {
					var sender_img = "<div class='pic_square'></div>";
				} else {
					var sender_img = "<img class='picture' src='" + sender_img_src + "' alt='userphoto'/>";
				}
				
				jQuery('#chat_' + jid_id + ' .chat_messages').append(							
					"<hr/><table><tr>" + 
         				"<td  class='conversations_picture'>" + 
                           sender_img + 
                       	"</td>" + 
                       	
                       	"<td  class='conversations_middle'>" + 
                       	"<label class='conversations_name'>" + profile_link + "</label>" + 
                       	"<div class='conversations_msg'>" + body + 
						"</div>" + 
                       	"</td>" + 
                        	
                       	"<td class='conversations_time'>" + 
                       	"<span>" + time + "</span> " +                            
                       	"</td>" + 
                    "</tr></table>");
                Client.focus_chat(jid_id);
				Client.scroll_chat(jid_id);
			} else if (Client.mucs[room]["joined"] == true) {
				var timestamp = +new Date;
				jQuery('#chat_' + jid_id + ' .chat_messages').append("<hr/><div class='notice'>" + moment(timestamp).format('HH:mm:ss ') + body + "</div>");
				Client.focus_chat(jid_id);
				Client.scroll_chat(jid_id);
			}
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
	load_older_messages: function (from_bare, to_bare, jid_id) {
		var dataString = 'from=' + from_bare + '&to=' + to_bare;
		jQuery.ajax({
			type: "POST",
			url: "ATutor/mods/chat_new/ajax/get_older_messages.php",
			data: dataString,
			cache: false,
			success: function (data) {
				var timestamps = jQuery(data).find('.conversations_time');
				timestamps.each(function () {
					var timestamp = Number(jQuery(this).text());
					data = data.replace(timestamp, "<nobr>" + moment(timestamp).format('DD.MM.YY') + "</nobr><br/><nobr>" + moment(timestamp).format('HH:mm:ss') + "</nobr>");
				});
						
				jQuery('#chat_' + jid_id + ' .chat_messages').append(data);
						
				// binding function that will retrieve older messages on scrollTop
				jQuery('#chat_' + jid_id + ' .chat_messages').scroll(function(){
					if (jQuery(this).scrollTop() == 0) {						
						var real_height = jQuery('#chat_' + jid_id + ' .chat_messages').get(0).scrollHeight;
								
						// load older messages
						var offset = jQuery('#chat_' + jid_id + ' .chat_messages').find('table').length;
						var jid = jQuery(this).parent().find('textarea').attr('id').slice(5, jQuery('.chat_messages').parent().find('textarea').attr('id').length);
						var dataString = 'from=' + jid + '&to=' + Strophe.getBareJidFromJid(Client.my_full_jid) + '&offset=' + offset;
						jQuery.ajax({
							type: "POST",
							url: "ATutor/mods/chat_new/ajax/get_older_messages.php",
							data: dataString,
							cache: false,
							success: function (data) {
								var timestamps = jQuery(data).find('.conversations_time');
								timestamps.each(function () {
									var timestamp = Number(jQuery(this).text());
									data = data.replace(timestamp, "<nobr>" + moment(timestamp).format('DD.MM.YY') + "</nobr><br/><nobr>" + moment(timestamp).format('HH:mm:ss') + "</nobr>");
								});
										
								jQuery('#chat_' + jid_id + ' .chat_messages').prepend(data);
										
								var real_height_after = jQuery('#chat_' + jid_id + ' .chat_messages').get(0).scrollHeight;
								jQuery('#chat_' + jid_id + ' .chat_messages').scrollTop(real_height_after - real_height);
							},
							error: function (xhr, errorType, exception) {
							    console.log("error: " + exception);
							}		
						});
					}
				});  
						
				Client.focus_chat(jid_id);
				Client.scroll_chat(jid_id);
			},
			error: function (xhr, errorType, exception) {
			    console.log("error: " + exception);
			}		
		});
	},
	
	replace_contact: function (elem_roster, online) {
		if (online == true){
			group_el_roster = jQuery('#roster').find('.online');
			group = 'online';
			group_other = 'offline';
			
			if (elem_roster.className.search('me') > 0) {
				elem_roster.className = "friends_column_wrapper online me";
			} else {
				elem_roster.className = "friends_column_wrapper online";
			}
			jQuery("div").filter(elem_roster).find("td")[2].textContent = "Online";
		} else {
			group_el_roster = jQuery('#roster').find('.offline');
			group = 'offline';
			group_other = 'online';
			
			if (elem_roster.className.search('me') > 0) {
				elem_roster.className = "friends_column_wrapper offline me";
			} else {
				elem_roster.className = "friends_column_wrapper offline";
			}			
			jQuery("div").filter(elem_roster).find("td")[2].textContent = "";
		}
				
		jQuery('#roster')[0].removeChild(elem_roster);
		
		if (group_el_roster.length > 0) {
			var name_roster = elem_roster.getElementsByTagName("td")[1].textContent;
			var inserted = false;
			group_el_roster.each(function () {
				var cmp_name = jQuery(this).find('.friends_item_name')[0].textContent;
				if (name_roster < cmp_name) {
					jQuery(this).before(elem_roster);
					inserted = true;
					return false;
				}
			});
			if (!inserted) {
				// insert after last element of group
				jQuery('#roster').find('.' + group).last().after(elem_roster);
			}
		} else {
			if (group == 'online'){
				jQuery('#roster').find('.' + group_other).first().before(elem_roster);
			} else if (group == 'offline'){
				jQuery('#roster').find('.' + group_other).last().after(elem_roster);
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
	
	message_to_db: function (from, to, msg, timestamp, groupchat) {
		var dataString = 'from=' + from + '&to=' + to + '&msg=' + msg + '&timestamp=' + timestamp + '&groupchat=' + groupchat;
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
	
	append_new_msg: function (sender_img_src, sender_id, sender_name, body, timestamp, jid_id, from) {	
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
                        
	    jQuery('#chat_' + jid_id).data('jid', from);
				
		// remove notifications since user is now active
		jQuery('#chat_' + jid_id + ' .chat_messages').parent().find('.chat_event').text('');
	                        
	    // make db entry for message
	    //Client.message_to_db(from_bare, Strophe.getBareJidFromJid(jQuery(message).attr('to')), body, timestamp);
	    
		Client.focus_chat(jid_id);
		Client.scroll_chat(jid_id);
	},
	
	scroll_chat: function (jid_id) {
		var div = jQuery('#chat_' + jid_id + ' .chat_messages').get(0);
		div.scrollTop = div.scrollHeight;
	},
	
	focus_chat: function (jid_id) {
		jQuery('#tabs').tabs('select', '#tab_conversations');
		jQuery('#subtabs').tabs('select', '#chat_' + jid_id);
		jQuery('#chat_' + jid_id + ' textarea').focus();
	},
};

jQuery(window).unload(function() {
	//Client.connection.sync = true; // Switch to using synchronous requests since this is typically called onUnload.
	Client.connection.pause();
	//Client.connection.flush();
	Client.connection.disconnect();
	return false;
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
					//var json_text = JSON.stringify(conn);
					//jQuery.cookie("connection", json_text, {expires:365});
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
    Client.connection.addHandler(Client.on_public_message, null, "message", "groupchat");
    
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

jQuery(document).bind('room_joined', function (ev, jid) {
	Client.mucs[jid]["joined"] = true;
	
	var jid_id = Client.jid_to_id(jid);
	var groupname = Strophe.getNodeFromJid(jid);

	if (jQuery('#chat_' + jid_id).length === 0) {
		jQuery('#subtabs').tabs( "add", '#chat_' + jid_id, groupname);
		jQuery('#chat_' + jid_id).append(
			"<div class='chat_messages fl-container-flex80'></div><div class='muc_roster fl-container-flex20'><ul></ul></div><hr/>" +
			"<table class='conversations_table'><tr>" +
				"<td class='conversations_table_spacer'></td>" +
				"<td><div class='chat_event'></div><textarea class='conversations_textarea' id='text_" + jid + "'></textarea></td>" +
				"<td class='conversations_table_button'><input class='conversations_send' type='button' label='submit' value='Send'/>" + 
														"<input class='conversations_leave_muc' type='button' label='submit' value='Leave'/></td>" +
			"</tr></table>");
		jQuery('#chat_' + jid_id).data('jid', jid);
		
		// load older messages
		//Client.load_older_messages(jid, Strophe.getBareJidFromJid(Client.my_full_jid), jid_id);
		
		var member_id = jQuery('.me').find('table').attr('id');
		var profile_link = "<a href='profile.php?id=" + member_id + "'>" + Client.mucs[jid]["nickname"] + "</a>";		
		jQuery("#chat_" + jid_id).find(".muc_roster ul").append("<li class='muc_roster_me' style='border:2px solid #BBB;'>" + profile_link + "</li>");
		
		var timestamp = +new Date;
		jQuery('#chat_' + jid_id).find('.chat_messages').append("<hr/><div class='notice'>" +moment(timestamp).format('HH:mm:ss ') + "You joined the room</div>");
	}
	Client.focus_chat(jid_id);
	Client.scroll_chat(jid_id);
	
});

