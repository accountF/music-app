const express = require("express");
const Music = require("../models/scheme");

const router = express.Router();

router.get("/music", (req, res) => {
	Music.find({}).then((music) => {
		music.map((song) => {
			song.id = song._id;
			return song;
		});
		res.send(music);
	});
});

router.put("/music/:id", (req, res) => {
	req.body.composition = req.body.composition.split(",");
	Music.findByIdAndUpdate({_id: req.params.id}, req.body).then(() => {
		Music.findOne({_id: req.params.id}).then((music) => {
			res.send(music);
		});
	});
});

module.exports = router;
