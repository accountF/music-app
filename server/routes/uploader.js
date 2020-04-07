const express = require("express");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
});

const upload = multer({storage});

const router = express.Router();

router.post("/uploader", upload.single("upload"), (req, res) => {
	res.send(req.file);
});

router.get("/uploader", (req, res) => {
	if (fs.existsSync("./uploads")) {
		fs.readdir("./uploads", (err, files) => {
			let results = files.map((file) => {
				let stats = fs.statSync(`./uploads/${file}`);
				let fileSizeInBytes = stats.size;
				const convertBytes = (bytes) => {
					const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
					const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
					if (i === 0) return `${bytes} ${sizes[i]}`;
					return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
				};
				let fileSize = convertBytes(fileSizeInBytes);
				let result = {
					name: file,
					size: fileSize
				};
				return result;
			});
			res.send(results);
		});
	}
});

module.exports = router;
