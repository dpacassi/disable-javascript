# Disable JavaScript

## Developer's local environment
**OS:** macOS High Sierra, 10.13.5  
**Needed environment variables:** None  
**NPM version:** 5.8.0  
**Node.js version:** 8.11.1

## Affected files
- `/pages/src/js` -> `/pages/dist/js`
- `/pages/src/sass` -> `/pages/dist/css`

## Build instructions
- Install [npm](https://www.npmjs.com/)
- Install [gulp.js](https://gulpjs.com/) (run `npm install --global gulp-cli`)
- In the project's root folder: Run `npm install`
- In the project's root folder: Run `gulp compile`
