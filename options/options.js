function restoreOptions() {
  /**
   * Builds the domain list.
   */
  function buildList(result) {
    var tableList = document.getElementById('table-list');
    var newHTML = '';
    var hasEntries = false;
    var entries = [];

    for (var key in result) {
      entries.push(key);
      hasEntries = true;
    }

    for (var i = entries.length - 1; i >= 0; i--) {
      var key = entries[i];
      var dateAdded = new Date(result[key]);
      console.log(dateAdded);

      newHTML += '<tr>';
      newHTML += '<td>' + key + '</td>';
      newHTML += '<td>' + dateAdded.toLocaleDateString() + ' ' + dateAdded.toLocaleTimeString() + '</td>';
      newHTML += '</tr>';
    }

    tableList.innerHTML = newHTML;

    // Attach on row click events.
    var rows = tableList.querySelectorAll('tr');

    for (var i = 0; i < rows.length; i++) {
      rows[i].addEventListener('click', function() {
        if (this.classList.contains('active')) {
          // Remove active class.
          this.classList.remove('active');
        } else {
          // Remove the active class from all other rows.
          var otherRows = tableList.querySelectorAll('tr.active');

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

    var list = browser.storage.local.get();
    list.then(buildList);
  }

  /**
   * Removes the host of tr.active from the list.
   */
  function remove() {
    var rows = document.querySelectorAll('#table-list tr.active');

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
      browser.storage.local.clear().then(preBuildList);
    }
  }

  //-------- Init.

  // Mark the remove buttons as disabled.
  buttons = document.querySelectorAll('input[type=button]');

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
  }

  // Build the domain list.
  preBuildList();

  // Define remove actions.
  document.getElementById('remove').addEventListener('click', remove);
  document.getElementById('remove-all').addEventListener('click', removeAll);
}

document.addEventListener('DOMContentLoaded', restoreOptions);
