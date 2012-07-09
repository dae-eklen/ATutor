<?php
// new entry in chat_members table
if (isset($_POST['id']) && isset($_POST['jid']) && isset($_POST['pass'])){
	$id = $_POST['id'];
	$jid = $_POST['jid'];
	$pass = $_POST['pass'];	
	$sql = "SELECT * FROM ".TABLE_PREFIX."chat_members WHERE member_id=$id";
	$result = mysql_query($sql, $db);
	if (count(mysql_fetch_assoc($result)) == 1){
		$sql = "INSERT INTO ".TABLE_PREFIX."chat_members (member_id, jid, password) VALUES ('$id', '$jid', '$pass')";
		$resp = mysql_query($sql,$db);
		if ($resp){
			$sql = "SELECT first_name, last_name FROM ".TABLE_PREFIX."members WHERE member_id=$id";
			$result = mysql_query($sql, $db);
			$row = mysql_fetch_assoc($result);			
			echo $jid. ' ' .$row['first_name']. ' ' .$row['last_name']. ' ' .$_base_path."/images/nophoto.gif";
		} else{
			echo 0;
		}
	}
	exit();
	
}

// called each time on index page load, gets jid and pass to authenticate
if (isset($_POST['id'])){
	$id = $_POST['id'];
	$sql = "SELECT jid, password FROM ".TABLE_PREFIX."chat_members WHERE member_id=$id";
	$result = mysql_query($sql, $db);
	$row = mysql_fetch_assoc($result);
	if (count($row) == 1){
		echo 0;
	} else {
		echo $row['jid']. ' ' .$row['password'];
	}
	exit();
}


?>
