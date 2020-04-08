const express = require("express");
const Albums = require("../models/albums");

const ObjectId = require("mongodb").ObjectID;

const router = express.Router();

router.get("/albums/:id", (req, res) => {
	Albums.aggregate([
		{
			$match: {bandId: ObjectId(req.params.id)}
		},
		{
			$lookup: {
				from: "songs",
				localField: "_id",
				foreignField: "albumId",
				as: "songsInfo"
			}
		},
		{
			$project: {
				id: "$_id",
				name: 1,
				releaseDate: 1,
				creationDate: 1,
				numberOfCopies: 1,
				songsInfo: "$songsInfo.name"
			}
		}
	]).then((albums) => {
		let results = albums.map((album) => {
			album.numberOfSongs = album.songsInfo.length;
			return album;
		});
		res.send(results);
	});
});

router.put("/albums/:id", (req, res) => {
	Albums.findByIdAndUpdate({_id: req.params.id}, req.body).then(() => {
		Albums.findOne({_id: req.params.id}).then((albums) => {
			res.send(albums);
		});
	});
});

router.delete("/albums/:id", (req, res) => {
	Albums.findByIdAndRemove({_id: req.params.id}).then(() => {
		res.send("Deleted");
	});
});

router.get("/albumDetails/:id", (req, res) => {
	Albums.aggregate([
		{
			$match: {_id: ObjectId(req.params.id)}
		},
		{
			$lookup: {
				from: "songs",
				localField: "_id",
				foreignField: "albumId",
				as: "songsInfo"
			}
		},
		{
			$lookup: {
				from: "bands",
				localField: "bandId",
				foreignField: "_id",
				as: "bandsInfo"
			}
		},
		{
			$unwind: "$bandsInfo"
		},
		{
			$lookup: {
				from: "singers",
				localField: "bandsInfo._id",
				foreignField: "bands",
				as: "singersInfo"
			}
		},
		{
			$project: {
				_id: 1,
				bandName: "$bandsInfo.name",
				albumName: "$name",
				songs: "$songsInfo.name",
				awards: "$singersInfo.awards",
				photo: "$photo"
			}
		}
	]).then((albums) => {
		res.send(albums);
	});
});

module.exports = router;
