<?php
if (isset($_POST['from']) && isset($_POST['to']) && isset($_POST['msg']) && isset($_POST['timestamp'])){
//	echo $_POST['from'].' '.$_POST['to'].' '.$_POST['msg'].' '.$_POST['timestamp'];
	$from = $_POST['from'];
	$to = $_POST['to'];
	$msg = $_POST['msg'];
	$timestamp = $_POST['timestamp'];
	$sql = "INSERT INTO `".TABLE_PREFIX."chat_messages` (`from`, `to`, `msg`, `timestamp`) VALUES ('$from', '$to', '$msg', '$timestamp')";
	$resp = mysql_query($sql,$db);
	if ($resp){
		echo 1;
	}
}

?>
