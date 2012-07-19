	    
// ================= hides welcome or chat div
function hide_div(id){
	// called each time on index page load, gets jid and pass to authenticate	
	var dataString = 'id=' + id;
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


// ================= conversation tabs
jQuery(function() {
		var jQuerytab_title_input = jQuery( "#tab_title"),
			jQuerytab_content_input = jQuery( "#tab_content" );
		var tab_counter = 2;

		// tabs init with a custom tab template and an "add" callback filling in the content
		var jQuerysubtabs = jQuery( "#subtabs").tabs({
			tabTemplate: "<li><a href='#{href}'>#{label}</a><span class='ui-icon ui-icon-close'>Remove Tab</span><span class='ui-icon ui-icon-close'>Remove Tab</span></li>",
			add: function( event, ui ) {
				var tab_content = jQuerytab_content_input.val() || "Tab " + tab_counter + " content.";
				jQuery( ui.panel ).append( "<p>" + tab_content + "</p>" );
			}
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
function changeCategory(user){
	var clickedUser = document.getElementById(user);
	var friendsList = document.getElementById("friends_list");
	var friendsMembers = document.getElementById("friends_members");
	
	if (clickedUser.parentNode == friendsList){
		friendsList.removeChild(clickedUser);
		friendsMembers.appendChild(clickedUser);
	}
	else if (clickedUser.parentNode == friendsMembers){
		friendsMembers.removeChild(clickedUser);
		friendsList.appendChild(clickedUser);
	}
	
	refreshForm()
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
	}
	jQuery('#subtabs').tabs('select', '#chat_' + jid_id);
	jQuery('#chat_' + jid_id + ' textarea').focus();
});

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
		
		var message = $msg({to: jid, "type": "chat"})
			.c('body').t(body).up()
			.c('active', {xmlns: "http://jabber.org/protocol/chatstates"});
		Client.connection.send(message);
		
		
		var my_img = jQuery('.me').find('.friends_item_picture').attr("src");
		var my_id = jQuery('.me').find('table').attr('id');
		var timestamp = +new Date;
		jQuery(this).parent().parent().parent().parent().parent().find('.chat_messages').append(
				"<hr/><table><tr>" + 
         					"<td  class='conversations_picture'>" + 
                            "<img class='picture' src='" + my_img + "' alt='userphoto'/>" + 
                        	"</td>" + 
                        	
                        	"<td  class='conversations_middle'>" + 
                        	"<label class='conversations_name'><a href='profile.php?id=" + my_id + "'>" + "Me" + "</a></label>" + 
                        	"<div class='conversations_msg'>" + body + 
							"</div>" + 
                        	"</td>" + 
                        	
                        	"<td class='conversations_time'>" + 
                        	"<span><nobr>" + moment(timestamp).format('HH:mm:ss') + "</nobr></span> " +                            
                        	"</td>" + 
                        "</tr></table>");
					
		Client.scroll_chat(Client.jid_to_id(jid));
		jQuery(this).val('');
		jQuery(this).parent().parent().parent().parent().parent().data('composing', false);
		
		// make db entry for message
 		Client.message_to_db(Strophe.getBareJidFromJid(Client.my_full_jid), Strophe.getBareJidFromJid(jid), body, timestamp);
 		
	} else {
		var composing = jQuery(this).parent().parent().parent().parent().parent().data('composing');
		if (!composing) {
			var notify = $msg({to: jid, "type": "chat"})
				.c('composing', {xmlns: "http://jabber.org/protocol/chatstates"});
			Client.connection.send(notify);

			jQuery(this).parent().parent().parent().parent().parent().data('composing', true);
		}
	}
});


// ================= send button
jQuery('.conversations_send').live('click', function () {
	var jid = jQuery(this).parent().parent().parent().parent().parent().data('jid');
	var body = jQuery(this).parent().parent().find('td').find('textarea').val();
	if (body == '') {
		jQuery(this).parent().parent().find('td').find('textarea').focus();
		return;
	} else if (body.length > 65535) { // fits TEXT in MySQL
		alert("Too large message.");
		return;
	}
	
	var message = $msg({to: jid, "type": "chat"})
		.c('body').t(body).up()
		.c('active', {xmlns: "http://jabber.org/protocol/chatstates"});
	Client.connection.send(message);
	
	var my_img = jQuery('.me').find('.friends_item_picture').attr("src");
	var my_id = jQuery('.me').find('table').attr('id');
	var timestamp = +new Date;	
	jQuery(this).parent().parent().parent().parent().parent().find('.chat_messages').append(
				"<hr/><table><tr>" + 
         					"<td  class='conversations_picture'>" + 
                            "<img class='picture' src='" + my_img + "' alt='userphoto'/>" + 
                        	"</td>" + 
                        	
                        	"<td  class='conversations_middle'>" + 
                        	"<label class='conversations_name'><a href='profile.php?id=" + my_id + "'>" + "Me" + "</a></label>" + 
                        	"<div class='conversations_msg'>" + body + 
							"</div>" + 
                        	"</td>" + 
                        	
                        	"<td class='conversations_time'>" + 
                        	"<span><nobr>" + moment(timestamp).format('HH:mm:ss') + "</nobr></span> " +                            
                        	"</td>" + 
                        "</tr></table>");
    jQuery(this).parent().parent().find('td').find('textarea').focus();
    jQuery(this).parent().parent().find('td').find('textarea').val('');
    
    // make db entry for message
    Client.message_to_db(Strophe.getBareJidFromJid(Client.my_full_jid), Strophe.getBareJidFromJid(jid), body, timestamp);	
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