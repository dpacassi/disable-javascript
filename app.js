'use strict';

(function() {
  // Local variables.
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

  // Change the default browserAction icon if supported to prevent flickering.
  if (typeof browser.browserAction.setIcon !== 'undefined') {
    browser.browserAction.setIcon({
      path: {
        '48': 'icons/48/js-on.png',
        '128': 'icons/128/js-on.png'
      }
    });
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
        if (typeof browser.browserAction.setIcon !== 'undefined') {
          browser.browserAction.setIcon({
            path: {
              '48': blacklisted ? 'icons/48/js-off.png' : 'icons/48/js-on.png',
              '128': blacklisted ? 'icons/128/js-off.png' : 'icons/128/js-on.png'
            },
            tabId: tabId
          });
        }

        browser.browserAction.setTitle({
          title: (blacklisted ? 'Enable' : 'Disable') + ' Javascript',
          tabId: tabId
        });
      });
    }
  });

  /**
   * Update our blacklist when the user interacts with the app icon (or the
   * menu item in Firefox for Android).
   * Also updates and reloads the specific tab.
   */
  browser.browserAction.onClicked.addListener(function(tab) {
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
          browser.storage.local.set(item).then(function() {
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

  /**
   * Reload active tabs after web extension installation.
   */
  browser.runtime.onInstalled.addListener(function() {
    if (promises) {
      browser.tabs.query({}).then(function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
          browser.tabs.reload(tabs[i].id);
        }
      });
    } else {
      browser.tabs.query({}, function(tabs) {
        for (var i = 0; i < tabs.length; i++) {
          browser.tabs.update(tabs[i].id, {url: tabs[i].url});
        }
      });
    }
  });
})();
