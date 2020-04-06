const express = require("express");
const Bands = require("../models/bands");
const Albums = require("../models/albums");
const Singers = require("../models/singers");

const ObjectId = require("mongodb").ObjectID;

const router = express.Router();

// BANDS

router.get("/bands", (req, res) => {
	Bands.aggregate([
		{
			$lookup: {
				from: "albums",
				localField: "_id",
				foreignField: "bandId",
				as: "albumsInfo"
			}
		},
		{
			$project: {
				id: "$_id",
				name: 1,
				style: 1,
				creationDate: 1,
				country: 1,
				albumNames: "$albumsInfo.name"
			}
		}
	]).then((bands) => {
		res.send(bands);
	});
});


router.put("/bands/:id", (req, res) => {
	Bands.findByIdAndUpdate({_id: req.params.id}, req.body).then(() => {
		Bands.findOne({_id: req.params.id}).then((bands) => {
			res.send(bands);
		});
	});
});

// ALBUMS

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
				foreignField: "bandId",
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

// SINGERS

router.get("/singers", (req, res) => {
	let data;
	let option;
	if (req.query.sort) {
		let fieldForSort = Object.keys(req.query.sort).toString();
		let optionSort = req.query.sort[fieldForSort] === "asc" ? 1 : -1;
		option = {[fieldForSort]: optionSort};
	}
	else {
		option = {};
	}
	let position = +req.query.start || 0;
	let limit = +req.query.count || 15;
	let totalCount;

	Singers.countDocuments({}, (err, count) => {
		totalCount = count;
		Singers.find({})
			.sort(option)
			.skip(position)
			.limit(limit)
			.then((singers) => {
				let results = [];
				singers.map((singer) => {
					let result = {
						id: singer._id,
						name: singer.name,
						role: singer.role,
						birth: singer.birth,
						country: singer.country,
						awards: singer.awards
					};
					results.push(result);
					return results;
				});
				data = {
					data: results,
					pos: position,
					total_count: totalCount
				};
				res.send(data);
			});
	});
});

router.put("/singers/:id", (req, res) => {
	Singers.findByIdAndUpdate({_id: req.params.id}, req.body).then(() => {
		Singers.findOne({_id: req.params.id}).then((bands) => {
			res.send(bands);
		});
	});
});

module.exports = router;
