const mongoose = require("mongoose");

const Scheme = mongoose.Schema;

const SongsScheme = new Scheme({
	name: String,
	albumId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Albums"
	},
	bandId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Bands"
	}
}, {versionKey: false});

const Songs = mongoose.model("Songs", SongsScheme);

module.exports = Songs;
