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
<!-- ================================================================================================== -->    
    <div id="tabs-1">
         	<ul id="inbox_list">
         			<a href="#"><li class="inbox_list_item">
         				<table><tr>
         					<td><img class="picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	
                        	<td class="inbox_list_middle">
                        	<label class="inbox_list_name"><a href="##">Lorem ipsum</a></label>
                        	<span class="inbox_list_status">Online</span>
                        	<div class="inbox_list_info">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</div>
                        	</td>
                        	
                        	<td><span class="inbox_list_time"><nobr>April 6</nobr></span></td>
                        	
                        	<td><div class="inbox_list_read"><input title="Mark as Read" type="checkbox" class="inbox_list_read" id="1" onclick="read(jQuery(this).attr('id'))"/></div></td>
                        </tr></table>
                	</a></li>
                	
                	<a href="#"><li class="inbox_list_item">
         				<table><tr>
         					<td><img class="picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	
                        	<td class="inbox_list_middle">
                        	<label class="inbox_list_name"><a href="##">Lorem ipsum</a></label>
                        	<span class="inbox_list_status">Online</span>
                        	<div class="inbox_list_info">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</div>
                        	</td>
                        	
                        	<td><span class="inbox_list_time"><nobr>May 26</nobr></span></td>
                        	
                        	<td><div class="inbox_list_read"><input title="Mark as Read" type="checkbox" class="inbox_list_read" id="2" onclick="read(jQuery(this).attr('id'))"/></div></td>
                        </tr></table>
                	</a></li>
                	
                	<a href="#"><li class="inbox_list_item">
         				<table><tr>
         					<td><img class="picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	
                        	<td class="inbox_list_middle">
                        	<label class="inbox_list_name"><a href="##">Lorem ipsum</a></label>
                        	<span class="inbox_list_status"></span>
                        	<div class="inbox_list_info">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...</div>
                        	</td>
                        	
                        	<td><span class="inbox_list_time"><nobr>April 6</nobr></span></td>
                        	
                        	<td><div class="inbox_list_read"><input title="Mark as Read" type="checkbox" class="inbox_list_read" id="3" onclick="read(jQuery(this).attr('id'))"/></div></td>
                        </tr></table>
                	</a></li>
                        
           </ul>
	</div>
<!-- ================================================================================================== -->	
	<div id="tabs-2">	
		<div id="subtabs">
			<ul>
				<li><a href="#subtabs-1">Conversation 1</a> <span class="ui-icon ui-icon-close">Remove Tab</span></li>
				<li><a href="#subtabs-2">Conversation 2</a> <span class="ui-icon ui-icon-close">Remove Tab</span></li>
			</ul>
			<div id="subtabs-1">
				<ul class="conversations">
         			<li class="conversations_item">
         				<table><tr>
         					<td  class="conversations_picture">
                            <img class="picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/>
                        	</td>
                        	
                        	<td  class="conversations_middle">
                        	<label class="conversations_name"><a href="##">Lorem ipsum</a></label>
                        	<div class="conversations_msg">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
							</div>
                        	</td>
                        	
                        	<td class="conversations_time">
                        	<span><nobr>November 6, 2011</nobr></span>                            
                        	</td>
                        </tr></table>
                	</li> 
                	
                	<li class="conversations_item">
         				<table><tr>
         					<td  class="conversations_picture">
                            <img class="picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/>
                        	</td>
                        	
                        	<td  class="conversations_middle">
                        	<label class="conversations_name"><a href="##">Lorem ipsum</a></label>
                        	<div class="conversations_msg">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
							</div>
                        	</td>
                        	
                        	<td class="conversations_time">
                        	<span><nobr>April 6</nobr></span>                            
                        	</td>
                        </tr></table>
                	</li> 
                	
                	<li class="conversations_item">
         				<table><tr>
         					<td  class="conversations_picture">
                            <img class="picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/>
                        	</td>
                        	
                        	<td  class="conversations_middle">
                        	<label class="conversations_name"><a href="##">Lorem ipsum</a></label>
                        	<div class="conversations_msg">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
							</div>
                        	</td>
                        	
                        	<td class="conversations_time">
                        	<span><nobr>May 26</nobr></span>                            
                        	</td>
                        </tr></table>
                	</li>
           		</ul>
				<table class="conversations_table"><tr>
					<td class="conversations_table_spacer"></td>
					<td><textarea class="conversations_textarea" name="content"></textarea></td>
					<td class="conversations_table_button"><input class="conversations_send" type="button" label="submit" value="Send"/></td>
				</tr></table>
			</div>
		
			<div id="subtabs-2">
				<ul class="conversations">
         			<li class="conversations_item">
         				<table><tr>
         					<td  class="conversations_picture">
                            <img class="picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/>
                        	</td>
                        	
                        	<td  class="conversations_middle">
                        	<label class="conversations_name"><a href="##">Lorem ipsum</a></label>
                        	<div class="conversations_msg">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
							</div>
                        	</td>
                        	
                        	<td class="conversations_time">
                        	<span><nobr>November 6, 2011</nobr></span>                            
                        	</td>
                        </tr></table>
                	</li> 
                	
                	<li class="conversations_item">
         				<table><tr>
         					<td  class="conversations_picture">
                            <img class="picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/>
                        	</td>
                        	
                        	<td  class="conversations_middle">
                        	<label class="conversations_name"><a href="##">Lorem ipsum</a></label>
                        	<div class="conversations_msg">
							Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
							</div>
                        	</td>
                        	
                        	<td class="conversations_time">
                        	<span><nobr>April 6</nobr></span>                            
                        	</td>
                        </tr></table>
                	</li>    
           		</ul>
           		<table class="conversations_table"><tr>
					<td class="conversations_table_spacer"></td>
					<td><textarea class="conversations_textarea" name="content"></textarea></td>
					<td class="conversations_table_button"><input class="conversations_send" type="button" label="submit" value="Send"/></td>
				</tr></table>
			</div>
			
		</div>        		
	</div>
