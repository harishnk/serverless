# Install Node.js docker container
FROM node:7.9.0-onbuild

# Bundle app source
COPY . /opt/app
WORKDIR /opt/app

# Install app dependencies
RUN npm install

# Environment variables
ENV NODE_ENV production
ENV EXPRESS_PORT 80

EXPOSE 8080

CMD ["node", "serverless.js"]
