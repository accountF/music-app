const express = require("express");
const Songs = require("../models/songs");

const ObjectId = require("mongodb").ObjectID;

const router = express.Router();

router.get("/songs/:id", (req, res) => {
	Songs.aggregate([
		{
			$match: {albumId: ObjectId(req.params.id)}
		},
		{
			$project: {
				_id: 0,
				id: "$_id",
				name: 1
			}
		}
	]).then((songs) => {
		res.send(songs);
	});
});

router.put("/songs/:id", (req, res) => {
	Songs.findByIdAndUpdate({_id: req.params.id}, req.body).then(() => {
		Songs.findOne({_id: req.params.id}).then((songs) => {
			res.send(songs);
		});
	});
});

module.exports = router;
