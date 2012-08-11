	    
// ================= hides welcome or chat div
function hide_div(){
	// called each time on index page load, gets jid and pass to authenticate	
	var dataString = 'id=' + jQuery("div").filter(jQuery('#chat').find('div')[1]).attr('id');
	jQuery.ajax({
		type: "POST",
		url: "ATutor/mods/chat_new/ajax/check_auth.php",
		data: dataString,
		cache: false,
		success: function (exists) {
			if (exists == 0){
				document.getElementById('chat').style.display = 'none';
			} else {
				document.getElementById('welcome').style.display = 'none';
				
				var data = exists.split(' ');
				var jid = data[0];
				var pass = data[1];
				
				connect(jid, pass);
			}
        },
        error: function (xhr, errorType, exception) {
            console.log("error: " + exception);
        }		
	});
}



// ================= inbox list
function read(chbox){
	// console.log(chbox);
	var clickedChbox = document.getElementById(chbox);
	
	if (jQuery(clickedChbox).is(":checked")){
		var parentItem = findParentNode("inbox_list_item", clickedChbox);
		jQuery(parentItem).removeClass("inbox_list_item");
		jQuery(parentItem).addClass("inbox_list_item_checked");
		jQuery(clickedChbox).attr("title").value = "Mark as Unread";
	}
	else{
		var parentItem = findParentNode("inbox_list_item_checked", clickedChbox);
		jQuery(parentItem).removeClass("inbox_list_item_checked");
		jQuery(parentItem).addClass("inbox_list_item");
		jQuery(clickedChbox).attr("title").value = "Mark as Read";
	}
}

function load_inbox(){
	var id = jQuery("div").filter(jQuery('#chat').find('div')[1]).attr('id');
	var dataString = 'my_id=' + id;	
	jQuery.ajax({
		type: "POST",
		url: "ATutor/mods/chat_new/ajax/get_inbox.php",
		data: dataString,
		cache: false,
		success: function (data) {			
			var timestamps = jQuery(data).find('.inbox_list_time');
			timestamps.each(function () {
				var timestamp = Number(jQuery(this).text());
				data = data.replace(timestamp, "<nobr>" + moment(timestamp).format('DD.MM.YY') + "</nobr><br/><nobr>" + moment(timestamp).format('HH:mm:ss') + "</nobr>");
			});
			
			jQuery('#inbox_list').append(data);
			
			// binding function that will retrieve older messages on scrollTop
			jQuery('#inbox_list').scroll(function(){
				var div = jQuery('#inbox_list').get(0);
				if (div.offsetHeight + div.scrollTop >= div.scrollHeight) {
					// load older messages
					var offset = jQuery('#inbox_list li').length;
					var dataString = 'my_id=' + id + '&offset=' + offset;
					jQuery.ajax({
						type: "POST",
						url: "ATutor/mods/chat_new/ajax/get_inbox.php",
						data: dataString,
						cache: false,
						success: function (data) {
							var timestamps = jQuery(data).find('.inbox_list_time');
							timestamps.each(function () {
								var timestamp = Number(jQuery(this).text());
								data = data.replace(timestamp, "<nobr>" + moment(timestamp).format('DD.MM.YY') + "</nobr><br/><nobr>" + moment(timestamp).format('HH:mm:ss') + "</nobr>");
							});
							
							jQuery('#inbox_list').append(data);
							
						},
						error: function (xhr, errorType, exception) {
						    console.log("error: " + exception);
						}		
					});
				}
			}); 
			
        },
        error: function (xhr, errorType, exception) {
            console.log("error: " + exception);
        }		
	});
}

function findParentNode(parentClass, childObj) {
    var testObj = childObj.parentNode;
    var count = 1;
    while(testObj.getAttribute('class') != parentClass) {
        testObj = testObj.parentNode;
        count++;
    }
    
    // console.log(testObj);
    return testObj;
}

jQuery('.inbox_list_item').live('click', function () {
	var jid = jQuery(this).attr('id').slice(6, jQuery(this).attr('id').length);
	var jid_id = Client.jid_to_id(jid);
	var name = jQuery(this).find('.inbox_list_name').text();

	open_conversation_tab(jid, jid_id, name, jQuery(this).hasClass('inbox_muc'));
	
	// Client.display_muc_roster(jid);
});


