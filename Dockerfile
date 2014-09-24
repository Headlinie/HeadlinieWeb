FROM dockerfile/ubuntu

RUN curl -sL https://deb.nodesource.com/setup | sudo bash -
RUN apt-get install -y nodejs

RUN mkdir -p /headlinie/
WORKDIR /headlinie
ADD package.json /headlinie/package.json
RUN npm install --production

RUN npm install http-server gulp -g

ADD . /headlinie/

RUN gulp build

EXPOSE 8000
CMD http-server -p 8000
