import * as express from 'express';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import * as mongoose from 'mongoose';
import { EventModel, UserModel, PostModel } from './models';
import { authenticateToken } from './utils/token';
import { HydratedDocument } from 'mongoose';
const app = express();

const port = process.env.PORT || 3000;

// const connectionOptions = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }

mongoose.connect(process.env.MONGODBURI || "mongodb://127.0.0.1:27017/eVents");


const db = mongoose.connection;

db.on('error', (error: Error) => {
    console.error('MongoDB connection error:', error);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    console.log(req.url);
    res.send("../client/public/index.html");
});

app.get("/profiles/:id", async (req: Request, res: Response) => {
    try {
        const userData = await UserModel.findOne({_id: req.params.id});
        if (!userData) throw new Error("User not found");
        const events = await EventModel.find({creator: req.params.id});
        const returnData = {
            username: userData.username,
            id: userData.id,
            _id: userData._id,
            bio: userData.bio,
            profilePicture: userData.profilePicture,
            followers: userData.followers,
            following: userData.following,
            events,
        }
        const posts = await PostModel.find({creator: req.params.id});
        return res.json({returnData, posts});
    } catch (err) {
        console.error(err);
        return res.json({errorMessage: "User not found", errorCode: 404});
    }
})

app.put("/profiles/edit", authenticateToken, async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find({username: req.body.username});
        let id = 1111;
        if (req.body.username !== req.token?.payload.data.username) {
            while (users.find((user: UserType) => user.id === (id).toString())) {
                id++;
            }
        }

        let userData;

        if (users.length + 1 > 9999) return res.json({errorMessage: "Username is not available"});

        if (!req.token?.payload.data._id) throw new Error("User not found");
        if (req.body.username !== req.token?.payload.data.username) {
            userData = await UserModel.findOneAndUpdate({_id: req.token?.payload.data._id}, {username: req.body.username, id, bio: req.body.bio, profilePicture: req.body.profilePicture}, {new: true});
        } else {
            userData = await UserModel.findOneAndUpdate({_id: req.token?.payload.data._id}, {bio: req.body.bio, profilePicture: req.body.profilePicture}, {new: true});
        }
        if (!userData) throw new Error("User could not be updated");
        const events = await EventModel.find({creator: req.token?.payload.data._id});
        const returnData = {
            username: userData.username,
            id: userData.id,
            _id: userData._id,
            bio: userData.bio,
            profilePicture: userData.profilePicture,
            followers: userData.followers,
            following: userData.following,
            events,
        }
        return res.json(returnData);
    } catch (err) {
        console.error(err);
        return res.json({errorMessage: "An unknown error has occured", errorCode: 500});
    }
})

app.put("/profile/follow/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findOne({_id: req.params.id});
        if (!user) return res.json({errorMessage: "Follow user not found", errorCode: 404});
        const currentUser = await UserModel.findOne({_id: req.token?.payload.data._id});
        if (!currentUser) return res.json({errorMessage: "User not found", errorCode: 404});
        const followers = user.followers;
        const following = currentUser.following;
        if (following?.includes(user._id)) {
            res.json({errorMessage: "User already followed", errorCode: 400});
        }
        const updatedUser = await UserModel.findOneAndUpdate({_id: req.params.id}, {followers: [...(followers || []), currentUser]}, {new: true});
        if (!updatedUser) throw new Error("Follow user could not be updated");
        const updatedCurrentUser = await UserModel.findOneAndUpdate({_id: req.token?.payload.data._id}, {following: [...(following || []), user]}, {new: true});
        if (!updatedCurrentUser) throw new Error("User could not be updated");
        const events = await EventModel.find({creator: req.params.id});
        const returnData = {
            username: updatedUser.username,
            id: updatedUser.id,
            _id: updatedUser._id,
            bio: updatedUser.bio,
            profilePicture: updatedUser.profilePicture,
            followers: updatedUser.followers,
            following: updatedUser.following,
            events,
        }
        return res.json(returnData);
    } catch (err) {
        console.error(err);
        return res.json({errorMessage: "An unknown error has occured", errorCode: 500});
    }
})

app.put("/profile/unfollow/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findOne({_id: req.params.id});
        if (!user) return res.json({errorMessage: "Follow user not found", errorCode: 404});
        const currentUser = await UserModel.findOne({_id: req.token?.payload.data._id});
        if (!currentUser) return res.json({errorMessage: "User not found", errorCode: 404});
        const followers = user.followers;
        const following = currentUser.following;
        if (!following?.includes(user._id)) {
            return res.json({errorMessage: "User not followed", errorCode: 400});
        }
        const updatedUser = await UserModel.findOneAndUpdate({_id: req.params.id}, {followers: followers?.filter((follower: string) => follower.toString() !== currentUser._id.toString())}, {new: true});
            if (!updatedUser) throw new Error("Follow user could not be updated");
        const updatedCurrentUser = await UserModel.findOneAndUpdate({_id: req.token?.payload.data._id}, {following: following?.filter((followedUser: string) => followedUser.toString() !== user._id.toString())}, {new: true});
            if (!updatedCurrentUser) throw new Error("User could not be updated");
        const events = await EventModel.find({creator: req.params.id});
        const returnData = {
            username: updatedUser.username,
            id: updatedUser.id,
            _id: updatedUser._id,
            bio: updatedUser.bio,
            profilePicture: updatedUser.profilePicture,
            followers: updatedUser.followers,
            following: updatedUser.following,
            events,
        }
        return res.json(returnData);
    } catch (err) {
        console.error(err);
        return res.json({errorMessage: "An unknown error has occured", errorCode: 500});
    }
})

app.post("/posts/create", authenticateToken, async (req: Request, res: Response) => {
    try {
        if (!req.token?.payload.data._id) throw new Error("User not found");
        const postDetails: {text: string, content: string, creator: mongoose.ObjectId | string} = {
            text: req.body.text,
            content: req.body.postContent,
            creator: req.token?.payload.data._id,
        }

        const post = await PostModel.create(postDetails);
        if (!post) return res.json({errorMessage: "An unknown error has occured", errorCode: 500});
        const returnData = {
            text: post.text,
            images: post.images,
            creator: post._id
        }

        return res.json(returnData);

    } catch (err) {
        console.error(err);
        return res.json({errorMessage: "An unknown error has occured", errorCode: 500});
    }
})

app.post("/events/create", authenticateToken, async (req: Request, res: Response) => {
    try {
        if (!req.token?.payload.data._id) throw new Error("User not found");
        const eventDetails = {
            name: req.body.eventName,
            time: req.body.eventTime,
            location: req.body.eventLocation,
            description: req.body.eventDescription,
            additional: req.body.eventAdditional,
            date: req.body.eventDate,
            creator: req.token?.payload.data._id,
        }

        const event: HydratedDocument<EventType> = await EventModel.create(eventDetails);
        if (!event) return res.json({errorMessage: "An unknown error has occured", errorCode: 500});
        return res.json(event);
    } catch (err) {
        console.error(err);
        return res.json({errorMessage: "An unknown error has occured", errorCode: 500});
    }
})

db.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Main server listening on port ${port}`);
    })
});
