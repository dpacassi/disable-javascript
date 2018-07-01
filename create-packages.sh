#!/bin/bash

zip -r "disable-javascript.zip" . -x "*.git*" "*.zip*" "*.sh" "*.idea*" "*.DS_Store" "*node_modules*" "*manifest-gecko.json*" "*gulpfile.js*" "*package.json*" "*package-lock.json*" "*.md*" "pages/src/*"
mv README-reviewers.md README.md
zip -r "disable-javascript--with-source.zip" . -x "*.git*" "*.zip*" "*.sh" "*.idea*" "*.DS_Store" "*node_modules*" "*manifest-gecko.json*" "*CONTRIBUTING.md*" "pages/dist/*"
git checkout README.md
git checkout README-reviewers.md
