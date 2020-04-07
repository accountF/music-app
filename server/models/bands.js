const mongoose = require("mongoose");

const Scheme = mongoose.Schema;

const BandsScheme = new Scheme({
	name: String,
	style: String,
	creationDate: String,
	country: String
}, {versionKey: false});

const Bands = mongoose.model("bands", BandsScheme);

module.exports = Bands;
