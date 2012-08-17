<?php
define('AT_INCLUDE_PATH', '../../include/');
require (AT_INCLUDE_PATH.'vitals.inc.php');

$_custom_head .= '<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>
		
		<script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/xmpp_client.js"></script>
		<script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/xmpp_console.js"></script>
		<script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/interface.js"></script>
				
		<script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/strophe&flXHR/strophe.js"></script>	
	    <script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/strophe&flXHR/strophe.muc.js"></script>
	    <script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/strophe&flXHR/flXHR.js"></script>
	    <script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/strophe&flXHR/strophe.flxhr.js"></script>	   

	    <script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/JSON-js/json2.js"></script>
	    <script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/cookies.js"></script>
	    		
	    <script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/moment.min.js"></script>';

$_custom_css = $_base_path.'mods/chat_new/module.css'; // use a custom stylesheet
require (AT_INCLUDE_PATH.'header.inc.php');


?>

	<div id="welcome" class="fl-container-flex90">
		Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		<table id="welcome_form">
			<tr>
				<td><label>Nickname:</label></td>
		        <td><input class="welcome_form_input" id="welcome_form_jid" maxlength="100" type="text" name="jid"/></td>
	        </tr>
	        <tr>
		        <td><label>Server:</label></td>
		        <td><select id="welcome_form_select">
				  <option value="talkr.im">talkr.im</option>
				</select></td>
			</tr>
			<tr>
				<td><label>Password:</label></td>
		        <td><input class="welcome_form_input" id="welcome_form_pass" maxlength="100" type="text" type="password" name="pass"/></td>
	        </tr>
	        <tr>
				<td><input type="hidden" name="member_id" id="welcome_form_member_id" value="<?php echo $_SESSION['member_id']; ?>"/></td>
		        <td><input id="welcome_form_login" type="button" value="Log In" onclick="connect(null, null);"/></td>
	        </tr>        
		</table>
		<div id='log'>
   		</div>
	</div><!--end welcome-->
	
	
	<div id="chat">
		<div id="<?php echo $_SESSION[course_id]; ?>"></div>
		<div id="<?php echo $_SESSION[member_id]; ?>"></div>
		<div class="fl-container-flex90 fl-left democ-linearize-sections ui-tabs ui-widget ui-widget-content ui-corner-all" id="tabs">
		    <ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">
		        <li class="ui-state-default ui-corner-top ui-tabs-selected ui-state-active" role="presentation"><a href="#tab_inbox">Inbox list</a></li>
		        <li class="ui-state-default ui-corner-top"><a href="#tab_conversations">Conversations</a></li>
		        <li class="ui-state-default ui-corner-top" role="presentation"><a href="#tab_friends">Group chat</a></li>
		        <li class="ui-state-default ui-corner-top" role="presentation"><a href="#tab_settings">Settings</a></li>
		    </ul>		  
		    <div id="tab_inbox">
		    <?php require ('includes/inbox_list.inc.php'); ?>
		    </div>
		
			<div id="tab_conversations">
			<?php require ('includes/conversations.inc.php'); ?>
			</div>
		
			<div id="tab_friends">
			<?php require ('includes/friends.inc.php'); ?>
			</div>
		
			<div id="tab_settings">
			<?php require ('includes/settings.inc.php'); ?>
			</div>		
		</div>  
	</div><!--end chat-->


	<!--Peek XMPP console-->
	<h4>Peek XMPP console</h4>
	<div id="peek">
		<div id='console'></div>
		<textarea id='console_input' class='disabled' disabled='disabled'></textarea>
		
		<div id='buttonbar'>
			<input id='send_button' type='button' value='Send Data' disabled='disabled' class='button' onclick="console_send();">
			<input id='disconnect_button' type='button' value='Disconnect' disabled='disabled' class='button' onclick="console_disconnect();">
		</div>
	</div>
	<!--end Peek XMPP console-->
	
	
	
	<script>
	    jQuery("#tabs, #subtabs").tabs();
	    
	    jQuery('#subtabs').tabs({
			select: function(event, ui){
		        var jid_id = ui.tab.hash;
		        on_select_subtab(jid_id.slice(6, jid_id.length));
			}
		});
		
		jQuery('#tabs').tabs({
			select: function(event, ui){
				if (ui.tab.hash == "#tab_conversations") {
					on_select_conversation_tab();
				}
			}
		});
		
	    
	    refreshForm();
	    hide_div();
	    
	    load_inbox();
	    
	</script>

<?php require (AT_INCLUDE_PATH.'footer.inc.php'); ?>