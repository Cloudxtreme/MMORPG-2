///network_write
// argument0: socket
// argument1: buffer of data to send

// Init
var packetSize = buffer_tell(argument1);
var buffPacket = buffer_create(1, buffer_grow, 1);

// Write the size and the packet into new buffer.
buffer_write(buffPacket, buffer_u8, packetSize + 1);
buffer_copy(argument1, 0, packetSize, buffPacket, 1);
buffer_seek(buffPacket, 0, packetSize + 1);

// Send the packet
network_send_raw(argument0, buffPacket, buffer_tell(buffPacket));

// Clear the buffers (not managed)
buffer_delete(argument1);
buffer_delete(buffPacket);