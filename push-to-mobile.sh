#!/bin/bash

zip -r "disable-javascript@pacassi.ch.xpi" . -x "*.git*" "*.sh" "*.idea*" "*.DS_Store" "*node_modules*"
$ANDROID_HOME/platform-tools/adb push "disable-javascript@pacassi.ch.xpi" /mnt/sdcard/
