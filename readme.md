## Headlinie Web

### Dependencies for frontend

* NodeJS
* gulp global install
* bower global install
* react-tools global install

### Developing

First you'll need docker. You can run it manually by other means but it's not supported officially right now.

Build the container: ```docker build -t headlinie/web .```

Launch the container and sync files between: ```docker run -v /home/victor/Projects/headlinie/Web:/headlinie/ -p 8000:8000 -d headlinie/web```

Replace ```/home/victor/Projects/headlinie/Web``` with wherever you have the source

Run ```gulp``` in the source directory to automatically build files while developing.
