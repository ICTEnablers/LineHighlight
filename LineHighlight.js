/**
 *  A bookmarklet to highlight the line the user has clicked on
 * 
 *  MIT-licensed
 * @author Erik Zetterström, ICT Enablers
 * http://www.ictenablers.com
 */



;(function(){

var originalHTML = null;
var previousTarget = null;
var previousTargetHTML = null;
 
var init = function() {
    document.addEventListener('click',myClickHandler,false);
}

var getHTMLOfSelection = function() {
      var range;
      if (window.getSelection) {
        var selection = window.getSelection();
        if (selection.rangeCount > 0) {
          range = selection.getRangeAt(0);
          var clonedSelection = range.cloneContents();
          var div = document.createElement('div');
          div.appendChild(clonedSelection);
          return div.innerHTML;
        }
        else {
          return '';
        }
      }
      else {
        return '';
      }
 }
    
 var trimTags = function(strHTML) {
     //cloneContents closes any open tags check if the string ends with tags
     //even if there are original ending tags remove these anyway as it is only the content we want to change
     while(strHTML[strHTML.length-1]=='>') {
	var startIndexOfTag = strHTML.length-1;
	startIndexOfTag=strHTML.lastIndexOf('<');
	strHTML = strHTML.slice(0,startIndexOfTag);
			
	//Trim any accidental ' ' in between tags
	while(strHTML[strHTML.length-1]==' ') {
     		strHTML = strHTML.slice(0,strHTML.length-1);
	}	
     }
     
     //cloneContents closes any open tags check if the string begins with tags
     //even if there are original opening tags remove these anyway as it is only the content we want to change
     while(strHTML[0]=='<') {
     	var endIndexOfTag = 0;
	endIndexOfTag=strHTML.indexOf('>');
			
	//Fix for Firefox
	var tag = strHTML.slice(0,endIndexOfTag);
	var tagContainsAccessibility = -1;
	tagContainsAccessibility = tag.search("accessibility");
	if(tagContainsAccessibility!=-1) {
		strHTML = strHTML.slice(endIndexOfTag+1,strHTML.length);
		endIndexOfTag=strHTML.indexOf('>');	
	}
	strHTML = strHTML.slice(endIndexOfTag+1,strHTML.length);
			
	//Ugly fix for Firefox
	if(strHTML[0]=='^') {
		strHTML = strHTML.slice(1,strHTML.length);
	}	
			
	//Trim any accidental ' ' in between tags
	while(strHTML[0]==' ') {
        	strHTML = strHTML.slice(1,strHTML.length);
   	}
     }
     return strHTML;
}
 
var addSpanTags = function(lineStr) {
	
    //find the first closing tag in the string that stops the <span style=...>
     var firstClosingTagIndex = null;
     firstClosingTagIndex=lineStr.indexOf('<');
     var endIndexOfTag = lineStr.indexOf('>');
     	
     //Make sure it is a closing tag
     if(firstClosingTagIndex!=null && lineStr[firstClosingTagIndex+1]=='/') {
     	var firstPart = lineStr.slice(0,firstClosingTagIndex);
	var tag = lineStr.slice(firstClosingTagIndex,endIndexOfTag+1);
     	var secondPart = lineStr.slice(endIndexOfTag+1,lineStr.length);
     	return (firstPart+"</span>"+tag+"<span style=\"background-color: yellow;\">"+addSpanTags(secondPart));
     }
     else {
     	return lineStr;
     }
}
 
 var myClickHandler = function(event) {
      var backwardSelection = null;
      var forwardSelection = null;
      var lineHTML = null;
   	  
      var selectionPoint = window.getSelection();
      selectionPoint.modify('extend','backward','lineboundary');        
      backwardSelection = getHTMLOfSelection();
         
      //trim leading ' '
      while(backwardSelection[0]==' ') {
     	backwardSelection = backwardSelection.slice(1,backwardSelection.length);
      }
      backwardSelection = trimTags(backwardSelection);

      selectionPoint.modify('extend','forward','lineboundary');
      forwardSelection = getHTMLOfSelection();
      //trim ending ' '
      while(forwardSelection[forwardSelection.length-1]==' ') {
     	forwardSelection = forwardSelection.slice(0,forwardSelection.length-1);
      }
      forwardSelection = trimTags(forwardSelection);
     
      lineHTML = backwardSelection+forwardSelection;
     
      selectionPoint.modify('move','forward','character');
   	
      //Restore the previously clicked line	
      if(previousTarget != null) {
   	previousTarget.innerHTML = originalHTML;
      }
      previousTarget = event.target;
   	 
      var org = event.target.innerHTML;
      //Save for restoring
      originalHTML = org;
   	
     var res = null;
     var lineCopy = lineHTML;
     
     //Add <span> elements as needed
     lineCopy = addSpanTags(lineCopy);

     //Change the selected line      
     if(org.length>lineHTML.length) {
     	res = org.replace(lineHTML,"<span style=\"background-color: yellow;\">"+lineCopy+"</span>");
     }
     else {
     	res = "<span style=\"background-color: yellow;\">"+org+"</span>";
     } 
      
     event.target.innerHTML = res;
}


init();
	
})(window);
