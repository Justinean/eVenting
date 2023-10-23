const express = require("express");
const path = require('path');
require("dotenv").config();
const mongoose = require("mongoose");
const {User} = require("../server/models/index.js");
const jwt = require("jsonwebtoken");

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

app.post("/api/users/signup", async (req, res) => {
    console.log(req.body);
    const user = await User.create(req.body);
    if (!user) return res.json({errorMessage: "An unknown error has occured"});
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken: accessToken});
})

app.post("/api/users/signin", async (req, res) => {
    const user = await User.findOne({username: req.body.username});
    if (!user) {
        user = await User.findOne({email: req.body.username});
        if (!user) return res.json({errorMessage: "No user found"});
    }

    const correctpw = User.isCorrectPassword(req.body.password);

    if (!correctpw) return res.json({errorMessage: "Incorrect username or password"});

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    res.json({accessToken: accessToken});
})

db.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    })
});

