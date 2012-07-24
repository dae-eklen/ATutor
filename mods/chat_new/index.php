<?php
define('AT_INCLUDE_PATH', '../../include/');
require (AT_INCLUDE_PATH.'vitals.inc.php');

$_custom_head .= '<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>
		
		<script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/xmpp_client.js"></script>
		<script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/xmpp_console.js"></script>
		<script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/interface.js"></script>
				
		<script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/strophe&flXHR/strophe.js"></script>
	    <script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/strophe&flXHR/flXHR.js"></script>
	    <script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/strophe&flXHR/strophe.flxhr.js"></script>	   

	    <script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/JSON-js/json2.js"></script>
	    <script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/cookies.js"></script>
	    		
	    <script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/moment.min.js"></script>';

$_custom_css = $_base_path.'mods/chat_new/module.css'; // use a custom stylesheet
require (AT_INCLUDE_PATH.'header.inc.php');

//	$from = 'dae-eklen-test2@talkr.im';
//	$to = 'dae-eklen-test@talkr.im';
//	
//	$offset = 20;
//	
//	$sql = "SELECT * FROM (SELECT * FROM ".TABLE_PREFIX."chat_messages C 
//		WHERE 
//		(C.to='".$to."' OR C.to='".$from."') AND (C.from='".$from."' OR C.from='".$to."') 
//		ORDER BY timestamp DESC LIMIT ".$offset.",10) AS res ORDER BY timestamp ASC";
//		
//	$html = '';
//	$result = mysql_query($sql, $db);
//
//	while($row = mysql_fetch_assoc($result)){
//		$sql_from = "SELECT first_name, last_name, member_id FROM ".TABLE_PREFIX."chat_members C INNER JOIN ".TABLE_PREFIX."members M USING (member_id) 
//				WHERE C.jid='".$row[from]."'";
//		$result_from = mysql_query($sql_from, $db);
//		$row_from = mysql_fetch_assoc($result_from);
//		
//		$html .= "<hr/><table><tr>" . 
//         					"<td  class='conversations_picture'>" . 
//                            "<img class='picture' src='" .$_base_path. "get_profile_img.php?id=" .$row_from[member_id]. "' alt='userphoto'/>" . 
//                        	"</td>" .
//                        	
//                        	"<td  class='conversations_middle'>" . 
//                        	"<label class='conversations_name'><a href='profile.php?id=" .$row_from[member_id]. "'>" .$row_from[first_name] . ' ' . $row_from[last_name]. "</a></label>" . 
//                        	"<div class='conversations_msg'>"  .$row[msg].  
//							"</div>" . 
//                        	"</td>" . 
//                        	
//                        	"<td class='conversations_time'>" . 
//                        	$row[timestamp].                            
//                        	"</td>" . 
//                 "</tr></table>";
//	}	
//	echo $html;

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
		        <li class="ui-state-default ui-corner-top" role="presentation"><a href="#tab_inbox">Inbox list</a></li>
		        <li class="ui-state-default ui-corner-top ui-tabs-selected ui-state-active"><a href="#tab_conversations">Conversations</a></li>
		        <li class="ui-state-default ui-corner-top" role="presentation"><a href="#tab_friends">Friends</a></li>
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
	    
	    refreshForm();
	    hide_div(<?php echo $_SESSION['member_id']; ?>);
	    
	</script>

<?php require (AT_INCLUDE_PATH.'footer.inc.php'); ?>