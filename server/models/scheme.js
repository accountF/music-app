const mongoose = require("mongoose");

const Scheme = mongoose.Schema;

const MusicScheme = new Scheme({
	name: {
		type: String
	},
	style: {
		type: String
	},
	composition: {
		type: Array
	},
	creationDate: {
		type: String
	},
	country: {
		type: String
	},
	id: {
		type: String
	}
}, {versionKey: false});

const Music = mongoose.model("music", MusicScheme);

module.exports = Music;
