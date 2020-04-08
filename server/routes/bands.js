const express = require("express");
const Bands = require("../models/bands");

const ObjectId = require("mongodb").ObjectID;

const router = express.Router();

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

router.get("/bands/:id", (req, res) => {
	Bands.aggregate([
		{
			$match: {_id: ObjectId(req.params.id)}
		},
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
				_id: 0,
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

module.exports = router;
