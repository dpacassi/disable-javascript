'use strict';

(function(browser) {
  // Local variables.
  var browser = browser;
  var promises = true;
  var customStorage = {};
  var listenUrls = ['<all_urls>'];
  var browserName = 'firefox';
  var defaultSettings = {
    'setting-default_state': 'on',
    'setting-disable_behavior': 'domain'
  };

  if (typeof browser === 'undefined') {
    // If browser is not defined, the plugin was loaded into Google Chrome.
    // Set the browser variable and other differences accordingly.
    browser = chrome;
    promises = false;
    listenUrls = ['http://*/*', 'https://*/*'];
    browserName = 'chrome';
  } else if (typeof browser.runtime.getBrowserInfo === 'undefined') {
    // If browser.runtime.getBrowserInfo is not defined, then we're on
    // Microsoft Edge. However, we can't use the function at the moment
    // as even in Firefox it doesn't return any data.
    promises = false;
    browserName = 'edge';
  }

  /**
   * Returns the correct app icon depending on the browser and JS status.
   */
  function getIcon(jsEnabled, tabId) {
    var icon = {};

    if (browserName === 'edge') {
      icon.path = {
        '40': jsEnabled ? 'icons/40/js-on.png' : 'icons/40/js-off.png'
      };
    } else {
      icon.path = {
        '48': jsEnabled ? 'icons/48/js-on.png' : 'icons/48/js-off.png',
        '128': jsEnabled ? 'icons/128/js-on.png' : 'icons/128/js-off.png'
      };
    }

    if (typeof tabId !== 'undefined') {
      icon.tabId = tabId;
    }

    return icon;
  }

  /**
   * Checks if a host is blacklisted or not.
   */
  function isBlacklisted(host) {
    return new Promise(function(resolve) {
      if (promises) {
        browser.storage.local.get(host).then(function(items) {
          resolve(host in items);
        });
      } else {
        browser.storage.local.get(host, function(items) {
          resolve(host in items);
        });
      }
    });
  }

  /**
   * Returns a promise with the default state value.
   */
  function getDefaultState() {
    return new Promise(function(resolve) {
      if (promises) {
        browser.storage.local.get('setting-default_state').then(function(items) {
          resolve(items['setting-default_state']);
        });
      } else {
        browser.storage.local.get('setting-default_state', function(items) {
          resolve(items['setting-default_state']);
        });
      }
    });
  }

  /**
   * Helper to ensure that at least default settings are set.
   */
  function ensureSettings(settingValues) {
    for (var setting in defaultSettings) {
      if (!settingValues.hasOwnProperty(setting)) {
        var settingObject = {};
        settingObject[setting] = defaultSettings[setting];

        browser.storage.local.set(settingObject);
      }
    }
  }

  /**
   * Helper to ensure that at least default settings are set.
   */
  function preEnsureSettings() {
    var settingNames = [];

    for (var setting in defaultSettings) {
      settingNames.push(setting);
    }

    if (promises) {
      browser.storage.local.get(settingNames).then(ensureSettings);
    } else {
      browser.storage.local.get(settingNames, ensureSettings);
    }
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
     * On browsers without promises, we need can't add a onHeadersReceived listener
     * returning a promise/callback.
     * Therefor, check if the host is blacklisted already with a onBeforeRequest
     * listener and use a custom Storage.
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

    getDefaultState().then(function(defaultState) {
      if (url) {
        var host = new URL(url).hostname;
        isBlacklisted(host).then(function(blacklisted) {
          var jsEnabled = defaultState === 'on';

          if (blacklisted) {
            jsEnabled = false;
          }

          if (typeof browser.browserAction.setIcon !== 'undefined') {
            browser.browserAction.setIcon(getIcon(jsEnabled, tabId));
          }

          browser.browserAction.setTitle({
            title: (jsEnabled ? 'Disable' : 'Enable') + ' Javascript',
            tabId: tabId
          });
        });
      }
    });
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

  /**
   * Create the menu item to open the settings page.
   */
  browser.menus.create({
    id: 'settings',
    title: browser.i18n.getMessage('menuItemSettings'),
    contexts: ['browser_action']
  });

  /**
   * Open the settings page when the menu item was clicked.
   */
  browser.menus.onClicked.addListener(function(info, tab) {
    switch (info.menuItemId) {
      case 'settings':
        browser.runtime.openOptionsPage();
        break;
    }
  });

  /**
   * Listen to messages from options.js.
   */
  browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.type) {
      // Change the default icon if the default state changes.
      case 'default_state':
        if (typeof browser.browserAction.setIcon !== 'undefined') {
          browser.browserAction.setIcon(getIcon(request.default_state === 'on'));
        }
        break;
    }
  });

  /**
   * Ensure all needed settings are set.
   */
  browser.runtime.onInstalled.addListener(function(details) {
    preEnsureSettings();
  });

  /**
   * Ensure all needed settings are set.
   */
  browser.runtime.onUpdateAvailable.addListener(function(details) {
    preEnsureSettings();
  });
})(browser);
