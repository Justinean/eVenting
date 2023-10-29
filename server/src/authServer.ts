import * as express from 'express';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
console.log(process.env.MONGODBURI);
import * as mongoose from 'mongoose';
import { UserModel, TokenModel } from './models';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from './utils/token';
const expiration = "2h";

const app = express();

const port = 4000;

mongoose.connect(process.env.MONGODBURI || "mongodb://127.0.0.1:27017/eVents");

const db = mongoose.connection;

db.on('error', (error: Error) => {
    console.error('MongoDB connection error:', error);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/token", async (req: Request, res: Response) => {
    try {
        const refreshToken = req.body.token;
        if (refreshToken == null) throw new Error("Token not sent");
        const token = await TokenModel.findOne({token: refreshToken});
        if (!token) throw new Error("Token not found");
        console.log("refreshed token");
        res.json({accessToken: verifyRefreshToken(refreshToken)});
    } catch (err) {
        console.error(err);
        return res.sendStatus(403);
    }
})

app.post("/signup", async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find({username: req.body.username});
        let id = 1111;
        while (users.find((user: UserType) => user.id === (id).toString())) {
            id++;
        }

        if (users.length + 1 > 9999) return res.json({errorMessage: "Username is already taken"});

        const user = await UserModel.create({...req.body, id: id.toString()});
        if (!user) return res.json({errorMessage: "Could not create user"});
        console.log(user);

        const accessToken = generateAccessToken(user.username, user.id, user._id);
        const refreshToken = generateRefreshToken({username: user.username, id: user.id, _id: user._id});
        await TokenModel.create({token: refreshToken});
        return res.json({accessToken, refreshToken});
    } catch (err) {
        console.error(err)
        return res.json({errorMessage: "An unknown error has occured"});
    }
})

app.post("/signin", async (req: Request, res: Response) => {
    try {
        let user;
        if (req.body.username.split("#").length > 1) {
            user = await UserModel.findOne({username: req.body.username.split("#")[0], id: req.body.username.split("#")[1]});
        } else {
            user = await UserModel.findOne({email: req.body.username});
        }
        if (!user) {
            return res.json({errorMessage: "No user found"});
        }
        const correctpw = user.isCorrectPassword(req.body.password);
        if (!correctpw) return res.json({errorMessage: "Incorrect username or password"});
    
        const accessToken = generateAccessToken(user.username, user.id, user._id);
        const refreshToken = generateRefreshToken({username: user.username, id: user.id, _id: user._id});
        await TokenModel.create({token: refreshToken});
        return res.json({accessToken, refreshToken});
    } catch (err) {
        console.error(err)
        res.json({errorMessage: "An unknown error has occured"});
    }
})

app.delete("/logout", async (req: Request, res: Response) => {
    const token = await TokenModel.deleteOne({token: req.body.token});
    if (!token) return res.sendStatus(403);
    return res.sendStatus(204);
})

db.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Auth listening on port ${port}`);
    })
});

