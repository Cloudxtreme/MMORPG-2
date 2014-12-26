var now = require("performance-now");
var _ = require("underscore");

module.exports = function(){
	var client = this;
	// These objects will be added at runtime...
	// this.socket = {}
	// this.user = {}
	
	// Initialization
	this.initiate = function(){
		// Send the connection handshake packet to the client.
		client.socket.write(packet.build(["HELLO", now().toString()]));
		
		console.log("client initiated");
	};
	
	// Client methods
	this.enterroom = function(selected_room){
		maps[selected_room].clients.forEach(function(otherClient){
			otherClient.socket.write(packet.build(["ENTER", client.user.username, client.user.pos_x, client.user.pos_y]));
		});
		
		maps[selected_room].clients.push(client);
	}
	
	// Socket stuff
	this.data = function(data){
		console.log("client data " + data.toString());
		packet.parse(client, data);
	};
	
    this.error = function(err){
		console.log("client error " + err.toString());
	};
	
	this.end = function(){
		console.log("client closed");
	};
};