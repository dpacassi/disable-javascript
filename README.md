# Disable JavaScript
This web extension lets an user decide if JavaScript should be enabled or disabled for a given host.  

When accessing e.g. [google.com](https://www.google.com/) and disabling JavaScript, the web extension will block all JavaScript
which otherwise would be loaded by google.com (including inline JS and external JS files from other hosts).  

Please note that scripts from the blacklisted host will still be loaded if they're being loaded in **another**
host _(unless you block that host as well of course)_.

## Supported browsers
- [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/disable-javascript/) (Desktop & Firefox for Android)
- [Google Chrome](https://chrome.google.com/webstore/detail/disable-javascript/jfpdlihdedhlmhlbgooailmfhahieoem) (Desktop)
- Microsoft Edge (the request for access to the Windows Store is pending but you can [manually add](https://docs.microsoft.com/en-us/microsoft-edge/extensions/guides/adding-and-removing-extensions) the web extension to Edge)

## Usage
Disabling and enabling JavaScript should be pretty self-explanatory.  
The icons and labels update for a tab accordingly.  

**NOTE:** On Firefox for Android, no icon will be shown but toggling is possible via a menu item.  
See the [Add-on page](https://addons.mozilla.org/en-US/firefox/addon/disable-javascript/) for screenshots.

## Why to use this web extension
The code is completely **open source**, you can also use the unpacked version of this web extension if you prefer.  
No data of you will ever be logged and the web extension asks only for needed permissions.  
Pull requests are **welcome**!

## Support
If you need any assistance or find any bugs, feel free to contact me directly via email or create a
new issue on the [projects GitHub page](https://github.com/dpacassi/disable-javascript).

## Future plans
If the user base increases, it's possible to develop more features to this web extension, such as:
- Publish the web extension in the Windows store for Microsoft Edge _(pending)_
- Add a settings page with an overview of all blacklisted hosts and a `Clear all` button
- Add the possibility of choosing between the **blacklist** and **whitelist** methods
- Add the possibility of choosing the default JS state (JS by default on or off)
- Port to Safari
- .. your suggestions/ideas!

## Other web extensions
- [View Page Source (Mobile)](https://github.com/dpacassi/view-page-source-mobile)

## Maintainer
- [David Pacassi Torrico](https://pacassi.ch/) _(Web extension implementation, maintenance, support)_
