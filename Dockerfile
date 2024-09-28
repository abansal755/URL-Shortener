FROM ubuntu:latest

# Install curl
RUN apt-get update
RUN apt-get upgrade -y
RUN apt install curl -y

# Install node
WORKDIR /root
RUN curl -sL https://deb.nodesource.com/setup_20.x -o /tmp/nodesource_setup.sh
RUN bash /tmp/nodesource_setup.sh
RUN apt install nodejs -y

# Install dependencies
RUN mkdir url-shortener
COPY ./package.json /root/url-shortener
COPY ./package-lock.json /root/url-shortener
WORKDIR /root/url-shortener
RUN npm i

# Copy source code
COPY . /root/url-shortener

ENTRYPOINT [ "node", "." ]