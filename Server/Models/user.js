var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: {type: String, unique: true},
	password: String,
	sprite: String,
	current_room: String,
	pos_x: Number,
	pos_y: Number
});

userSchema.statics.register = function(username, password, callback){
	
	var new_user = new User({
		username: username,
		password: password,
		sprite: "spr_Hero",
		current_room: maps[config.starting_zone].room,
		pos_x: maps[config.starting_zone].start_x,
		pos_y: maps[config.starting_zone].start_y
	});
	
	// Is .save a mongoose function?
	new_user.save(function(err){
		if(!err){
			callback(true);
		} else {
			callback(false);
		}
	});
	
};

userSchema.statics.login = function(username, password, callback){
	// Query db using json object
	User.findOne({username: username}, function(err, user){
		// Deal with login errors (bad user, no user)
		if (!err && user){
			if (user.password == password){
				callback(true, user);
			} else {
				callback(false, null);
			}
		} else {
			callback(false, null);
		}
	});
};

module.exports = User = gamedb.model('User', userSchema);