# Disable JavaScript has been discontinued!
As you might have noticed (no updates for a long time), unfortunately I didn't have sufficient time to further
develop this web extension.
While the development of this web extension was exciting, there were very little donations and also some questionable
reviews about the web extension.

As Manifest V2 is getting deprecated soon, I decided to end this journey for now and handed over the ownership
of the extension on Chrome and Firefox to another party.
While I can't say if the code will continue to stay public, I want to point out that I'm not the maintainer anymore
and that versions after **2.3.1** won't reflect the source code of this repository.

Thanks everyone who supported this project by writing genuine reviews, donating or simply creating pull requests.

# Disable JavaScript
This web extension lets a user decide if JavaScript should be enabled or disabled for a given host or a given tab.  

When accessing e.g. [google.com](https://www.google.com/) and disabling JavaScript, the web extension will block all JavaScript
which otherwise would be loaded by google.com (including inline JS and external JS files from other hosts).  

Please note that scripts from the blocked host will still be loaded if they're being loaded in **another**
host _(unless you block that host as well of course)_.
 
## Supported browsers
- [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/disable-javascript/) (Desktop & Firefox for Android)
- [Google Chrome](https://chrome.google.com/webstore/detail/disable-javascript/jfpdlihdedhlmhlbgooailmfhahieoem) (Desktop)

## Usage
Disabling and enabling JavaScript should be pretty self-explanatory.  
The icons and labels update for a tab accordingly.  

**NOTE:** On Firefox for Android, no icon will be shown but toggling is possible via a menu item.  
See the [Add-on page](https://addons.mozilla.org/en-US/firefox/addon/disable-javascript/) for screenshots.

## Installation from source
To install the web extension directly from the source, follow this steps:
- Install [Node.js and npm](https://www.npmjs.com/get-npm)
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
