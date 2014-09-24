#! /bin/bash

#
# Headlinie Web
#

# Get new random port for new container
# TODO Make sure there is no collisions
random_port=`shuf -i 8000-9000 -n 1`

# Get the id of the old container
old_container=`docker ps | grep "headlinie/web:latest" | cut -d " " -f1`
# Get the port of the old container
old_container_port=`docker inspect $old_container | grep -i "hostport" | tail -n 1 | cut -d '"' -f4`

# Get working dir for volumes
WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && cd .. && pwd )"

echo "";
echo "### Building image";
echo "";

docker build -t headlinie/web .

echo "";
echo -e "\033[33;32m## Running container from image";
echo "";

echo "#####"
echo "##"
echo "## Server started on port 8000"
echo "##"
echo "#####"

# Start new container
echo "!! Starting new container on port $random_port"

docker run -p $random_port:8000 -d headlinie/web

# Get the id of the new container
new_container=`docker ps | grep "headlinie/web:latest" | cut -d " " -f1`
# Get the port of the new container
new_container_port=`docker inspect $new_container | grep -i "hostport" | tail -n 1 | cut -d '"' -f4`

# Tell NGINX to change port to new container
# TODO We never want to run this locally unless we're deploying
sed -i.bak s/$old_container_port/$new_container_port/ /etc/nginx/sites-enabled/headlinie

sudo service nginx restart

# Stop old container
docker stop $old_container

# Remove old container
docker rm $old_container
