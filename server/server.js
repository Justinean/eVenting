const express = require("express");
const path = require('path');
require("dotenv").config();
const mongoose = require("mongoose");
const {User} = require("../server/models/index.js");

const app = express();

const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODBURI || "mongodb://127.0.0.1:27017/eVents", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const db = mongoose.connection;

db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    console.log(req.url);
    File.send("../client/public/index.html");
});

app.post ("/api/users/signup", (req, res) => {
    console.log(req.body);
    res.send("Hello");
})

db.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    })
});

