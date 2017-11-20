'use strict';

// Global variables.
var browser = browser;
var promises = true;
var customStorage = {};
var listenUrls = ['<all_urls>'];

// If browser is not defined, the plugin was loaded into Google Chrome.
// Set the browser variable and other differences accordingly.
if (typeof browser === 'undefined') {
  browser = chrome;
  promises = false;
  listenUrls = ['http://*/*', 'https://*/*'];
}

/**
 * Checks if a host is blacklisted or not.
 */
function isBlacklisted(host) {
  return new Promise(function(resolve) {
    if (promises) {
      browser.storage.local.get(host).then(function(item) {
        resolve(host in item);
      });
    } else {
      browser.storage.local.get(host, function(items) {
        resolve(host in items);
      });
    }
  });
}

/**
 * Adds a 'Content-Security-Policy' response header with "script-src 'none'"
 * if the given host is blacklisted.
 */
function addHeader(details) {
  var host = new URL(details.url).hostname;
  var headers = details.responseHeaders;

  if (promises) {
    return new Promise(function(resolve) {
      isBlacklisted(host).then(function(blacklisted) {
        if (blacklisted) {
          headers.push({
            name: 'Content-Security-Policy',
            value: "script-src 'none';"
          });
        }

        resolve({responseHeaders: headers});
      });
    });
  } else {
    var blacklisted = false;

    if (host in customStorage) {
      blacklisted = customStorage[host];
    }

    if (blacklisted) {
      headers.push({
        name: 'Content-Security-Policy',
        value: "script-src 'none';"
      });

      return {responseHeaders: headers};
    }
  }
}

/**
 * Checks if a host is blacklisted or not and saves it in our 'customStorage'.
 */
function initCustomStorage(details) {
  var host = new URL(details.url).hostname;

  isBlacklisted(host).then(function(blacklisted) {
    customStorage[host] = blacklisted;
  });
}

if (!promises) {
  /**
   * On Google Chrome, we need can't add a onHeadersReceived listener returning
   * a promise/callback.
   * Therefor, check if the host is blacklisted already with a onBeforeRequest
   * listener.
   */
  browser.webRequest.onBeforeRequest.addListener(
    initCustomStorage,
    {
      urls: listenUrls,
      types: ['main_frame', 'sub_frame']
    },
    ['blocking']
  );
}

/**
 * Add a onHeadersReceived listener to modify the response headers if needed.
 */
browser.webRequest.onHeadersReceived.addListener(
  addHeader,
  {
    urls: listenUrls,
    types: ['main_frame', 'sub_frame']
  },
  ['blocking', 'responseHeaders']
);

/**
 * Update the extension title and icon when a tab has been updated.
 */
browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  var url = changeInfo.url || tab.url;

  if (url) {
    var host = new URL(url).hostname;
    isBlacklisted(host).then(function(blacklisted) {
      browser.pageAction.setIcon({
        path: {
          '48': blacklisted ? 'icons/48/js-off.png' : 'icons/48/js-on.png',
          '128': blacklisted ? 'icons/128/js-off.png' : 'icons/128/js-on.png'
        },
        tabId: tabId
      });

      browser.pageAction.setTitle({
        title: (blacklisted ? 'Enable' : 'Disable') + ' Javascript',
        tabId: tabId
      });

      browser.pageAction.show(tabId);
    });
  } else {
    browser.pageAction.show(tabId);
  }
});

/**
 * Update our blacklist when the user interacts with the app icon.
 * Also updates and reloads the specific tab.
 */
browser.pageAction.onClicked.addListener(function(tab) {
  var host = new URL(tab.url).hostname;
  isBlacklisted(host).then(function(blacklisted) {
    if (blacklisted) {
      if (promises) {
        browser.storage.local.remove(host).then(function() {
          browser.tabs.reload();
        });
      } else {
        browser.storage.local.remove(host, function() {
          browser.tabs.update(tab.id, {url: tab.url});
        });
      }
    } else {
      var item = {};

      item[host] = (new Date()).toISOString();

      if (promises) {
        browser.storage.local.set(item).then(function () {
          browser.tabs.reload();
        });
      } else {
        browser.storage.local.set(item, function() {
          browser.tabs.update(tab.id, {url: tab.url});
        });
      }
    }
  });
});
