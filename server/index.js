const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routers = require("./routes/api");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors());
app.use("/api", routers);

const url = "mongodb://0.0.0.0:27017/musicApp";

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
mongoose.Promise = global.Promise;

app.listen(3000);
