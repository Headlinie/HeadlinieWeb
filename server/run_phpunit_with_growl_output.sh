#! /bin/sh

phpunit | tail -n 1 | growlnotify
