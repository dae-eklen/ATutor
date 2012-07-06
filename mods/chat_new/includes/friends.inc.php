        
        <div id="friends">
        	<table><tr>
        		<td class="friends_column fl-container-flex35">
                    <h2>Classmates</h2>
                    <div id="friends_list">
                    <div class="friends_column_wrapper" id="f1" onclick="changeCategory(jQuery(this).attr('id'));">
                    	<table class="friends_item"><tr>
         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	<td><span class="friends_item_name">Lorem ipsum 1</span></td>
                        	<td><span class="friends_item_status">Online</span></td>
                    	</tr></table>
                    </div>
                    <div class="friends_column_wrapper" id="f2" onclick="changeCategory(jQuery(this).attr('id'));">
                    	<table class="friends_item"><tr>
         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	<td><span class="friends_item_name">Lorem ipsum 2</span></td>
                        	<td><span class="friends_item_status">Online</span></td>
                    	</tr></table>
                    </div>
                    <div class="friends_column_wrapper" id="f3" onclick="changeCategory(jQuery(this).attr('id'));">
                    	<table class="friends_item"><tr>
         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	<td><span class="friends_item_name">Lorem ipsum 3</td>
                        	<td><span class="friends_item_status"></span></td>
                    	</tr></table>
                    </div>
                    <div class="friends_column_wrapper" id="f4" onclick="changeCategory(jQuery(this).attr('id'));">
                    	<table class="friends_item"><tr>
         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	<td><span class="friends_item_name">Lorem ipsum 4</td>
                        	<td><span class="friends_item_status">Online</span></td>
                    	</tr></table>
                    </div>
                    <div class="friends_column_wrapper" id="f5" onclick="changeCategory(jQuery(this).attr('id'));">
                    	<table class="friends_item"><tr>
         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	<td><span class="friends_item_name">Lorem ipsum 5</span></td>
                        	<td><span class="friends_item_status"></span></td>
                    	</tr></table>
                    </div>
                    <div class="friends_column_wrapper" id="f6" onclick="changeCategory(jQuery(this).attr('id'));">
                    	<table class="friends_item"><tr>
         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	<td><span class="friends_item_name">Lorem ipsum 6</span></td>
                        	<td><span class="friends_item_status">Online</span></td>
                    	</tr></table>
                    </div>
                    </div>
                </td>
                
                <td class="friends_spacer"></td>
                
                <td class="friends_column fl-container-flex35">
                    <h2>Chat room members</h2>
                    <div id="friends_members">
                    <div class="friends_column_wrapper" id="f0" onclick="changeCategory(jQuery(this).attr('id'));">
                    	<table class="friends_item"><tr>
         					<td><img class="friends_item_picture" src="<?php echo $_base_path; ?>/images/nophoto.gif" alt="userphoto"/></td>
                        	<td><span class="friends_item_name">Lorem ipsum 0</span></td>
                        	<td><span class="friends_item_status">Online</span></td>
                    	</tr></table>
                    </div>
                    </div>
                    
                    <div id="friends_selected">
	                    Members selected: <span id="nr_of_members">1</span><br/>
	                    <div id="friends_selected_label">Please specify group name:</div>
	                    <input id="groupname"  maxlength="100" type="text" onkeypress="refreshForm();"/><br/>
	                    <input id="friends_selected_bnt" type="button" label="submit" value="Create chat"/>
                    </div>
                </td>
                
        	</tr></table>
        </div>
     