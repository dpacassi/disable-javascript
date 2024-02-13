'use strict';

(function() {
  var tags = document.getElementsByTagName('noscript');

  for (var i = tags.length - 1; i >= 0; i--) {
    if (tags[i].firstChild) {
      var newDiv = document.createElement('div');
      var a = tags[i].getAttributeNames();

      // Copy over <noscript> content.
      newDiv.innerHTML = tags[i].innerHTML;

      // Copy over <noscript> attributes.
      for (var k = 0; k < a.length; k++) {
        newDiv.setAttribute(a[k], tags[i].getAttribute(a[k]));
      }

      tags[i].parentNode.replaceChild(newDiv, tags[i]);
    }
  }
})();
