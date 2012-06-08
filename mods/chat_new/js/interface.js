

function read(chbox){
	// console.log(chbox);
	var clickedChbox = document.getElementById(chbox);
	
	if (jQuery(clickedChbox).is(":checked")){
		var parentItem = findParentNode("inbox_list_item", clickedChbox);
		jQuery(parentItem).removeClass("inbox_list_item");
		jQuery(parentItem).addClass("inbox_list_item_checked");
		jQuery(clickedChbox).attr("title").value = "Mark as Unread";
	}
	else{
		var parentItem = findParentNode("inbox_list_item_checked", clickedChbox);
		jQuery(parentItem).removeClass("inbox_list_item_checked");
		jQuery(parentItem).addClass("inbox_list_item");
		jQuery(clickedChbox).attr("title").value = "Mark as Read";
	}
}


function findParentNode(parentClass, childObj) {
    var testObj = childObj.parentNode;
    var count = 1;
    while(testObj.getAttribute('class') != parentClass) {
        testObj = testObj.parentNode;
        count++;
    }
    
    // console.log(testObj);
    return testObj;
}