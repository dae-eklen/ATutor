// ================= hides welcome or chat div
function hide_div(id){	
	var dataString = 'id=' + id;
	jQuery.ajax({
		type: "POST",
		url: "ATutor/mods/chat_new/check_auth.php",
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
	


// =================
(function(){
    //remove layerX and layerY
    var all = jQuery.event.props,
    len = all.length,
    res = [];
    while (len--) {
      var el = all[len];
      if (el != 'layerX' && el != 'layerY') res.push(el);
    }
    jQuery.event.props = res;
}());