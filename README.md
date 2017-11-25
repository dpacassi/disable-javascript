# Disable JavaScript
This web extension lets an user decide if JavaScript should be enabled or disabled for a given host.  

When accessing e.g. [google.com](https://www.google.com/) and disabling JavaScript, the web extension will block all JavaScript
files which otherwise would be loaded by google.com (including external JS files from other hosts).  

Please note that scripts from the blacklisted host will still be loaded if they're being loaded in **another**
host _(unless you block that host as well of course)_.

## Supported browsers
- [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/disable-javascript/) (Desktop & Firefox for Android)
- [Google Chrome](https://chrome.google.com/webstore/detail/disable-javascript/jfpdlihdedhlmhlbgooailmfhahieoem) (Desktop)

## Usage
Disabling and enabling JavaScript should be pretty self-explanatory.  
The icons and labels update for a tab accordingly.  

**NOTE:** It's not possible to [exchange](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/pageAction/setIcon) a web extension icon on Firefox for Android yet.  
To find out if JS is enabled or disabled, simply check the menu item label in the browser menu.

## Support
If you need any assistance or find any bugs, feel free to contact me directly via email or create a
new issue on the [projects GitHub page](https://github.com/dpacassi/disable-javascript).

## Future plans
If the user base increases, it's possible to develop more features of this web extension, such as:
- Add a settings page with an overview of all blacklisted hosts and a `Clear all` button
- Port to Microsoft Edge
- Port to Safari
- Add the possibility of choosing between the **blacklist** and **whitelist** methods
- .. your suggestions/ideas!

## Maintainer
- [David Pacassi Torrico](https://pacassi.ch/) _(Web extension implementation, maintenance, support)_
