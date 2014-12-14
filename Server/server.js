/* Entry point of the program */
require(__dirname + "/Resources/config.js");

/* File system: native to js */
var fs = require("fs");
/* Net: native to js. Network code */
var net = require("net");

require("./packet.js");

//1. Load the initializers
var init_files = fs.readdirSync(__dirname + "/Initializers");
init_files.forEach(function(initFile){
	console.log("Loading Initializer: " + initFile);
	require(__dirname + "/Initializers/" + initFile);
});

//2. load data models
var model_files = fs.readdirSync(__dirname + "/Models");
model_files.forEach(function(modelFile){
	console.log("Loading Model: " + modelFile);
	require(__dirname + "/Models/" + modelFile);
});

//3. load game maps data
maps = {}; // blank json object
var map_files = fs.readdirSync(config.data_paths.maps);
map_files.forEach(function(mapFile){
	console.log("Loading Map: " + mapFile);
	var map = require(config.data_paths.maps + mapFile);
	maps[map.room] = map;
});

//4. initiate the server and listen to the internets
		// all of server logic.
net.createServer(function(socket){
	console.log("socket connected");
	
	// Create a new client instance. Get a ref to the file.
	// Create a new object from the reference.
	var c_inst = new require("./client.js");
	var thisClient = new c_inst();
	
	thisClient.socket = socket;
	thisClient.initiate();
	
	socket.on("error", thisClient.error);	
	socket.on("end", thisClient.end);
	socket.on("data", thisClient.data);
}).listen(config.port);		

console.log("Initialize Completed. Server running on port: " + config.port + " for environment: " + config.environment);