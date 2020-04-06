const express = require("express");
const Bands = require("../models/bands");
const Albums = require("../models/albums");
const Singers = require("../models/singers");
const Songs = require("../models/songs");

const router = express.Router();

// BANDS

router.get("/bands", (req, res) => {
	let bandsInfo = [];
	let promises = [];
	Bands.find({}).then((bands) => {
		bands.map((band) => {
			let bandInfo = {
				id: band._id,
				name: band.name,
				style: band.style,
				creationDate: band.creationDate,
				country: band.country
			};
			promises.push(Songs.find({bandId: band._id}).then((songs) => {
				let songArray = [];
				songs.map(song => songArray.push(song.name));
				bandInfo.songs = songArray.join(", ");
				bandsInfo.push(bandInfo);
			}));
		});
		Promise.all(promises).then(() => {
			res.send(bandsInfo);
		});
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
	let results = [];
	let promises = [];
	Albums.find({bandId: req.params.id}).then((albums) => {
		albums.map((album) => {
			let result = {
				id: album._id,
				name: album.name,
				releaseDate: album.releaseDate,
				numberOfCopies: album.numberOfCopies
			};
			promises.push(Songs.countDocuments({albumId: album._id}, (err, count) => {
				result.numberOfSongs = count;
				results.push(result);
				Promise.all(promises).then(() => {
					res.send(results);
				});
			}));
		});
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
	let results = [];
	let promises = [];
	Albums.findOne({_id: req.params.id}).then((album) => {
		let result = {
			id: album._id,
			albumName: album.name,
			photo: album.photo
		};
		promises.push(Songs.find({albumId: album.id}).then((songs) => {
			let songsArr = [];
			songs.map((song) => {
				songsArr.push(song.name);
			});
			result.songs = songsArr.toString();
		}));
		promises.push(Bands.find({_id: album.bandId}).then((bands) => {
			let bandsArr = [];
			bands.map((band) => {
				bandsArr.push(band.name);
				result.bandName = bandsArr.toString();
				promises.push(Singers.find({bandId: band._id}).then((singers) => {

					let singersArr = [];
					singers.map((singer) => {
						singersArr.push(singer.awards);
					});
					result.awards = singersArr.toString();
					results.push(result);
					Promise.all(promises).then(() => {
						res.send(results);
					});
				}));
			});
		}));
	});
});

// SINGERS

router.get("/singers", (req, res) => {
	let promises = [];
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
		promises.push(Singers.find({})
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
			}));
		Promise.all(promises).then(() => {
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
