const mongoose = require('mongoose');
const assert = require('assert');

const url = process.env.MONGODB_URI || process.env.MONGODB_TEST_URI;
mongoose.Promise = global.Promise;

mongoose.connect(url, { useNewUrlParser: true }, (err, db) => {
    assert.equal(null, err);
    console.log('Successfully connected to the database');
});

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error: '));
mongoose.set('debug', true);

module.exports = mongoose.connection;
