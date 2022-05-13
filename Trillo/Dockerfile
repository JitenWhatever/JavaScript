FROM node:12
WORKDIR /home/node/trillo
COPY app /home/node/trillo/
RUN npm install
RUN npm run build:css
CMD npm start
EXPOSE 8080