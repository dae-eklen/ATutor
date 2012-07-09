<?php
// called when we need to check if received data is from course member

if (isset($_POST['jid'])){
	$jid = $_POST['jid'];
	$sql = "SELECT * FROM ".TABLE_PREFIX."chat_members WHERE jid='".$jid."'";
	$result = mysql_query($sql, $db);
	$row = mysql_fetch_assoc($result);
	if (is_array($row)){
		echo 1;
	} else {
		echo 0;
	}

	exit();
}
?>
