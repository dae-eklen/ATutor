<?php
define('AT_INCLUDE_PATH', '../../include/');
require (AT_INCLUDE_PATH.'vitals.inc.php');

$_custom_head .= '<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>' .
		'<script type="text/javascript" src="'.$_base_path.'mods/chat_new/js/interface.js"></script>';

$_custom_css = $_base_path.'mods/chat_new/module.css'; // use a custom stylesheet
require (AT_INCLUDE_PATH.'header.inc.php');
?>


<div id="chat">
<div class="fl-container-flex90 fl-left democ-linearize-sections ui-tabs ui-widget ui-widget-content ui-corner-all" id="tabs">
    <ul class="ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all" role="tablist">
        <li class="ui-state-default ui-corner-top" role="presentation"><a href="#tabs-1">Inbox list</a></li>
        <li class="ui-state-default ui-corner-top"><a href="#tabs-2">Conversations</a></li>
        <li class="ui-state-default ui-corner-top ui-tabs-selected ui-state-active ui-state-focus" role="presentation"><a href="#tabs-3">Friends</a></li>
        <li class="ui-state-default ui-corner-top" role="presentation"><a href="#tabs-4">Settings</a></li>
    </ul>
  
    <div id="tabs-1">
    <?php require ('inbox_list.inc.php'); ?>
    </div>

	<div id="tabs-2">
	<?php require ('conversations.inc.php'); ?>
	</div>

	<div id="tabs-3">
	<?php require ('friends.inc.php'); ?>
	</div>

	<div id="tabs-4">
	<?php require ('settings.inc.php'); ?>
	</div>

</div>  
</div>
<script>
    jQuery("#tabs, #subtabs").tabs();
    refreshForm();
</script>

<?php require (AT_INCLUDE_PATH.'footer.inc.php'); ?>