const mongoose = require("mongoose");

const Scheme = mongoose.Schema;

const SingersScheme = new Scheme({
	name: String,
	role: String,
	birth: String,
	country: String,
	awards: String,
	bandId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Bands"
	}
}, {versionKey: false});

const Singers = mongoose.model("Singers", SingersScheme);

module.exports = Singers;
