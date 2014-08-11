#! /bin/sh
# Requirements:
# 	npm
#		bower
#		composer
#			react-tools from npm
#			gulp from npm
npm install
bower install
(cd server; composer install)

cat src/app.jsx | jsx > src/app.js
gulp scripts-min
