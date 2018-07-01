
'use strict';

var browser = browser;
var promises = true;

if (typeof browser === 'undefined') {
  browser = chrome;
  promises = false;
}

function domContentLoaded() {
  var manifest = browser.runtime.getManifest();
  var versionHTML = ' <span class="version">(v' + manifest.version + ')</span>';

  document.getElementById('page-title').innerHTML += versionHTML;
  document.getElementById('whats-new-title').innerHTML += versionHTML;
}

document.addEventListener('DOMContentLoaded', domContentLoaded);
