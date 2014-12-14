// minimist returns a function, we'll pass it all the arguments except the first two.
var args = require("minimist")(process.argv.slice(2));

// load extend library
// extend: take one js object, and copy all values onto another object
var extend = require("extend");

var environment = args.env || "test";

// Common config
var common_conf = {
	name: "rm2kdevs mmo game server",
	version: "0.0.1",
	environment: environment,
	max_player: 100,
	data_paths: {
		items: __dirname + "\\Game Data\\" + "Items\\",
		maps: __dirname + "\\Game Data\\" + "Maps\\",
	},
	starting_zone: "rm_map_home"
};

var conf = {
	production: {
		ip: args.ip || "0.0.0.0",
		port: args.port || "8081",
		database: "mongodb://127.0.0.1/rm2mmo_prod"
	},
	test: {
		ip: args.ip || "0.0.0.0",
		port: args.port || "8082",
		database: "mongodb://127.0.0.1/rm2mmo_test"
	}
};

/*
	First: deep copy?
	Second: Target
	Third: From
*/
extend(false, conf.production, common_conf);
extend(false, conf.test, common_conf);

module.exports = config = conf[environment];