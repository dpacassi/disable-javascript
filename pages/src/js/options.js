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
  }];

  var _settingsPrefix = 'setting-';

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
      var dateAdded = new Date(result[key]);

      newHTML += '<tr>';
      newHTML += '<td>' + key + '</td>';
      newHTML += '<td>' + dateAdded.toLocaleDateString() + ' ' + dateAdded.toLocaleTimeString() + '</td>';
      newHTML += '</tr>';
    }

    if (newHTML.length === 0) {
      newHTML += '<tr>';
      newHTML += '<td class="empty" colspan="2">' + 'You have not added any domains to your white-/blacklist yet.' + '</td>';
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

  /**
   * Helper for building the domain list.
   */
  function preBuildList() {
    document.getElementById('remove').disabled = true;
    document.getElementById('remove-all').disabled = true;

    browser.storage.local.get(_settingsPrefix + 'disable_behavior').then(function(result) {
      if (result[_settingsPrefix + 'disable_behavior'] === 'domain') {
        document.body.classList.remove('disable-behavior--tab');

        var list = browser.storage.local.get();
        list.then(buildList);
      } else {
        // Don't build the list but hide the whole table.
        document.body.classList.add('disable-behavior--tab');
      }
    });

  }

  /**
   * Removes the host of tr.active from the list.
   */
  function remove() {
    var rows = document.querySelectorAll('#domain-list--tbody tr.active');

    for (var i = 0; i < rows.length; i++) {
      var host = rows[i].childNodes[0].innerHTML;

      browser.storage.local.remove(host).then(preBuildList);
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

      browser.storage.local.clear().then(function() {
        browser.storage.local.set(settings).then(function() {
          preBuildList();
        });
      });
    }
  }

  /**
   * Saves the a web extension setting.
   */
  function saveSetting() {
    var setting = {};

    setting[_settingsPrefix + this.name] = this.value;
    browser.storage.local.set(setting);

    // Notify app.js about the change.
    if (this.name === 'default_state') {
      browser.runtime.sendMessage({
        type: 'default_state',
        default_state: this.value
      });
    } else if (this.name === 'disable_behavior') {
      browser.runtime.sendMessage({
        type: 'disable_behavior',
        default_state: this.value
      });

      // Re-build the domain list if this value changed.
      preBuildList();
    }
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

    browser.storage.local.get(settingNames).then(buildSettingsForm);
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

  //-------- Init.

  // Mark the remove buttons as disabled.
  var buttons = document.querySelectorAll('input[type=button]');

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }

  // Build our settings.
  preBuildSettingsForm();

  // Build the domain list.
  preBuildList();

  // Define remove actions.
  document.getElementById('remove').addEventListener('click', remove);
  document.getElementById('remove-all').addEventListener('click', removeAll);

  // Init search.
  document.getElementById('search').value = '';
  document.getElementById('search').addEventListener('keyup', executeSearch);
}

document.addEventListener('DOMContentLoaded', domContentLoaded);
