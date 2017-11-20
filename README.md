# Disable JavaScript
This web extension for [Mozilla Firefox](https://www.mozilla.org/firefox/new/) and [Google Chrome](https://www.google.com/chrome/browser/desktop/index.html)
lets an user decide if JavaScript should be enabled or disabled for a given host.  

When accessing e.g. [google.com](https://www.google.com/) and disabling JavaScript, the web extension will block all JavaScript
which otherwise would be loaded by google.com (also external JS).  

Please note that scripts from the blacklisted host will still be loaded if they're being loaded in **another**
host _(unless you block that host as well of course)_.

## Usage
Disabling and enabling JavaScript should be pretty self-explanatory.  
The icons and labels update for a tab accordingly.

## Future plans
If the user base increases, I can port this web extension to Microsoft Edge and Safari as well as to
the mobile versions of the browsers.  
It's also possible to create a settings page where an user can select if they want to work with a
**blacklist** or a **whitelist** method. 

## Maintainer
- [David Pacassi Torrico](https://pacassi.ch/) _(Web extension implementation, maintenance, support)_
