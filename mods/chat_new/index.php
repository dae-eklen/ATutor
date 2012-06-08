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
        <li class="ui-state-default ui-corner-top ui-tabs-selected ui-state-active ui-state-focus"><a href="#tabs-2">Conversations</a></li>
        <li class="ui-state-default ui-corner-top" role="presentation"><a href="#tabs-3">Friends</a></li>
        <li class="ui-state-default ui-corner-top" role="presentation"><a href="#tabs-4">Settings</a></li>
    </ul>
    
    <div id="tabs-1">
         	<ul id="inbox_list">
         			<a href="#"><li class="inbox_list_item">
         				<table><tr>
         					<td>
                            <div class="picture"></div>
                        	</td>
                        	
                        	<td class="inbox_list_middle">
                        	<label class="inbox_list_name"><a href="##">Lorem ipsum</a></label>
                        	<span class="inbox_list_status">Online</span>
                        	<div class="inbox_list_info">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</div>
                        	</td>
                        	
                        	<td>
                        	<span class="inbox_list_time"><nobr>April 6</nobr></span>                            
                        	</td>
                        	
                        	<td>
                        	<div class="inbox_list_read"><input title="Mark as Read" type="checkbox" class="inbox_list_read" id="1" onclick="read(jQuery(this).attr('id'))"/></div>                            
                        	</td>
                        </tr></table>
                	</a></li>
                	
                	<a href="#"><li class="inbox_list_item">
         				<table><tr>
         					<td>
                            <div class="picture"></div>
                        	</td>
                        	
                        	<td class="inbox_list_middle">
                        	<label class="inbox_list_name"><a href="##">Lorem ipsum</a></label>
                        	<span class="inbox_list_status">Online</span>
                        	<div class="info">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</div>
                        	</td>
                        	
                        	<td>
                        	<div class="inbox_list_time"><nobr>April 6</nobr></div>                            
                        	</td>
                        	
                        	<td>
                        	<div class="inbox_list_read"><input title="Mark as Read" type="checkbox" class="inbox_list_read" id="2" onclick="read(jQuery(this).attr('id'))"/></div>                            
                        	</td>
                        </tr></table>
                	</a></li>
                	
                	<a href="#"><li class="inbox_list_item">
         				<table><tr>
         					<td>
                            <div class="picture"></div>
                        	</td>
                        	
                        	<td class="inbox_list_middle">
                        	<label class="inbox_list_name"><a href="##">Lorem ipsum</a></label>
                        	<span class="inbox_list_status">Online</span>
                        	<div class="info">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</div>
                        	</td>
                        	
                        	<td>
                        	<div class="inbox_list_time"><nobr>April 6</nobr></div>                            
                        	</td>
                        	
                        	<td>
                        	<div class="inbox_list_read"><input title="Mark as Read" type="checkbox" class="inbox_list_read" id="3" onclick="read(jQuery(this).attr('id'))"/></div>                            
                        	</td>
                        </tr></table>
                	</a></li>          
                        
           </ul>
	</div>
	
	<div id="tabs-2"> 
        <ul id="conversations">
         			<li class="conversations_item">
         				<table><tr>
         					<td>
                            <div class="picture"></div>
                        	</td>
                        	
                        	<td  class="conversations_middle">
                        	<label class="conversations_name"><a href="##">Lorem ipsum</a></label>
                        	<div class="conversations_msg">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
							</div>
                        	</td>
                        	
                        	<td>
                        	<span class="conversations_time"><nobr>April 6</nobr></span>                            
                        	</td>
                        </tr></table>
                	</li>
                	
                	<li class="conversations_item">
         				<table><tr>
         					<td>
                            <div class="picture"></div>
                        	</td>
                        	
                        	<td  class="conversations_middle">
                        	<label class="conversations_name"><a href="##">Lorem ipsum</a></label>
                        	<div class="conversations_msg">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
							</div>
                        	</td>
                        	
                        	<td>
                        	<span class="conversations_time"><nobr>April 6</nobr></span>                            
                        	</td>
                        </tr></table>
                	</li>  
                	
                	<li class="conversations_item">
         				<table><tr>
         					<td>
                            <div class="picture"></div>
                        	</td>
                        	
                        	<td  class="conversations_middle">
                        	<label class="conversations_name"><a href="##">Lorem ipsum</a></label>
                        	<div class="conversations_msg">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit.
							</div>
                        	</td>
                        	
                        	<td>
                        	<span class="conversations_time"><nobr>April 6</nobr></span>                            
                        	</td>
                        </tr></table>
                	</li>     
                        
           </ul>
	</div>
	
	<div id="tabs-3"> 
        Content 3
	</div>
	
	<div id="tabs-4"> 
        Content 4
	</div>
</div>  
</div>
<script>
    jQuery('#tabs').tabs();
</script>

<?php require (AT_INCLUDE_PATH.'footer.inc.php'); ?>