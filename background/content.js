'use strict';

(function() {
  var tags = document.getElementsByTagName('noscript');

  for (var i = 0; i < tags.length; i++) {
    if (tags[i].firstChild) {
      var newDiv = document.createElement('div');
      newDiv.innerHTML = tags[i].innerHTML;
      tags[i].parentNode.replaceChild(newDiv, tags[i]);
    }
  }
})();