// ================= conversation tabs
jQuery(function() {
		var jQuerytab_title_input = jQuery( "#tab_title"),
			jQuerytab_content_input = jQuery( "#tab_content" );
		var tab_counter = 2;

		// tabs init with a custom tab template and an "add" callback filling in the content
		var jQuerysubtabs = jQuery( "#subtabs").tabs({
			tabTemplate: "<li><a href='#{href}'>#{label}</a><span class='ui-icon ui-icon-minus' onclick='minimize_medium();'>Minimize Tab</span><span class='ui-icon ui-icon-close'>Remove Tab</span></li>"
		});

		// close icon: removing the tab on click
		// note: closable tabs gonna be an option in the future - see http://dev.jqueryui.com/ticket/3924
		jQuery( "#subtabs span.ui-icon-close" ).live( "click", function() {
			var index = jQuery( "li", jQuerysubtabs ).index( jQuery( this ).parent() );
			jQuerysubtabs.tabs( "remove", index );
		});
});

function minimize_medium(){
	console.log("minimize_medium");
}


	
// ================= friends
jQuery('.friends_column_wrapper_classmates').live('click', function () {
	var friendsList = jQuery("#friends_list");
	var friendsMembers = jQuery("#friends_members");
	var clicked = jQuery(this);
	
	if (jQuery(this).parent().attr('id') == friendsList.attr('id')){
		friendsList[0].removeChild(jQuery(this)[0]);
		replace_friend(clicked, friendsMembers);
	}
	else if (jQuery(this).parent().attr('id') == friendsMembers.attr('id')){
		friendsMembers[0].removeChild(jQuery(this)[0]);
		replace_friend(clicked, friendsList);
	}
	
	refreshForm();
});

function replace_friend(clicked, to){
	if (to.find('div').length > 0) {
		var name_roster = clicked.find("td")[1].textContent;
		var inserted = false;
		to.find('div').each(function () {
			var cmp_name = jQuery(this).find('.friends_item_name')[0].textContent;
			if (name_roster < cmp_name) {
				jQuery(this).before(clicked);
				inserted = true;
			}
		});
		if (!inserted) {
			to.append(clicked);
		}
	} else {
		to.append(clicked);
	}
}

function refreshForm(){
	var friendsMembers = document.getElementById("friends_members");
	if (friendsMembers){
		document.getElementById("nr_of_members").innerHTML = friendsMembers.childNodes.length - 2;
		
		if (friendsMembers.childNodes.length - 2 == 0){
			document.getElementById("groupname").disabled = true;
			document.getElementById("friends_selected_bnt").disabled = true;
			document.getElementById("friends_selected_label").style.color = '#555';
		}
		else if (friendsMembers.childNodes.length - 2 == 1){
			document.getElementById("groupname").disabled = true;
			if (validateGroupname() == false){
				document.getElementById("friends_selected_bnt").disabled = false;
			document.getElementById("friends_selected_label").style.color = '#555';
			}
		}
		else if (friendsMembers.childNodes.length - 2 >= 2){
			document.getElementById("groupname").disabled = false;
			if (validateGroupname() == false){
				document.getElementById("friends_selected_bnt").disabled = true;
			}
		}
	}	
}

function validateGroupname(){
	var groupname = document.getElementById("groupname");
	// console.log(groupname.value);
	if (groupname.value != ""){
		document.getElementById("friends_selected_bnt").disabled = false;
		if (groupname.disabled == false && (document.getElementById("friends_members").childNodes.length >= 2)) {
			document.getElementById("friends_selected_label").style.color = 'green';
		}
		return true;
	}
	else {
		document.getElementById("friends_selected_bnt").disabled = true;
		if (groupname.disabled == false && (document.getElementById("friends_members").childNodes.length >= 2)) {
			document.getElementById("friends_selected_label").style.color = 'red';
		}
		return false;
	}
}

