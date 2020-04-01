const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectID;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use(cors());
const url = "mongodb://0.0.0.0:27017/";

const mongoClient = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

let db;
let music = [
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

mongoClient.connect((err, client) => {
	db = client.db("musicApp");
	db.collection("music").insertMany(music);
	if (err) console.warn("Error", err);
	app.listen(3000, () => {
		console.log("Server running at http://0.0.0.0:3000/");
	});
});

app.get("/music", (req, res) => {
	db.collection("music").find().toArray((err, results) => {
		for (let i = 0; i < results.length; i++) {
			results[i].id = results[i]._id;
			delete results[i]._id;
		}
		if (err) console.warn("Error", err);
		res.send(results);
	});
});

app.put("/music/:id", (req, res) => {
	const idToObject = ObjectId(req.params.id);
	req.body.composition = req.body.composition.split(",");
	db.collection("music").findOneAndUpdate(
		{_id: idToObject},
		{
			$set: {
				name: req.body.name,
				style: req.body.style,
				composition: req.body.composition,
				creationDate: req.body.creationDate,
				country: req.body.country
			}
		},
		{returnOriginal: false, upsert: true},
		(err, data) => {
			if (err) {
				console.warn("Error", err);
			}
			res.send(data.value._id);
		}
	);
});
