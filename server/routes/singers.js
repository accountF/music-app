const express = require("express");
const Singers = require("../models/singers");

const router = express.Router();

router.get("/singers", (req, res) => {
	let option;
	if (req.query.sort) {
		let fieldForSort = Object.keys(req.query.sort).toString();
		let optionSort = req.query.sort[fieldForSort] === "asc" ? 1 : -1;
		option = {fieldForSort: optionSort};
	}
	else {
		option = {};
	}

	let position = +req.query.start || 0;
	let limit = +req.query.count || 15;
	let totalCount;

	Singers.countDocuments({}, (err, count) => {
		totalCount = count;
		Singers.find({}).populate("bands")
			.sort(option)
			.skip(position)
			.limit(limit)
			.then((singers) => {
				let results = singers.map((singer) => {
					let result = {
						bandName: singer.bands.name,
						data: {
							id: singer._id.toString(),
							name: singer.name,
							role: singer.role,
							birth: singer.birth,
							country: singer.country,
							awards: singer.awards
						}
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
		Singers.findOne({_id: req.params.id}).then((bands) => {
			res.send(bands);
		});
	});
});

module.exports = router;