jQuery('#friends_selected_bnt').live('click', function () {
	if (jQuery('#friends_members').find('div').length == 1) {
		var jid = jQuery('#friends_members').find('.friends_column_wrapper_classmates').attr('id').slice(11, jQuery('#friends_members').find('.friends_column_wrapper_classmates').attr('id').length);
		var jid_id = Client.jid_to_id(jid);
		var name = jQuery('#friends_members').find('.friends_column_wrapper_classmates').find('.friends_item_name').text();
	
		if (jQuery('#chat_' + jid_id).length === 0) {
			jQuery('#subtabs').tabs( "add", '#chat_' + jid_id, name);
			jQuery('#chat_' + jid_id).append(
				"<div class='chat_messages'></div><hr/>" +
				"<table class='conversations_table'><tr>" +
					"<td class='conversations_table_spacer'></td>" +
					"<td><div class='chat_event'></div><textarea class='conversations_textarea' id='text_" + jid + "'></textarea></td>" +
					"<td class='conversations_table_button'><input class='conversations_send' type='button' label='submit' value='Send'/></td>" +
				"</tr></table>");
			jQuery('#chat_' + jid_id).data('jid', jid);
			
			// load older messages
			Client.load_older_messages(jid, Strophe.getBareJidFromJid(Client.my_full_jid), jid_id);
			
		}
		Client.focus_chat(jid_id);
		Client.scroll_chat(jid_id);
		
	} else if (jQuery('#friends_members').find('div').length > 1) {
		var jids = new Array();
		jQuery('#friends_members').find('.friends_column_wrapper_classmates').each(function () {
			var nick = jQuery(this).find('.friends_item_name')[0].textContent;
			// avoid nick repetitions
			for (var i = 0; i < jids.length; i++) {
				if (jids[i]["nick"] == nick) {
					var nr = jids[i]["nick"].match(/\([0-99]\)/);
					if (nr != null) {
						nr = parseInt(nr[0].slice(0, nr[0].length-1).slice(1, nr[0].length))+1;
						nick = nick.slice(0, nick.length -3) + "(" + nr + ")";
						continue;
					}
					nick = nick + "(1)";
					continue;
				} 				
			}
			jids.push({"jid": jQuery(this).attr('id').slice(11, jQuery(this).attr('id').length), "nick": nick, "status": "offline"});
		});
		
		var groupname = jQuery('#friends').find('#groupname').val();
		var jid_id = Client.jid_to_id(groupname + "@conference.talkr.im");		
		if (groupname == ''){
			return;
		} else if (groupname.indexOf(' ') >= 0) {
			alert('Group name should not contain spaces.');
			jQuery('#friends').find('#groupname').focus();
			return;
		}
		
		if (Client.mucs[groupname + "@conference.talkr.im"] == undefined) {
			var my_groupname = jQuery('.me').find('.friends_item_name')[0].textContent;
			
			Client.connection.send($pres({
				to: groupname + "@conference.talkr.im/" + my_groupname
			}).c('x', {xmlns: "http://jabber.org/protocol/muc"}));

			Client.mucs[groupname + "@conference.talkr.im"] = { "joined":false, "participants":new Array(), "invites_to":jids, "nickname":my_groupname};
			console.log("#friends_selected_bnt create: ", Client.mucs[groupname + "@conference.talkr.im"]["joined"], 
				Client.mucs[groupname + "@conference.talkr.im"]["participants"], Client.mucs[groupname + "@conference.talkr.im"]["invites_to"], 
				Client.mucs[groupname + "@conference.talkr.im"]["nickname"]);

		} else if (jQuery('#chat_' + jid_id).length !== 0) {
			Client.focus_chat(jid_id);
			Client.scroll_chat(jid_id);
		}
	}
});

// ================= settings help
	jQuery(function() {
		jQuery( "#settings_blacklist_dialog" ).dialog({
			autoOpen: false
		});
		jQuery( "#settings_blacklist_opener" ).click(function() {
			jQuery( "#settings_blacklist_dialog" ).dialog( "open" );
			return false;
		});
	});
	
	jQuery(function() {
		jQuery( "#settings_history_dialog" ).dialog({
			autoOpen: false
		});
		jQuery( "#settings_history_opener" ).click(function() {
			jQuery( "#settings_history_dialog" ).dialog( "open" );
			return false;
		});
	});
	





// ================= tabs
jQuery('.friends_column_wrapper').live('click', function () {
	// do nothing if clicked on self
	if (jQuery(this).attr('class').search('me') > 0) {
		return;
	}
	
	var jid = jQuery(this).attr('id');
	var name = jQuery(this).find('.friends_item_name').text();
	var jid_id = Client.jid_to_id(jid);

	open_conversation_tab(jid, jid_id, name, false);
});

