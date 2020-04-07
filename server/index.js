const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const bandRouter = require("./routes/bands");
const albumRouter = require("./routes/albums");
const singerRouter = require("./routes/singers");
const songRouter = require("./routes/songs");
const uploaderRouter = require("./routes/uploader");

const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors());
app.use("/", bandRouter);
app.use("/", albumRouter);
app.use("/", singerRouter);
app.use("/", songRouter);
app.use("/", uploaderRouter);


const url = "mongodb://0.0.0.0:27017/musicApp";

mongoose.connect(url, {useNewUrlParser: true, useFindAndModify: false});

app.listen(3000);
