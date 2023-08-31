FROM node:18.17.1-alpine3.17
 
WORKDIR /user/src/app
 
COPY . .
 
RUN npm ci
 
RUN npm run build
 
USER node
 
CMD ["npm", "run", "start:prod"]