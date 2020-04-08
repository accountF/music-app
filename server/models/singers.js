const mongoose = require("mongoose");

const Scheme = mongoose.Schema;

const SingersScheme = new Scheme({
	name: String,
	role: String,
	birth: String,
	country: String,
	awards: String,
	bands: {
		type: Scheme.Types.ObjectId,
		ref: "bands"
	}
}, {versionKey: false});

const Singers = mongoose.model("Singers", SingersScheme);

module.exports = Singers;
