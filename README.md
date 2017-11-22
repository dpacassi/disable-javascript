# Disable JavaScript
This web extension for [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/disable-javascript/) and [Google Chrome](https://chrome.google.com/webstore/detail/disable-javascript/jfpdlihdedhlmhlbgooailmfhahieoem)
lets an user decide if JavaScript should be enabled or disabled for a given host.  

When accessing e.g. [google.com](https://www.google.com/) and disabling JavaScript, the web extension will block all JavaScript
which otherwise would be loaded by google.com (also external JS).  

Please note that scripts from the blacklisted host will still be loaded if they're being loaded in **another**
host _(unless you block that host as well of course)_.

## Usage
Disabling and enabling JavaScript should be pretty self-explanatory.  
The icons and labels update for a tab accordingly.

## Support
If you need any assistance or find any bugs, feel free to contact me directly via email or create a
new issue on the [projects GitHub page](https://github.com/dpacassi/disable-javascript).

## Future plans
If the user base increases, it's possible to develop more features of this web extension, such as:
- Add a settings page with an overview of all blacklisted hosts and a `Clear all` button
- Add the possibility of choosing between the **blacklist** and **whitelist** methods
- Port to Microsoft Edge
- Port to Safari
- Port to mobile devices
- .. your suggestions/ideas!

## Maintainer
- [David Pacassi Torrico](https://pacassi.ch/) _(Web extension implementation, maintenance, support)_
