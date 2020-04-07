const mongoose = require("mongoose");

const Scheme = mongoose.Schema;

const AlbumsScheme = new Scheme({
	name: String,
	photo: String,
	releaseDate: String,
	numberOfCopies: Number,
	bandId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Bands"
	}
}, {versionKey: false});

const Albums = mongoose.model("Albums", AlbumsScheme);

module.exports = Albums;
