<?php
if (isset($_POST['roomname']) && isset($_POST['members'])){
	$roomname = $_POST['roomname'];
	$members = explode("  ", $_POST['members']);
	
	for ($i = 0; $i < count($members); $i++) {
		$sql = "SELECT * FROM ".TABLE_PREFIX."chat_user_mucs WHERE muc_jid=$roomname AND user_jid=$members[$i]";
		$result = mysql_query($sql, $db);
		
		if ($result == false) {
			echo -1;
			// does not exist
			$sql = "INSERT INTO `".TABLE_PREFIX."chat_user_mucs` (`muc_jid`, `user_jid`) VALUES ('$roomname', '$members[$i]')";
			$resp = mysql_query($sql,$db);
			
		} else {
			// exists
			echo 1;
		}
	}
	
}

?>
