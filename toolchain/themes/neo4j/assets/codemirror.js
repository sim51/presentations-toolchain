'use strict';

var elements = document.getElementsByTagName("textarea");
for( var i=0; i< elements.length; i++) {
    var element = elements[i];
    console.log(element.getAttribute("class"));
    if ( element.getAttribute("class") ){
      var mode = element.getAttribute("class").split(" ")[0];
      console.log(mode);
      CodeMirror.fromTextArea(element, { 'readonly':true, 'mode':mode, 'theme':'neo', 'lineNumbers':true, 'lineWrapping':true, height:'auto'});
    }
}
 
