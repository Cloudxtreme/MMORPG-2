var zeroBuffer = new Buffer('00', 'hex');
module.exports = packet = {

	// params: an array of javascript objects to be turned into buffers
	build: function(params){
		var packetParts = [];
		var packetSize = 0;
		
		params.forEach(function(param){
			var buffer;
			
			if (typeof param === 'string'){
				/* GameMaker takes 00 terminated strings */
				buffer = new Buffer(param, 'utf8');
				
				/* Buffer length + 1 to add zero buffer */
				buffer = Buffer.concat([buffer, zeroBuffer], buffer.length + 1);
			}
			else if (typeof param === 'number'){
				/* 2 bytes. Uint16 */
				buffer = new Buffer(2);
				
				// Position 0
				buffer.writeUInt16LE(param, 0);
			}
			else {
				console.log("Warning: Unknown data type in packet builder!");
			}
			
			packetSize += buffer.length;
			packetParts.push(buffer);
		});
		
		var dataBuffer = Buffer.concat(packetParts, packetSize);
		
		var size = new Buffer(1);
		size.writeUInt8(dataBuffer.length + 1, 0);
		
		var finalPacket = Buffer.concat([size, dataBuffer], size.length + dataBuffer.length);
		
		return finalPacket;
	},
	
	// Parse a packet from the client.
	parse: function(client, data){
		var idx = 0;
		while(idx < data.length){
			var packetSize = data.readUInt8(idx);
			var extractedPacket = new Buffer(packetSize);
			data.copy(extractedPacket, 0, idx, idx + packetSize);
			this.interpret(client, extractedPacket);
			
			idx += packetSize;
		}
	},
	
	interpret: function(client, dataPacket){
		var header = PacketModels.header.parse(dataPacket);
		console.log("Interpret: " + header.command);
		console.log("Extracted Packet: " + dataPacket.toString());
		
		switch(header.command.toUpperCase()){
			case("LOGIN"):{
				var data = PacketModels.login.parse(dataPacket);
				console.log("Data: " + data.toString());
				User.login(data.username, data.password, function(result, user){
					console.log('Login Result: ' + result);
					if(result){
						client.user = user;
						client.enterroom(client.user.current_room);
						client.socket.write(packet.build(["LOGIN", "TRUE", client.user.current_room, client.user.pos_x, client.user.pos_y, client.user.username]));
					} else {
						client.socket.write(packet.build(["LOGIN", "FALSE"]));
					}
				});				
			}break;
			
			case("REGISTER"):{
				var data = PacketModels.register.parse(dataPacket);
				User.register(data.username, data.password, function(result){
					if (result){
						client.socket.write(packet.build(["REGISTER", "TRUE"]));					
					} else {
						client.socket.write(packet.build(["REGISTER", "FALSE"]));
					}					
				});
			}break;		
		}
	}

};