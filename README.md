[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/jfpdlihdedhlmhlbgooailmfhahieoem.svg)](https://chrome.google.com/webstore/detail/disable-javascript/jfpdlihdedhlmhlbgooailmfhahieoem)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/users/jfpdlihdedhlmhlbgooailmfhahieoem.svg)](https://chrome.google.com/webstore/detail/disable-javascript/jfpdlihdedhlmhlbgooailmfhahieoem)
[![Chrome Web Store](https://img.shields.io/chrome-web-store/stars/jfpdlihdedhlmhlbgooailmfhahieoem.svg)](https://chrome.google.com/webstore/detail/disable-javascript/jfpdlihdedhlmhlbgooailmfhahieoem)
[![Mozilla Add-on](https://img.shields.io/amo/v/disable-javascript.svg)](https://addons.mozilla.org/en-US/firefox/addon/disable-javascript/)
[![Mozilla Add-on](https://img.shields.io/amo/users/disable-javascript.svg)](https://addons.mozilla.org/en-US/firefox/addon/disable-javascript/)
[![Mozilla Add-on](https://img.shields.io/amo/stars/disable-javascript.svg)](https://addons.mozilla.org/en-US/firefox/addon/disable-javascript/)
[![Twitter URL](https://img.shields.io/twitter/url/http/shields.io.svg?style=social&logo=twitter)](https://twitter.com/intent/tweet?text=Control+your+%23Firefox+and+%23Chrome+%23JavaScript+state+per+url+or+tab+individually.%0D%0AGet+https%3A%2F%2Fgithub.com%2Fdpacassi%2Fdisable-javascript+for+your+%23Browser+now%21+%23DisableJavaScript)

# Disable JavaScript
This web extension lets an user decide if JavaScript should be enabled or disabled for a given host or a given tab.  

When accessing e.g. [google.com](https://www.google.com/) and disabling JavaScript, the web extension will block all JavaScript
which otherwise would be loaded by google.com (including inline JS and external JS files from other hosts).  

Please note that scripts from the blacklisted host will still be loaded if they're being loaded in **another**
host _(unless you block that host as well of course)_.
 
## Supported browsers
- [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/disable-javascript/) (Desktop & Firefox for Android)
- [Google Chrome](https://chrome.google.com/webstore/detail/disable-javascript/jfpdlihdedhlmhlbgooailmfhahieoem) (Desktop)

## Usage
Disabling and enabling JavaScript should be pretty self-explanatory.  
The icons and labels update for a tab accordingly.  

**NOTE:** On Firefox for Android, no icon will be shown but toggling is possible via a menu item.  
See the [Add-on page](https://addons.mozilla.org/en-US/firefox/addon/disable-javascript/) for screenshots.

## Why to use this web extension
The code is completely **open source**, you can also use the unpacked version of this web extension if you prefer.  
No data of you will ever be logged and the web extension asks only for needed permissions.  
Pull requests are **welcome**!

## Installation from source
To install the web extension directly from the source, follow this steps:
- Install [npm](https://www.npmjs.com/)
- Install [gulp.js](https://gulpjs.com/) (run `npm install --global gulp-cli`)
- Clone or download **this** code
- In the project's root folder: Run `npm install`
- In the project's root folder: Run `gulp compile`
- Add the web extension to your browser
  - Mozilla Firefox: Visit `about:debugging` and click on `Load Temporary Add-on`. Load then the `manifest.json` file in the project's root folder
  - Google Chrome: Visit `chrome://extensions/` and click on `Load unpacked`. Choose the project's root folder
- If you simply want to test new branches/custom code without interfering with the installed version of the web extension, check out these browsers:
  - [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/)
  - [Chrome Canary](https://www.google.com/chrome/browser/canary.html)
  
### Pushing to mobile
Make sure you have prepared your device with these [instructions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Developing_WebExtensions_for_Firefox_for_Android).  
After following the previous steps, continue like this:
- In the project's root folder: Overwrite the existing `manifest.json` with the `manifest-gecko.json` file
- Connect your mobile device via USB to your composer
- In the project's root folder: Run `./push-to-mobile.sh`
- In Firefox in your mobile device: Access `file:///storage/emulated/0` and select the `disable-javascript@pacassi.ch.xpi` file

## Contribution guidelines
If you want to contribute in any way or simply report bugs, please have a look at the [contribution guidelines](CONTRIBUTING.md) first.  
Thank you!

## Support this project
If you want to support this project, please think about making a small [contribution](https://www.paypal.me/dpacassi/5), thank you!

## Future plans
Feature proposals are being added as [issues on GitHub](../../issues).  
If you want something to be added, create an issue or upvote an existing one.

## Other web extensions
- [View Page Source (Mobile)](https://github.com/dpacassi/view-page-source-mobile)

## Maintainer
- [David Pacassi Torrico](https://pacassi.ch/) _(Web extension implementation, maintenance, support)_

## License
```
MIT License

Copyright (c) 2017 David Pacassi Torrico

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
