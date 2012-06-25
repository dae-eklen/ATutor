<?php 
if (!defined('AT_INCLUDE_PATH')) { exit; }
global $_base_path, $include_all, $include_one, $stripslashes;
global $savant;

ob_start();
?>
<style>
.friends_item {width:100%; background:#ffffff; border:1px solid #c3c3c3;}
.friends_item td:first-child {width:41px;}
.friends_item_picture {border:1px solid #c3c3c3; height:30px; width:30px; margin:2px 2px 2px 5px !important;}
#friends td {vertical-align:top; border:1px solid #c3c3c3; background-color:#ECECEC; margin-left:15px;}
#friends .friends_item td {border:none; background-color:#fff; vertical-align:middle;}
.friends_column_wrapper {margin:2px; cursor: pointer;}
.friends_item_name {font-size:1em; color:#1A4A72; font-weight:bold;}
.friends_item_status {font-size:1em; color:#CCC; float:right; padding-right:5px;}
</style>

	<div id="roster">
                    <div class="friends_column_wrapper" id="f1" onclick="console.log(jQuery(this).attr('id'));">
                    	<table class="friends_item"><tr>
         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	<td><span class="friends_item_name">Lorem ipsum 1</span></td>
                        	<td><span class="friends_item_status">Online</span></td>
                    	</tr></table>
                    </div>
                    <div class="friends_column_wrapper" id="f2" onclick="console.log(jQuery(this).attr('id'));">
                    	<table class="friends_item"><tr>
         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	<td><span class="friends_item_name">Lorem ipsum 2</span></td>
                        	<td><span class="friends_item_status">Online</span></td>
                    	</tr></table>
                    </div>
                    <div class="friends_column_wrapper" id="f3" onclick="console.log(jQuery(this).attr('id'));">
                    	<table class="friends_item"><tr>
         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	<td><span class="friends_item_name">Lorem ipsum 3</td>
                        	<td><span class="friends_item_status"></span></td>
                    	</tr></table>
                    </div>
     </div>

<?php
$savant->assign('dropdown_contents', ob_get_contents());
ob_end_clean();

$savant->assign('title', _AT('chat_new')); // the box title
$savant->display('include/box.tmpl.php');
?>