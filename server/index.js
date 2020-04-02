const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routers = require("./routes/api");
const mongoose = require("mongoose");
const Music = require("./models/scheme");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors());
app.use("/api", routers);

const url = "mongodb://0.0.0.0:27017/musicApp";

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.Promise = global.Promise;

let songs = [
	{
		name: "Coldplay",
		style: "Rock",
		composition: ["Hymn For The Weekend", "Paradise"],
		creationDate: "2009-02-05 00:00",
		country: "UK"
	},
	{
		name: "The Weeknd",
		style: "Hip-hop",
		composition: ["The Hills", "Call Out My Name"],
		creationDate: "2020-03-19 00:00",
		country: "Canada"
	}
];

Music.collection.insertMany(songs);

app.listen(3000);
