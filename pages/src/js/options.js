
'use strict';

var browser = browser;
var promises = true;

if (typeof browser === 'undefined') {
  browser = chrome;
  promises = false;
}

function domContentLoaded() {
  var _settings = [{
    label: 'Default state',
    name: 'default_state',
    type: 'radio',
    options: [{
      label: 'JS on',
      value: 'on'
    }, {
      label: 'JS off',
      value: 'off'
    }]
  }, {
    label: 'Disable behavior',
    name: 'disable_behavior',
    type: 'radio',
    options: [{
      label: 'By domain',
      value: 'domain'
    }, {
      label: 'By tab',
      value: 'tab'
    }]
  }, {
    label: 'Enable shortcuts',
    name: 'shortcuts',
    type: 'radio',
    options: [{
      label: 'Yes',
      value: 'true'
    }, {
      label: 'No',
      value: 'false'
    }]
  }, {
    label: 'Enable context menu item',
    name: 'context_menu',
    type: 'radio',
    options: [{
      label: 'Yes',
      value: 'true'
    }, {
      label: 'No',
      value: 'false'
    }]
  }];

  var _settingsPrefix = 'setting-';
  var addDomainFormModal = document.getElementById('add-domain-form-modal');
  var addDomainForm = document.getElementById('add-domain-form');
  var addDomainFormInput = document.getElementById('add-domain-form__domain-name');
  var addDomainFormClose = document.getElementById('add-domain-form-modal__close');
  var addDomainFormIncludeSubDomains = document.getElementById('add-domain-form__include-sub-domains');

  /**
   * Builds the domain list.
   */
  function buildList(result) {
    var tbody = document.getElementById('domain-list--tbody');
    var newHTML = '';
    var hasEntries = false;
    var entries = [];
    var search = document.getElementById('search');

    for (var key in result) {
      if (!key.startsWith(_settingsPrefix)) {
        entries.push(key);
        hasEntries = true;
      }
    }

    for (var i = entries.length - 1; i >= 0; i--) {
      var key = entries[i];
      var includeSubDomains = false;
      var dateAdded;

      if (typeof result[key] === 'string') {
        dateAdded = new Date(result[key]);
      }  else {
        dateAdded = new Date(result[key]['date']);
        includeSubDomains = result[key]['include-subdomains'];
      }

      newHTML += '<tr>';
      newHTML += '<td>' + key + '</td>';
      newHTML += '<td>' + dateAdded.toLocaleDateString() + ' ' + dateAdded.toLocaleTimeString() + '</td>';
      newHTML += '<td>' + (includeSubDomains ? 'Yes' : 'No') + '</td>';
      newHTML += '</tr>';
    }

    if (newHTML.length === 0) {
      newHTML += '<tr>';
      newHTML += '<td class="empty" colspan="3">' + 'You have not added any domains to your white-/blacklist yet.' + '</td>';
      newHTML += '</tr>';

      search.disabled = true;
    } else {
      search.disabled = false;
    }

    tbody.innerHTML = newHTML;

    // Attach on row click events.
    var rows = tbody.querySelectorAll('tr');

    for (var i = 0; i < rows.length; i++) {
      rows[i].addEventListener('click', function() {
        if (this.classList.contains('active')) {
          // Remove active class.
          this.classList.remove('active');
        } else {
          // Remove the active class from all other rows.
          var otherRows = tbody.querySelectorAll('tr.active');

          for (var k = 0; k < otherRows.length; k++) {
            otherRows[k].classList.remove('active');
          }

          // Add active class.
          this.classList.add('active');

          // Update remove button.
          document.getElementById('remove').disabled = false;
        }
      });
    }

    if (hasEntries) {
      // Update remove all button.
      document.getElementById('remove-all').disabled = false;
    }
  }

  function processPreBuildList(result) {
    if (result[_settingsPrefix + 'disable_behavior'] === 'domain') {
      document.body.classList.remove('disable-behavior--tab');

      if (promises) {
        browser.storage.local.get().then(buildList);
      } else {
        browser.storage.local.get(buildList);
      }
    } else {
      // Don't build the list but hide the whole table.
      document.body.classList.add('disable-behavior--tab');
    }
  }

  /**
   * Helper for building the domain list.
   */
  function preBuildList() {
    document.getElementById('remove').disabled = true;
    document.getElementById('remove-all').disabled = true;

    if (promises) {
      browser.storage.local.get(_settingsPrefix + 'disable_behavior').then(processPreBuildList);
    } else {
      browser.storage.local.get(_settingsPrefix + 'disable_behavior', processPreBuildList);
    }
  }

  /**
   * Removes the host of tr.active from the list.
   */
  function remove() {
    var rows = document.querySelectorAll('#domain-list--tbody tr.active');

    for (var i = 0; i < rows.length; i++) {
      var host = rows[i].childNodes[0].innerHTML;

      if (promises) {
        browser.storage.local.remove(host).then(preBuildList);
      } else {
        browser.storage.local.remove(host, preBuildList);
      }
    }
  }

  /**
   * Removes all saved hosts.
   */
  function removeAll() {
    if (confirm('Are you sure to clear your domain list?')) {
      var settings = {};

      for (var i = 0; i < _settings.length; i++) {
        var name = _settings[i].name;
        var value = document.querySelector('input[name="' + name + '"]:checked').value;

        settings[_settingsPrefix + name] = value;
      }

      // Also set the web extension version, which is not a displayed setting.
      var manifest = browser.runtime.getManifest();
      settings['setting-version'] = manifest.version;

      if (promises) {
        browser.storage.local.clear().then(function() {
          browser.storage.local.set(settings).then(function() {
            preBuildList();
          });
        });
      } else {
        browser.storage.local.clear(function() {
          browser.storage.local.set(settings, function() {
            preBuildList();
          });
        });
      }
    }
  }

  /**
   * Opens the add domain form modal.
   */
  function openAddDomainFormModal() {
    addDomainForm.reset();
    addDomainFormModal.style.display = 'block';
    addDomainFormInput.focus();
  }

  /**
   * Closes the add domain form modal.
   */
  function closeAddDomainFormModal() {
    addDomainFormModal.style.display = 'none';
  }

  /**
   * Closes the add domain form modal.
   */
  function closeAddDomainFormModalForWindow(event) {
    if (typeof event !== 'undefined') {
      if (event.target === addDomainFormModal) {
        closeAddDomainFormModal();
      }
    }
  }

  /**
   * Validates and saves a new domain.
   */
  function submitAddDomainForm(event) {
    event.preventDefault();
    var host = addDomainFormInput.value;
    var isValid = isValidHost(host);

    if (!isValid) {
      addDomainFormInput.setCustomValidity('Please enter a valid host');
      return false;
    }

    // Add the new entry.
    var item = {};
    item[host] = {
      date: (new Date()).toISOString()
    };

    if (addDomainFormIncludeSubDomains.checked) {
      item[host]['include-subdomains'] = true;
    }

    if (promises) {
      browser.storage.local.set(item).then(function() {
        // Re-build the domain list.
        preBuildList();
        closeAddDomainFormModal();
      });
    } else {
      browser.storage.local.set(item, function() {
        // Re-build the domain list.
        preBuildList();
        closeAddDomainFormModal();
      });
    }

    return false;
  }

  /**
   * Saves the a web extension setting.
   */
  function saveSetting() {
    var setting = {};
    var settingValue = this.value;

    // Cast 'true' & 'false' values from form input fields to real booleans.
    switch (this.value) {
      case 'true':
        settingValue = true;
        break;

      case 'false':
        settingValue = false;
        break;
    }

    setting[_settingsPrefix + this.name] = settingValue;
    browser.storage.local.set(setting);

    // Notify app.js about the change.
    browser.runtime.sendMessage({
      type: this.name,
      value: settingValue
    });

    // Re-build the domain list.
    preBuildList();
  }

  /**
   * Builds the settings form.
   */
  function buildSettingsForm(settingValues) {
    var html = '';

    for (var i = 0; i < _settings.length; i++) {
      var setting = _settings[i];

      html += '<tr>';
      html += '<td><label>' + setting.label + '</label></td>';
      html += '<td>';

      for (var k = 0; k < _settings[i].options.length; k++) {
        var option = setting.options[k];
        var id = setting.name + '-' + option.value;
        var checked = '';

        if (settingValues[_settingsPrefix + setting.name] === option.value) {
          checked = ' checked="checked"';
        } else if (settingValues[_settingsPrefix + setting.name] === true && option.value === 'true') {
          checked = ' checked="checked"';
        } else if (settingValues[_settingsPrefix + setting.name] === false && option.value === 'false') {
          checked = ' checked="checked"';
        }

        html += '<input type="' + setting.type + '" name="' + setting.name + '" id="' + id + '" value="' + option.value + '"' + checked + ' />';
        html += '<label for="' + id + '">' + option.label + '</label>';
      }

      html += '</td>';
      html += '</tr>';
    }

    document.getElementById('settings').innerHTML = html;

    // Save settings when changing them.
    var radios = document.querySelectorAll('input[type=radio]');

    for (var i = 0; i < radios.length; i++) {
      radios[i].addEventListener('click', saveSetting);
    }
  }

  /**
   * Helper for building our settings form.
   */
  function preBuildSettingsForm() {
    var settingNames = [];

    for (var i = 0; i < _settings.length; i++) {
      settingNames.push(_settingsPrefix + _settings[i].name);
    }

    if (promises) {
      browser.storage.local.get(settingNames).then(buildSettingsForm);
    } else {
      browser.storage.local.get(settingNames, buildSettingsForm);
    }
  }

  function executeSearch() {
    var rows = document.getElementById('domain-list--tbody').getElementsByTagName('tr');

    for (var i = 0; i < rows.length; i++) {
      var cell = rows[i].getElementsByTagName('td')[0];

      if (cell) {
        if (cell.innerHTML.toUpperCase().indexOf(this.value.toUpperCase()) > -1) {
          rows[i].style.display = '';
        } else {
          rows[i].style.display = 'none';
        }
      }
    }
  }

  function isValidHost(str) {
    return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(str);
  }

  //-------- Init.

  // Mark the remove buttons as disabled.
  var buttons = document.querySelectorAll('input[type=button]');

  for (var i = 0; i < buttons.length; i++) {
    switch (buttons[i].id) {
      case 'remove':
      case 'remove-all':
        buttons[i].disabled = true;
        break;
    }
  }

  // Build our settings.
  preBuildSettingsForm();

  // Build the domain list.
  preBuildList();

  // Define actions.
  document.getElementById('remove').addEventListener('click', remove);
  document.getElementById('remove-all').addEventListener('click', removeAll);
  document.getElementById('add-domain').addEventListener('click', openAddDomainFormModal);
  addDomainForm.addEventListener('submit', submitAddDomainForm);
  addDomainFormInput.addEventListener('change', function () {
    this.setCustomValidity('');
  });
  addDomainFormClose.addEventListener('click', closeAddDomainFormModal);

  // Init search.
  document.getElementById('search').value = '';
  document.getElementById('search').addEventListener('keyup', executeSearch);

  // Close modal when clicking outside of it.
  window.addEventListener('click', closeAddDomainFormModalForWindow);
}

document.addEventListener('DOMContentLoaded', domContentLoaded);