function open_conversation_tab(jid, jid_id, name, muc) {
	if (muc == false) {
		if (jQuery('#chat_' + jid_id).length === 0) {
			jQuery('#subtabs').tabs( "add", '#chat_' + jid_id, name);
			jQuery('#chat_' + jid_id).append(
				"<div class='chat_messages'></div><hr/>" +
				"<table class='conversations_table'><tr>" +
					"<td class='conversations_table_spacer'></td>" +
					"<td><div class='chat_event'></div><textarea class='conversations_textarea' id='text_" + jid + "'></textarea></td>" +
					"<td class='conversations_table_button'><input class='conversations_send' type='button' label='submit' value='Send'/></td>" +
				"</tr></table>");
			jQuery('#chat_' + jid_id).data('jid', jid);
			
			// load older messages
			Client.load_older_messages(jid, Strophe.getBareJidFromJid(Client.my_full_jid), jid_id);
		}
		
	} else {
		if (jQuery('#chat_' + jid_id).length === 0) {
			jQuery('#subtabs').tabs( "add", '#chat_' + jid_id, name);
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
			Client.load_older_messages(null, jid, jid_id);
			
		} else {	
			jQuery('#chat_' + jid_id).find('.conversations_table').find('.conversations_textarea').removeAttr('disabled');
			jQuery('#chat_' + jid_id).find('.conversations_table').find('.conversations_send').removeAttr('disabled');
			jQuery('#chat_' + jid_id).find('.conversations_table').find('.conversations_leave_muc').removeAttr('disabled');
		}
	}
	
	Client.focus_chat(jid_id);
	Client.scroll_chat(jid_id);
}

jQuery('.conversations_textarea').live('keypress', function (ev) {
	var jid = jQuery(this).parent().parent().parent().parent().parent().data('jid');

	if (ev.which === 13) {
		ev.preventDefault();
		var body = jQuery(this).val();
		if (body == '') {
			return;
		} else if (body.length > 65535) { // fits TEXT in MySQL
			alert("Too large message.");
			return;
		}
		
		var timestamp = +new Date;
		
		if (jid.search("@conference.talkr.im") == -1) {
			// chat
			var message = $msg({to: jid, "type": "chat"}).c('body').t(body).up()
				.c('active', {xmlns: "http://jabber.org/protocol/chatstates"});	
			
			var my_img = jQuery('.me').find('.friends_item_picture').attr("src");
			var my_id = jQuery('.me').find('table').attr('id');
			var my_name = jQuery('.me').find('.friends_item_name')[0].textContent;
			
			jQuery(this).parent().parent().parent().parent().parent().find('.chat_messages').append(
					"<hr/><table><tr>" + 
	         					"<td  class='conversations_picture'>" + 
	                            "<img class='picture' src='" + my_img + "' alt='userphoto'/>" + 
	                        	"</td>" + 
	                        	
	                        	"<td  class='conversations_middle'>" + 
	                        	"<label class='conversations_name'><a href='profile.php?id=" + my_id + "'>" + my_name + "</a></label>" + 
	                        	"<div class='conversations_msg'>" + body + 
								"</div>" + 
	                        	"</td>" + 
	                        	
	                        	"<td class='conversations_time'>" + 
	                        	"<span><nobr>" + moment(timestamp).format('HH:mm:ss') + "</nobr></span> " +                            
	                        	"</td>" + 
	                        "</tr></table>");
						
			Client.scroll_chat(Client.jid_to_id(jid));
			jQuery(this).parent().parent().parent().parent().parent().data('composing', false);
			
			var groupchat = 0;
	 	} else {
	 		// muc
	 		var message = $msg({to: jid, type: "groupchat"}).c('body').t(body);
	 		var groupchat = 1;
	 	}
	 	jQuery(this).val('');
	 	
	 	// make db entry for message
	 	Client.message_to_db(Strophe.getBareJidFromJid(Client.my_full_jid), Strophe.getBareJidFromJid(jid), body, timestamp, groupchat);
	 	
	 	Client.connection.send(message);
	 	
	} else {
		var composing = jQuery(this).parent().parent().parent().parent().parent().data('composing');
		if (!composing) {
			if (jid.search("@conference.talkr.im") == -1) {
				var notify = $msg({to: jid, "type": "chat"}).c('composing', {xmlns: "http://jabber.org/protocol/chatstates"});
				Client.connection.send(notify);
			}

			jQuery(this).parent().parent().parent().parent().parent().data('composing', true);
		}
	}
});


