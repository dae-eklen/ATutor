<?php
define('AT_INCLUDE_PATH', '../../include/');
require (AT_INCLUDE_PATH.'vitals.inc.php');

$_custom_head .= '<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>
		
		<script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/xmpp_client.js"></script>
		<script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/interface.js"></script>
				
		<script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/strophe&flXHR/strophe.js"></script>
	    <script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/strophe&flXHR/flXHR.js"></script>
	    <script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/strophe&flXHR/strophe.flxhr.js"></script>	   

	    <script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/JSON-js/json2.js"></script>
	    <script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/libraries/cookies.js"></script>';

$_custom_css = $_base_path.'mods/chat_new/module.css'; // use a custom stylesheet
require (AT_INCLUDE_PATH.'header.inc.php');

//
//	$jid = 'dae-eklen-test@talkr.im';
//$sql = "SELECT jid FROM ".TABLE_PREFIX."chat_members C INNER JOIN ".TABLE_PREFIX."course_enrollment E USING (member_id) INNER JOIN ".TABLE_PREFIX."members M
//	WHERE E.course_id=$_SESSION[course_id]
//	AND E.approved='y'
//	AND E.member_id=M.member_id
//	AND C.jid!='".$jid."'";
//$result = mysql_query($sql, $db);
//$course_participants = array();
//$to_echo = '!';
//while ($row = mysql_fetch_assoc($result)) {
////	debug($row['jid']);
//	array_push($course_participants, $row['jid']);
////	$to_echo .= ' ' .$row['jid'];
//}
////			debug($to_echo);
//debug($course_participants);



//$id = 2;
//$sql = "SELECT first_name, last_name FROM ".TABLE_PREFIX."members WHERE member_id=$id";
//			$result = mysql_query($sql, $db);
//			$row = mysql_fetch_assoc($result);			
////			$to_echo = $jid. ' ' .$row['first_name']. ' ' .$row['last_name']. ' ' .$_base_path."/images/nophoto.gif";
//			
//			$sql = "SELECT jid FROM ".TABLE_PREFIX."chat_members C INNER JOIN ".TABLE_PREFIX."course_enrollment E USING (member_id) INNER JOIN ".TABLE_PREFIX."members M
//				WHERE E.course_id=$_SESSION[course_id]
//				AND E.approved='y'
//				AND E.member_id=M.member_id
//				AND C.jid!='".$jid."'";
//			$result = mysql_query($sql, $db);
//			while ($row = mysql_fetch_assoc($result)) {
//				$to_echo .= ' ' .$row['jid'];
//			}
//			echo $to_echo;

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
		<div class="fl-container-flex90 fl-left democ-linearize-sections ui-tabs ui-widget ui-widget-content ui-corner-all" id="tabs">
		    <ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">
		        <li class="ui-state-default ui-corner-top" role="presentation"><a href="#tabs-1">Inbox list</a></li>
		        <li class="ui-state-default ui-corner-top ui-tabs-selected ui-state-active"><a href="#tabs-2">Conversations</a></li>
		        <li class="ui-state-default ui-corner-top" role="presentation"><a href="#tabs-3">Friends</a></li>
		        <li class="ui-state-default ui-corner-top" role="presentation"><a href="#tabs-4">Settings</a></li>
		    </ul>		  
		    <div id="tabs-1">
		    <?php require ('includes/inbox_list.inc.php'); ?>
		    </div>
		
			<div id="tabs-2">
			<?php require ('includes/conversations.inc.php'); ?>
			</div>
		
			<div id="tabs-3">
			<?php require ('includes/friends.inc.php'); ?>
			</div>
		
			<div id="tabs-4">
			<?php require ('includes/settings.inc.php'); ?>
			</div>		
		</div>  
	</div><!--end chat-->


	<!--Peek XMPP console (comment to hide)-->
	<h4>Peek XMPP console</h4>
	<div id="peek">
		<div id='console'></div>
		<textarea id='input' class='disabled' disabled='disabled'></textarea>
		
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