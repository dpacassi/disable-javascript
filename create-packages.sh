#!/bin/bash

zip -r "disable-javascript.zip" . -x "*.git*" "*.sh" "*.idea*" "*.DS_Store" "*node_modules*" "pages/src/*"
zip -r "disable-javascript--with-source.zip" . -x "*.git*" "*.sh" "*.idea*" "*.DS_Store" "*node_modules*"
