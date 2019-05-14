const mongoose = require('mongoose');

const MONGO_USERNAME = 'myuser';
const MONGO_PASSWORD = 'mypassword';
const MONGO_HOSTNAME = 'localhost';
const MONGO_PORT = '27017';
const MONGO_DB = 'mydb';

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}`;

mongoose.connect(url, {
	useCreateIndex: true,
	useNewUrlParser: true
});
