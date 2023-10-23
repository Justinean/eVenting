const express = require("express");
const path = require('path');
require("dotenv").config();
const mongoose = require("mongoose");
const { User } = require("../server/models");
const jwt = require("jsonwebtoken");
const expiration = "2h";

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
    try {
        const users = await User.find({username: req.body.username});
        let id = 1111;
        console.log("entering loop " + id);
        while (users.find((user) => user.id === (id).toString())) {
            id++;
        }
        console.log("exiting loop "+ id);

        if (users.length + 1 > 9999) return res.json({errorMessage: "Username is already taken"});

        const user = await User.create({...req.body, id: id.toString()});
        if (!user) return res.json({errorMessage: "Could not create user"});
        console.log(user);

        const payload = {username: user.username, id: user.id};
        const accessToken = jwt.sign({data: payload}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: expiration});
        res.json({accessToken: accessToken});
    } catch (err) {
        console.error(err)
        return res.json({errorMessage: "An unknown error has occured"});
    }
})

app.post("/api/users/signin", async (req, res) => {
    try {
        let user;
        if (req.body.username.split("#").length > 1) {
            user = await User.findOne({username: req.body.username.split("#")[0], id: req.body.username.split("#")[1]});
        } else {
            user = await User.findOne({email: req.body.username});
        }
        if (!user) {
            return res.json({errorMessage: "No user found"});
        }
        const correctpw = user.isCorrectPassword(req.body.password);
        if (!correctpw) return res.json({errorMessage: "Incorrect username or password"});
    
        const payload = {username: user.username, id: user.id.toString()};
        const accessToken = jwt.sign({data: payload}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: expiration});
    
        res.json({accessToken: accessToken});
    } catch (err) {
        console.error(err)
        res.json({errorMessage: "An unknown error has occured"});
    }
})

db.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    })
});

