'use strict';

(function() {
  var tags = document.getElementsByTagName('noscript');

  for (var i = 0; i < tags.length; i++) {
    tags[i].outerHTML = tags[i].outerHTML.replace(/noscript/g, 'div');
  }
})();
