This project is a very simple app developed using MEAN stack technology: Mongo as database, Express as web application framework (for routing etc), Angular as the front end framework, and Nodejs as backend server. This app demonstrates a simple login + registration feature, with authentication using the passport-js library and persistent sessions using JWT tokens. This app can be used as a starting template when you develop your own apps.


1) Install the latest version of npm and nodejs using below command:

sudo apt install nodejs npm

2) Install mongodb by following the steps from https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

3) Download this code, then change to the downloaded folder, and run below command to download all nodejs dependencies:

npm install

4) Make sure the mongod service is running, if not, start using below command:

sudo service mongod start

5) Login to the mongo shell using command: mongo

6) Create a new database with some name (example: mydb) using below query:

use mydb;

7) Create a database user for our application using below query:

db.createUser({user: "myuser", pwd: "mypassword", roles: ["readWrite"]});

8) Open db.js and change the database name, username and password. Make sure mongod service is running on port 27017. If it is running on a different port, then set that port in this file. Mongod port is defined in /etc/mongod.conf automatically during installation.

9) By default, the app will work on port 8080. If you need to change it, then open app.js and at the bottom of the code, change 8080 to your desired port.

10) Run below command to start the node server:

node .

11) Open your browser and hit http://localhost:8080 (use different port if you edited it in the app.js file)
