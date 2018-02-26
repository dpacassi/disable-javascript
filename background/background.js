'use strict';

var browser = browser;

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
  var tabSettings = {};
  var _defaultState = 'on';
  var _disableBehavior = 'domain';
  var _settingsPrefix = 'setting-';

  if (typeof browser === 'undefined') {
    // If browser is not defined, the plugin was loaded into Google Chrome.
    // Set the browser variable and other differences accordingly.
    browser = chrome;
    promises = false;
    listenUrls = ['http://*/*', 'https://*/*'];
    browser.menus = browser.contextMenus;
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
   * Gets the setting value for a key.
   */
  function getSetting(name) {
    name = _settingsPrefix + name;

    return new Promise(function(resolve) {
      if (promises) {
        browser.storage.local.get(name).then(function(items) {
          resolve(items[name]);
        });
      } else {
        browser.storage.local.get(name, function(items) {
          resolve(items[name]);
        });
      }
    });
  }

  /**
   * Returns a promise with the default state value.
   */
  function getDefaultState() {
    return new Promise(function(resolve) {
      getSetting('default_state').then(function(result) {
        resolve(result);
      });
    });
  }

  /**
   * Returns a promise with the default disable behavior.
   */
  function getDisableBehavior() {
    return new Promise(function(resolve) {
      getSetting('disable_behavior').then(function(result) {
        resolve(result);
      });
    });
  }

  /**
   * Checks if a host is listed.
   */
  function isListedHost(host) {
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
   * Checks if JS is enabled for a given host and tab.
   */
  function isJSEnabled(host, tabId) {
    return new Promise(function(resolve) {
      getDefaultState().then(function(defaultState) {
        getDisableBehavior().then(function(disableBehavior) {
          if (disableBehavior === 'domain') {
            // Disable behavior by domain.
            isListedHost(host).then(function(listed) {
              var jsEnabled = false;

              if ((defaultState === 'on' && !listed) || (defaultState !== 'on' && listed)) {
                jsEnabled = true;
              }

              resolve(jsEnabled);
            });
          } else if (disableBehavior === 'tab') {
            // Disable behavior by tab.
            var jsEnabled = defaultState === 'on';

            if (typeof tabId !== 'undefined' && tabSettings.hasOwnProperty(tabId)) {
              jsEnabled = tabSettings[tabId];
            }

            resolve(jsEnabled);
          }
        });
      });
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
   * depending on the host and tabId.
   */
  function addHeader(details) {
    var host = new URL(details.url).hostname;
    var headers = details.responseHeaders;

    if (promises) {
      return new Promise(function(resolve) {
        isJSEnabled(host, details.tabId).then(function(jsEnabled) {
          if (!jsEnabled) {
            headers.push({
              name: 'Content-Security-Policy',
              value: "script-src 'none';"
            });
          }

          resolve({responseHeaders: headers});
        });
      });
    } else {
      var jsEnabled = _defaultState === 'on';

      if (_disableBehavior === 'domain') {
        if (customStorage.hasOwnProperty(host)) {
          jsEnabled = customStorage[host];
        }
      } else if (_disableBehavior === 'tab') {
        if (tabSettings.hasOwnProperty(details.tabId)) {
          jsEnabled = tabSettings[details.tabId];
        }
      }

      if (!jsEnabled) {
        headers.push({
          name: 'Content-Security-Policy',
          value: "script-src 'none';"
        });

        return {responseHeaders: headers};
      }
    }
  }

  /**
   * Checks if a host is listed or not and saves it in our 'customStorage'.
   */
  function initCustomStorage(details) {
    var host = new URL(details.url).hostname;

    isJSEnabled(host).then(function(listed) {
      customStorage[host] = listed;
    });
  }

  /**
   * Toggles the JS state of a given tab.
   */
  function toggleJSState(tab) {
    var host = new URL(tab.url).hostname;

    getDefaultState().then(function(defaultState) {
      getDisableBehavior().then(function(disableBehavior) {
        if (disableBehavior === 'domain') {
          isListedHost(host).then(function(listed) {
            if (listed) {
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
        } else if (disableBehavior === 'tab') {
          var jsEnabled = defaultState === 'on';

          if (tabSettings.hasOwnProperty(tab.id)) {
            jsEnabled = tabSettings[tab.id];
          }

          jsEnabled = !jsEnabled;
          tabSettings[tab.id] = jsEnabled;

          if (promises) {
            browser.tabs.reload();
          } else {
            browser.tabs.update(tab.id, {url: tab.url});
          }
        }
      });
    });
  }

  if (!promises) {
    /**
     * On browsers without promises, we need can't add a onHeadersReceived listener
     * returning a promise/callback.
     * Therefor, check if the host is listed already with a onBeforeRequest
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

    if (url) {
      var host = new URL(url).hostname;

      isJSEnabled(host, tabId).then(function(jsEnabled) {
        if (typeof browser.browserAction.setIcon !== 'undefined') {
          browser.browserAction.setIcon(getIcon(jsEnabled, tabId));
        }

        browser.browserAction.setTitle({
          title: (jsEnabled ? 'Disable' : 'Enable') + ' Javascript',
          tabId: tabId
        });

        // Only if supported.
        if (typeof browser.menus !== 'undefined') {
          browser.menus.update('toggle-js', {
            title: (jsEnabled ? 'Disable' : 'Enable') + ' JavaScript'
          });
        }
      });
    }
  });

  /**
   * Update the JS state when the user interacts with the app icon (or the
   * menu item in Firefox for Android).
   * Also updates and reloads the specific tab.
   */
  browser.browserAction.onClicked.addListener(toggleJSState);

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

  // Only if supported.
  if (typeof browser.menus !== 'undefined') {
    /**
     * Create the browser action menu item to open the settings page.
     */
    browser.menus.create({
      id: 'settings',
      title: browser.i18n.getMessage('menuItemSettings'),
      contexts: ['browser_action']
    });

    /**
     * Create the browser action menu item to open the about page.
     */
    browser.menus.create({
      id: 'about',
      title: 'About Disable JavaScript',
      contexts: ['browser_action']
    });

    /**
     * Create the page menu item to toggle the JavaScript state.
     */
    browser.menus.create({
      id: 'toggle-js',
      title: 'Disable JavaScript',
      contexts: ['page']
    });

    /**
     * Open the settings page when the menu item was clicked.
     */
    browser.menus.onClicked.addListener(function(info, tab) {
      switch (info.menuItemId) {
        case 'settings':
          browser.runtime.openOptionsPage();
          break;

        case 'about':
          browser.tabs.create({url: './pages/about.html'});
          break;

        case 'toggle-js':
          toggleJSState(tab);
          break;
      }
    });
  }

  /**
   * Listen to messages from options.js.
   */
  browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch (request.type) {
      // Change the default icon if the default state changes.
      case 'default_state':
        _defaultState = request.value;

        if (typeof browser.browserAction.setIcon !== 'undefined') {
          browser.browserAction.setIcon(getIcon(request.value === 'on'));
        }
        break;

      case 'disable_behavior':
        _disableBehavior = request.value;
        break;
    }
  });

  // Only if supported.
  if (typeof browser.commands !== 'undefined') {
    /**
     * Listen to shortcut commands.
     */
    browser.commands.onCommand.addListener(function(command) {
      switch (command) {
        case 'toggle-state':
          if (promises) {
            browser.tabs.query({active:true}).then(function(tab) {
              toggleJSState(tab[0]);
            });
          } else {
            browser.tabs.query({active:true}, function(tab) {
              toggleJSState(tab[0]);
            });
          }
          break;

        case 'open-settings':
          browser.runtime.openOptionsPage();
          break;
      }
    });
  }

  /**
   * Ensure all needed settings are set.
   */
  browser.runtime.onInstalled.addListener(function(details) {
    preEnsureSettings();
    browser.tabs.create({url: './pages/about.html'});
  });

  // Init the _defaultState variable with the settings value.
  getDefaultState().then(function(defaultState) {
    if (typeof defaultState !== 'undefined') {
      _defaultState = defaultState;
    }
  });

  // Init the _disableBehavior variable with the settings value.
  getDisableBehavior().then(function(disableBehavior) {
    if (typeof disableBehavior !== 'undefined') {
      _disableBehavior = disableBehavior;
    }
  });
})(browser);
