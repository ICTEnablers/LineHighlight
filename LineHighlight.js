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
    alert(init);
    document.addEventListener('click',myClickHandler,false);
}

var getHTMLOfSelection = function() {
      var range;
      if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        return range.htmlText;
      }
      else if (window.getSelection) {
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
 
 var myClickHandler = function(event) {
   	 var backwardSelection;
   	 var forwardSelection;
   	 var rowHTML;

     var selectionPoint = window.getSelection();
     selectionPoint.modify('extend','backward','lineboundary');        
     backwardSelection = getHTMLOfSelection();

     selectionPoint.modify('extend','forward','lineboundary');
     forwardSelection = getHTMLOfSelection();
     rowHTML = backwardSelection+forwardSelection;

   	 selectionPoint.modify('move','forward','character');
   	
   	 //Restore the previously clicked line	
	 if(previousTarget != null) {
   		previousTarget.innerHTML = originalHTML;
   	 }
   	 previousTarget = event.target;
   	 
   	 //Change the selected line
   	 var org = event.target.innerHTML;
   	 originalHTML = org; //Save for restoring
   	 
   	 //Change the current line
     var res = org.replace(rowHTML,"<span style=\"background-color: yellow;\">"+rowHTML+"</span>");       
     event.target.innerHTML = res;        
}

init();

})(window);
