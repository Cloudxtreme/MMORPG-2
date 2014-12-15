// Numbered because they'll load in the order they are in the file system

var mongoose = require('mongoose');

// If db server is down, server will crash here.
module.exports = gamedb = mongoose.createConnection(config.database);