<!-- ================================================================================================== -->
	<div id="tabs-3">
	
		<div class="example">
            <!--<div class="fl-offScreen-hidden" tabindex="1">Image Reorderer: To use the keyboard:
                      Screen reader users turn off virtual cursor (insert + z).
                      Select an image using i, k, m or j.
                      Move an image using CTRL + i, k, m or j.
                      View an image by pressing Enter.
            </div>
 
            <div class="fl-reorderer-instructions" tabindex="-1">
                <strong>To use the keyboard:</strong>
                Select an image using i, k, m or j, or the arrow keys. Move an image using CTRL + [arrow key]. View an image by pressing Enter.
            </div>-->
    
            <div id="fluid-LayoutReorderer-sample2" class="columnSetup3 fluid-vertical-order">
               
                <div class="flc-reorderer-dropWarning fl-reorderer-dropWarning">Can't place above locked portlet</div>
 
                <div class="myColumn fl-container-flex35 fl-force-left">
                    <h2>Classmates</h2>
                    <div><table class="friends_item"><tr>
         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	<td><span class="friends_item_name"><strong>Lorem ipsum 1</strong></span></td>
                        	<td><span class="friends_item_status">Online</span></td>
                    </tr></table></div>
                    <div><table class="friends_item"><tr>
         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	<td><span class="friends_item_name"><strong>Lorem ipsum 2</strong></span></td>
                        	<td><span class="friends_item_status">Online</span></td>
                    </tr></table></div><div><table class="friends_item"><tr>
         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	<td><span class="friends_item_name"><strong>Lorem ipsum 3</strong></span></td>
                        	<td><span class="friends_item_status"></span></td>
                    </tr></table></div><div><table class="friends_item"><tr>
         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	<td><span class="friends_item_name"><strong>Lorem ipsum 4</strong></span></td>
                        	<td><span class="friends_item_status">Online</span></td>
                    </tr></table></div><div><table class="friends_item"><tr>
         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	<td><span class="friends_item_name"><strong>Lorem ipsum 5</strong></span></td>
                        	<td><span class="friends_item_status"></span></td>
                    </tr></table></div><div><table class="friends_item"><tr>
         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	<td><span class="friends_item_name"><strong>Lorem ipsum 6</strong></span></td>
                        	<td><span class="friends_item_status">Online</span></td>
                    </tr></table></div>
                </div>
                <div class="myColumn fl-container-flex35 fl-force-left">
                    <h2>Chat room members</h2>
                    <div><table class="friends_item"><tr>
         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	<td><span class="friends_item_name"><strong>Lorem ipsum 0</strong></span></td>
                        	<td><span class="friends_item_status">Online</span></td>
                    </tr></table></div>
                </div>
            </div>
        </div>
        <script type="text/javascript">
            demo.initLayoutReorderer();
        </script> 
     
	</div>
<!-- ================================================================================================== -->
	<div id="tabs-4"> 
        <div id="settings">
        	<div class="settings_category"><strong>Chat</strong></div>
        		<input type="radio" name="settings_chat" value="on" checked/>On<input type="radio" name="settings_chat" value="off" />Off
        	<div class="settings_category"><strong>History</strong>
        		
        		<img class="settings_details" id="settings_history_opener" src="<?php echo $_base_path; ?>/images/help.png" alt="details"/>
        		<div id="settings_history_dialog" title="History">
					<p>This is the default dialog which is useful for displaying information. The dialog window can be moved, resized and closed with the 'x' icon.</p>
				</div>
        		
        	</div>
        		<input type="radio" name="settings_history" value="save" checked/>Save<input type="radio" name="settings_history" value="nosave" />Never save
        	<div class="settings_category"><strong>Sound</strong></div>
        		<input type="radio" name="settings_sound" value="on" checked/>On<input type="radio" name="settings_sound" value="off" />Off
        	<div class="settings_category"><strong>Notifications</strong></div>
        		<input type="radio" name="settings_nitifications" value="page" checked/>This page<input type="radio" name="settings_nitifications" value="everywhere" />Everywhere
        	<div class="settings_category">
        		<strong>Everyone can see me except</strong>
        		
        		<img class="settings_details" id="settings_blacklist_opener" src="<?php echo $_base_path; ?>/images/help.png" alt="details"/>
        		<div id="settings_blacklist_dialog" title="Blacklist">
					<p>This is the default dialog which is useful for displaying information. The dialog window can be moved, resized and closed with the 'x' icon.</p>
				</div>
				
        	</div>
        		<table id="settings_table"><tr>
        			<td><textarea id="settings_blacklist" name="blacklist"></textarea></td>
        			<td><input id="settings_blacklist_upd" type="button" label="submit" value="Upate"/></td>
        		</tr></table>
        	<input id="settings_save" type="button" label="submit" value="Save changes"/>
        </div>
	</div>
<!-- ================================================================================================== -->
</div>  
</div>
<script>
    jQuery("#tabs, #subtabs").tabs();
</script>

<?php require (AT_INCLUDE_PATH.'footer.inc.php'); ?>