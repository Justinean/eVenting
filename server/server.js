const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODBURI, {
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