// ================= send button
jQuery('.conversations_send').live('click', function () {
	var jid = jQuery(this).parent().parent().parent().parent().parent().data('jid');
	var jid_id = Client.jid_to_id(Strophe.getBareJidFromJid(jid));
	var body = jQuery(this).parent().parent().find('td').find('textarea').val();
	if (body == '') {
		jQuery(this).parent().parent().find('td').find('textarea').focus();
		return;
	} else if (body.length > 65535) { // fits TEXT in MySQL
		alert("Too large message.");
		return;
	}
	
	var timestamp = +new Date;	
    
	if (jid.search("@conference.talkr.im") == -1) {
		// chat
		var message = $msg({to: jid, "type": "chat"}).c('body').t(body).up()
			.c('active', {xmlns: "http://jabber.org/protocol/chatstates"});
		
		var my_img = jQuery('.me').find('.friends_item_picture').attr("src");
		var my_id = jQuery('.me').find('table').attr('id');
		var my_name = jQuery('.me').find('.friends_item_name')[0].textContent;
		
		jQuery(this).parent().parent().parent().parent().parent().find('.chat_messages').append(
					"<hr/><table><tr>" + 
	         					"<td  class='conversations_picture'>" + 
	                            "<img class='picture' src='" + my_img + "' alt='userphoto'/>" + 
	                        	"</td>" + 
	                        	
	                        	"<td  class='conversations_middle'>" + 
	                        	"<label class='conversations_name'><a href='profile.php?id=" + my_id + "'>" + my_name + "</a></label>" + 
	                        	"<div class='conversations_msg'>" + body + 
								"</div>" + 
	                        	"</td>" + 
	                        	
	                        	"<td class='conversations_time'>" + 
	                        	"<span><nobr>" + moment(timestamp).format('HH:mm:ss') + "</nobr></span> " +                            
	                        	"</td>" + 
	                        "</tr></table>");
	    jQuery(this).parent().parent().find('td').find('textarea').focus();
	    Client.scroll_chat(jid_id);
		
		var groupchat = 0;
 	} else {
 		// muc
 		var message = $msg({to: jid, type: "groupchat"}).c('body').t(body);
 		var groupchat = 1;
 	}
 	jQuery(this).parent().parent().find('td').find('textarea').val('');
 	
 	// make db entry for message
 	Client.message_to_db(Strophe.getBareJidFromJid(Client.my_full_jid), Strophe.getBareJidFromJid(jid), body, timestamp, groupchat);
 	
 	Client.connection.send(message);
 	
});
// ================= leave_muc button
jQuery('.conversations_leave_muc').live('click', function () {
	jQuery(this).attr('disabled', 'disabled');
	jQuery(this).parent().find('.conversations_send').attr('disabled', 'disabled');
	jQuery(this).parent().parent().find('.conversations_textarea').attr('disabled', 'disabled');
	
	var jid = jQuery(this).parent().parent().find('.conversations_textarea').attr('id').slice(5, jQuery(this).parent().parent().find('.conversations_textarea').attr('id').length)
	var my_groupname = Client.mucs[jid]["nickname"];
	var jid_id = Client.jid_to_id(jid);
	
	console.log(".conversations before leave delete: ", Client.mucs[jid]);
	delete Client.mucs[jid];
	console.log(".conversations leave delete: ", Client.mucs[jid]);
	
	jQuery('#chat_' + jid_id).find('li').remove(":contains('" + my_groupname + "')");
	
	var timestamp = +new Date;
	jQuery('#chat_' + jid_id + ' .chat_messages').append("<hr/><div class='notice'>" + moment(timestamp).format('HH:mm:ss ') + "You left the room</div>");
	Client.focus_chat(jid_id);
	Client.scroll_chat(jid_id);
	jQuery("#chat_" + jid_id).find(".muc_roster li").remove();
	
	Client.connection.send($pres({"to": jid + "/" + my_groupname, "nickname": my_groupname, "type": "unavailable"}));
});

// ================= logging in
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





// ================= remove layerX and layerY
(function(){
    var all = jQuery.event.props,
    len = all.length,
    res = [];
    while (len--) {
      var el = all[len];
      if (el != 'layerX' && el != 'layerY') res.push(el);
    }
    jQuery.event.props = res;
}());