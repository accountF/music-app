const express = require("express");
const Singers = require("../models/singers");

const router = express.Router();

router.get("/singers", (req, res) => {
	let fieldForSort;
	let optionSort;
	if (req.query.sort) {
		fieldForSort = Object.keys(req.query.sort).toString();
		optionSort = req.query.sort[fieldForSort] === "asc" ? 1 : -1;
	}
	else {
		fieldForSort = "_id";
		optionSort = 1;
	}

	let position = +req.query.start || 0;
	let limit = +req.query.count || 20;
	let totalCount;

	Singers.countDocuments({}, (err, count) => {
		totalCount = count;
		Singers
			.aggregate([
				{
					$lookup: {
						from: "bands",
						localField: "bands",
						foreignField: "_id",
						as: "bandInfo"
					}
				},
				{
					$sort: {[fieldForSort]: optionSort}
				},
				{
					$unwind: {path: "$bandInfo"}
				},
				{
					$group: {
						_id: "$bandInfo.name",
						data: {
							$push: {
								id: "$_id",
								name: "$name",
								role: "$role",
								birth: "$birth",
								country: "$country",
								awards: "$awards"
							}
						}
					}
				}
			])
			.skip(position)
			.limit(limit)
			.then((singers) => {
				let results = singers.map((singer) => {
					let result = {
						bandName: singer._id,
						data: singer.data
					};
					return result;
				});
				let data = {
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
		Singers.findOne({_id: req.params.id}).then((singer) => {
			res.send(singer);
		});
	});
});

module.exports = router;
