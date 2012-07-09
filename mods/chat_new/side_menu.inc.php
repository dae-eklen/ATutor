<?php 
if (!defined('AT_INCLUDE_PATH')) { exit; }
global $_base_path, $include_all, $include_one, $stripslashes;
global $savant;
	
$sql = "SELECT * FROM ".TABLE_PREFIX."chat_members C INNER JOIN ".TABLE_PREFIX."course_enrollment E USING (member_id) INNER JOIN ".TABLE_PREFIX."members M
	WHERE E.course_id=$_SESSION[course_id]
	AND E.approved='y'
	AND E.member_id=M.member_id
	AND E.member_id IN (SELECT member_id FROM ".TABLE_PREFIX."users_online)";
//	ORDER BY first_name";
$result = mysql_query($sql, $db);
$course_participants = array();
while ($row = mysql_fetch_assoc($result)) {
	$course_participants_online[$row['jid']] = $row['first_name'].' '.$row['last_name'];
//	debug($row['member_id'].':'.$row['first_name'].' '.$row['last_name'].'; ');
}

$sql = "SELECT * FROM ".TABLE_PREFIX."chat_members C INNER JOIN ".TABLE_PREFIX."course_enrollment E USING (member_id) INNER JOIN ".TABLE_PREFIX."members M
	WHERE E.course_id=$_SESSION[course_id]
	AND E.approved='y'
	AND E.member_id=M.member_id
	AND E.member_id NOT IN (SELECT member_id FROM ".TABLE_PREFIX."users_online)";
$result = mysql_query($sql, $db);
$course_participants = array();
while ($row = mysql_fetch_assoc($result)) {
	$course_participants_offline[$row['jid']] = $row['first_name'].' '.$row['last_name'];
//	debug($row['member_id'].':'.$row['first_name'].' '.$row['last_name'].'; ');
}


ob_start();
?>
<link rel="stylesheet" href="<?php echo $_base_path; ?>/mods/chat_new/side_menu.css" type="text/css" />

	<div id="roster">	
		<?php
		if (count($course_participants_online) == 0 && count($course_participants_offline) == 0) {
			?> 
			The course has no chat members yet. Join course chat <a href="<?php echo $_base_path; ?>/mods/chat_new/">here</a>.
			<?php
		}
		if (count($course_participants_online) != 0) {
			foreach($course_participants_online as $jid => $name){
				?><div class="friends_column_wrapper online" id="<?php echo $jid; ?>" onclick="console.log(jQuery(this).attr('id'));">
	                    	<table class="friends_item"><tr>
	         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
	                        	<td class="friends_item_name"><?php echo $name; ?></td>
	                        	<td class="friends_item_status">Online</td>
	                    	</tr></table>
	              </div>
			<?php 
			}
		}
		if (count($course_participants_offline) != 0) {			
			foreach($course_participants_offline as $jid => $name){
				?><div class="friends_column_wrapper offline" id="<?php echo $jid; ?>" onclick="console.log(jQuery(this).attr('id'));">
	                    	<table class="friends_item"><tr>
	         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
	                        	<td class="friends_item_name"><?php echo $name; ?></td>
	                        	<td class="friends_item_status"></td>
	                    	</tr></table>
	              </div>
			<?php 
			}
		}		
		?>
     </div>

<?php
$savant->assign('dropdown_contents', ob_get_contents());
ob_end_clean();

$savant->assign('title', _AT('chat_new')); // the box title
$savant->display('include/box.tmpl.php');
?>