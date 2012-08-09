<?php
if (isset($_POST['from']) && isset($_POST['to']) && isset($_POST['msg']) && isset($_POST['timestamp']) && isset($_POST['groupchat'])){
	$from = $_POST['from'];
	$to = $_POST['to'];
	$msg = $_POST['msg'];
	$timestamp = $_POST['timestamp'];
	
	if ($_POST['groupchat'] == 0){
		// chat message
		$sql = "INSERT INTO `".TABLE_PREFIX."chat_messages` (`from`, `to`, `msg`, `timestamp`) VALUES ('$from', '$to', '$msg', '$timestamp')";
		$resp = mysql_query($sql,$db);
		if ($resp){
			echo 1;
		}
		
	} else if ($_POST['groupchat'] == 1) {
		// muc message	
		$sql = "INSERT INTO `".TABLE_PREFIX."chat_muc_messages` (`from`, `to`, `msg`, `timestamp`) VALUES ('$from', '$to', '$msg', '$timestamp')";
		$resp = mysql_query($sql,$db);
		if ($resp){
			echo 1;
		}
	}
}

?>
