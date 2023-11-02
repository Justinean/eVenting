import * as express from 'express';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
dotenv.config();
import * as mongoose from 'mongoose';
import { EventModel, UserModel, PostModel } from './models';
import { BetterPostType, BetterUserType, BetterCommentType, BetterToken } from '../types/custom';
import { authenticateToken } from './utils/token';
import { HydratedDocument } from 'mongoose';
import { CommentModel } from './models/Comment';
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

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.get("/", (req: Request, res: Response) => {
    console.log(req.url);
    res.send("../client/public/index.html");
});

app.get("/profiles/:id", async (req: Request, res: Response) => {
    try {
        const userData = await UserModel.findOne({_id: req.params.id});
        if (!userData) throw new Error("User not found");
        const events = await EventModel.find({creator: req.params.id});
        const returnEvents = [];
        for (let event of events) {
            const eventCreator = await UserModel.findOne({_id: event.creator});
            if (!eventCreator) continue;
            returnEvents.push({
                name: event.name,
                date: event.date,
                time: event.time,
                location: event.location,
                description: event.description,
                additional: event.additional,
                creator: {
                    username: eventCreator.username,
                    id: eventCreator.id
                },
                _id: event._id
            })
        }
        const profileData = {
            username: userData.username,
            id: userData.id,
            _id: userData._id,
            bio: userData.bio,
            profilePicture: userData.profilePicture,
            followers: userData.followers,
            following: userData.following,
        }
        
        return res.json(profileData);
    } catch (err) {
        console.error(err);
        return res.json({errorMessage: "User not found", errorCode: 404});
    }
})

app.get("/profiles/followering/:id", async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findOne({_id: req.params.id});
        if (!user) return res.json({errorMessage: "User not found", errorCode: 404});
        const followers = (user.followers || []).map(async (followerId) => {
            const follower = await UserModel.findOne({_id: followerId});
            if (!follower) return null;
            return {
                username: follower.username,
                id: follower.id,
                profilePicture: follower.profilePicture,
                _id: follower._id
        }}) || [];
        const following = (user.following || []).map(async (followingId) => {
            const following = await UserModel.findOne({_id: followingId});
            if (!following) return null;
            return {
                username: following.username,
                id: following.id,
                profilePicture: following.profilePicture,
                _id: following._id
        }}) || [];
        const followerData = await Promise.all(followers);
        const followingData = await Promise.all(following);
        return res.json({followers: followerData, following: followingData});
    } catch (err) {
        console.error(err);
        return res.json({errorMessage: "User not found", errorCode: 404});
    }
})

app.get("/profiles/posts/:id", async (req: Request, res: Response) => {
    try {
        const posts: HydratedDocument<BetterPostType>[]= await PostModel.find({author: req.params.id});
        const postsData = await Promise.all(posts.map(async (post: HydratedDocument<BetterPostType>) => {
            const author = await UserModel.findOne({_id: post.author});
            if (!author) return null;
            const comments = [];
            for (const commentId of post.comments || []) {
                const comment: HydratedDocument<BetterCommentType> | null = await CommentModel.findOne({_id: commentId}) || null;
                if (!comment) break;
                const commentAuthor = await UserModel.findOne({_id: comment.author});
                if (!commentAuthor) continue;
                comments.push({
                    text: comment.text,
                    author: {
                        username: commentAuthor?.username,
                        id: commentAuthor?.id
                    },
                    likes: comment.likes,
                    _id: comment._id
                })
            }
            return {
                text: post.text,
                images: post.images,
                author: {
                    username: author?.username,
                    id: author?.id
                },
                comments,
                _id: post._id,
                likes: post.likes
            }
        }))
        return res.json(postsData);
    } catch (err) {
        console.error(err);
        return res.json({errorMessage: "An unknown error has occured", errorCode: 500});
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
        const returnEvents = [];
        for (let event of events) {
            const eventCreator = await UserModel.findOne({_id: event.creator});
            if (!eventCreator) continue;
            returnEvents.push({
                name: event.name,
                date: event.date,
                time: event.time,
                location: event.location,
                description: event.description,
                additional: event.additional,
                creator: {
                    username: eventCreator.username,
                    id: eventCreator.id
                },
                _id: event._id
            })
        }
        const returnData = {
            username: userData.username,
            id: userData.id,
            _id: userData._id,
            bio: userData.bio,
            profilePicture: userData.profilePicture,
            followers: userData.followers,
            following: userData.following,
        }
        return res.json(returnData);
    } catch (err) {
        console.error(err);
        return res.json({errorMessage: "An unknown error has occured", errorCode: 500});
    }
})

app.put("/profile/follow/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
        let inFollowing = false;
        if (req.query.inFollowing === "true") inFollowing = true;
        const user = await UserModel.findOne({_id: req.params.id});
        if (!user) return res.json({errorMessage: "Follow user not found", errorCode: 404});
        const currentUser = await UserModel.findOne({_id: req.token?.payload.data._id});
        if (!currentUser) return res.json({errorMessage: "User not found", errorCode: 404});
        const followers = (user.followers || []).map((follower) => `${follower}`);
        const following = (currentUser.following || []).map((following) => `${following}`);
        if (following.includes(`${user._id}`)) {
            res.json({errorMessage: "User already followed", errorCode: 400});
        }
        const updatedUser = await UserModel.findOneAndUpdate({_id: req.params.id}, {followers: [...(followers || []), currentUser._id]}, {new: true});
        if (!updatedUser) throw new Error("Follow user could not be updated");
        const updatedCurrentUser = await UserModel.findOneAndUpdate({_id: req.token?.payload.data._id}, {following: [...(following || []), user._id]}, {new: true});
        if (!updatedCurrentUser) throw new Error("User could not be updated");
        let returnData;
        let followingData;
        let followerData;
        if (inFollowing) {
            const followers = (user.followers || []).map(async (followerId) => {
                const follower = await UserModel.findOne({_id: followerId});
                if (!follower) return null;
                return {
                    username: follower.username,
                    id: follower.id,
                    profilePicture: follower.profilePicture,
                    _id: follower._id
            }}) || [];
            const following = (user.following || []).map(async (followingId) => {
                const following = await UserModel.findOne({_id: followingId});
                if (!following) return null;
                return {
                    username: following.username,
                    id: following.id,
                    profilePicture: following.profilePicture,
                    _id: following._id
            }}) || [];
            followerData = await Promise.all(followers);
            followingData = await Promise.all(following);
            returnData = {
                username: updatedCurrentUser.username,
                id: updatedCurrentUser.id,
                _id: updatedCurrentUser._id,
                bio: updatedCurrentUser.bio,
                profilePicture: updatedCurrentUser.profilePicture,
                followers: updatedCurrentUser.followers,
                following: updatedCurrentUser.following,
            }
            return res.json({profileData: returnData, followerData, followingData});
        } else {
            returnData = {
                username: updatedUser.username,
                id: updatedUser.id,
                _id: updatedUser._id,
                bio: updatedUser.bio,
                profilePicture: updatedUser.profilePicture,
                followers: updatedUser.followers,
                following: updatedUser.following,
            }
        }
        return res.json(returnData);
    } catch (err) {
        console.error(err);
        return res.json({errorMessage: "An unknown error has occured", errorCode: 500});
    }
})

app.put("/profile/unfollow/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
        let inFollowing = false;
        if (req.query.inFollowing === "true") inFollowing = true;
        const user = await UserModel.findOne({_id: req.params.id});
        if (!user) return res.json({errorMessage: "Follow user not found", errorCode: 404});
        const currentUser = await UserModel.findOne({_id: req.token?.payload.data._id});
        if (!currentUser) return res.json({errorMessage: "User not found", errorCode: 404});
        const followers = (user.followers || []).map((follower) => `${follower}`);
        const following = (currentUser.following || []).map((following) => `${following}`);
        if (!following.includes(`${user._id}`)) {
            return res.json({errorMessage: "User not followed", errorCode: 400});
        }
        const updatedUser = await UserModel.findOneAndUpdate({_id: req.params.id}, {followers: followers?.filter((follower) => follower != `${currentUser._id}`)}, {new: true});
        if (!updatedUser) throw new Error("Follow user could not be updated");
        const updatedCurrentUser = await UserModel.findOneAndUpdate({_id: req.token?.payload.data._id}, {following: following?.filter((followedUser) => followedUser !== `${user._id}`)}, {new: true});
        if (!updatedCurrentUser) throw new Error("User could not be updated");
        let returnData;
        let followingData;
        let followerData;
        if (inFollowing) {
            const followers = (user.followers || []).map(async (followerId) => {
                const follower = await UserModel.findOne({_id: followerId});
                if (!follower) return null;
                return {
                    username: follower.username,
                    id: follower.id,
                    profilePicture: follower.profilePicture,
                    _id: follower._id
            }}) || [];
            const following = (user.following || []).map(async (followingId) => {
                const following = await UserModel.findOne({_id: followingId});
                if (!following) return null;
                return {
                    username: following.username,
                    id: following.id,
                    profilePicture: following.profilePicture,
                    _id: following._id
            }}) || [];
            followerData = await Promise.all(followers);
            followingData = await Promise.all(following);
            returnData = {
                username: updatedCurrentUser.username,
                id: updatedCurrentUser.id,
                _id: updatedCurrentUser._id,
                bio: updatedCurrentUser.bio,
                profilePicture: updatedCurrentUser.profilePicture,
                followers: updatedCurrentUser.followers,
                following: updatedCurrentUser.following,
            }
            return res.json({profileData: returnData, followerData, followingData});
        } else {
            returnData = {
                username: updatedUser.username,
                id: updatedUser.id,
                _id: updatedUser._id,
                bio: updatedUser.bio,
                profilePicture: updatedUser.profilePicture,
                followers: updatedUser.followers,
                following: updatedUser.following,
            }
            return res.json(returnData);
        }
    } catch (err) {
        console.error(err);
        return res.json({errorMessage: "An unknown error has occured", errorCode: 500});
    }
})

app.put("/profile/forceunfollow/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
        const user = await UserModel.findOne({_id: req.params.id});
        if (!user) return res.json({errorMessage: "Follow user not found", errorCode: 404});
        const currentUser = await UserModel.findOne({_id: req.token?.payload.data._id});
        if (!currentUser) return res.json({errorMessage: "User not found", errorCode: 404});
        const followingIds = (user.following || []).map((following) => `${following}`);
        const followersIds = (currentUser.followers || []).map((followers) => `${followers}`);
        if (!followingIds.includes(`${currentUser._id}`)) {
            return res.json({errorMessage: "User not followed", errorCode: 400});
        }
        const updatedUser = await UserModel.findOneAndUpdate({_id: req.params.id}, {following: followingIds?.filter((followedUser) => followedUser !== `${currentUser._id}`)}, {new: true});
        if (!updatedUser) throw new Error("Follow user could not be updated");
        const updatedCurrentUser = await UserModel.findOneAndUpdate({_id: req.token?.payload.data._id}, {followers: followersIds?.filter((follower) => follower != `${user._id}`)}, {new: true});
        if (!updatedCurrentUser) throw new Error("User could not be updated");
        const followers = (user.followers || []).map(async (followerId) => {
            const follower = await UserModel.findOne({_id: followerId});
            if (!follower) return null;
            return {
                username: follower.username,
                id: follower.id,
                profilePicture: follower.profilePicture,
                _id: follower._id
        }}) || [];
        const following = (user.following || []).map(async (followingId) => {
            const following = await UserModel.findOne({_id: followingId});
            if (!following) return null;
            return {
                username: following.username,
                id: following.id,
                profilePicture: following.profilePicture,
                _id: following._id
        }}) || [];
        const followerData = await Promise.all(followers);
        const followingData = await Promise.all(following);
        const profileData = {
            username: updatedCurrentUser.username,
            id: updatedCurrentUser.id,
            _id: updatedCurrentUser._id,
            bio: updatedCurrentUser.bio,
            profilePicture: updatedCurrentUser.profilePicture,
            followers: updatedCurrentUser.followers,
            following: updatedCurrentUser.following,
        }
        return res.json({profileData, followerData, followingData});
    } catch (err) {
        console.error(err);
        return res.json({errorMessage: "An unknown error has occured", errorCode: 500});
    }
})

/*  
    type: posts or comments
    like: like or unlike
    id: post or comment id
    ex: /posts/like/:id or /comments/unlike/:id
*/
app.put("/:type/:like/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
        if (req.params.like !== "like" && req.params.like !== "unlike") return res.json({errorMessage: "Invalid like type", errorCode: 400});
        if (req.params.type !== "posts" && req.params.type !== "comments") return res.json({errorMessage: "Invalid type type", errorCode: 400});
        if (req.params.type === "posts") {
            let updatedPost: HydratedDocument<BetterPostType> | null = null;
            const post = await PostModel.findOne({_id: req.params.id});
            if (!post) return res.json({errorMessage: "Post not found", errorCode: 404});
            const user: HydratedDocument<BetterUserType> | null = await UserModel.findOne({_id: req.token?.payload.data._id});
            if (!user) return res.json({errorMessage: "User not found", errorCode: 404});
            if (req.params.like === "like") {
                updatedPost = await PostModel.findOneAndUpdate({_id: req.params.id}, {likes: [...(post.likes || []), user]}, {new: true});
                if (!updatedPost) throw new Error("Post could not be updated");
            } else if (req.params.like === "unlike") {
                updatedPost = await PostModel.findOneAndUpdate({_id: req.params.id}, {likes: post.likes.filter((item) => `${item}` != `${user._id}`)}, {new: true});
                if (!updatedPost) throw new Error("Post could not be updated");
            }
            if (!updatedPost) updatedPost = post;
            const comments = [];
            for (const commentId of updatedPost.comments || []) {
                const comment: HydratedDocument<BetterCommentType> | null = await CommentModel.findOne({_id: commentId}) || null;
                if (!comment) break;
                const commentAuthor = await UserModel.findOne({_id: comment.author});
                if (!commentAuthor) continue;
                comments.push({
                    text: comment.text,
                    author: {
                        username: commentAuthor.username,
                        id: commentAuthor.id
                    },
                    likes: comment.likes,
                    _id: comment._id
                })
            }
            const returnData = {
                text: updatedPost.text,
                images: updatedPost.images,
                author: {
                    username: user.username,
                    id: user.id
                },
                comments,
                _id: updatedPost._id,
                likes: updatedPost.likes
            }
            return res.json(returnData)
        } else if (req.params.type === "comments") {
            const comment = await CommentModel.findOne({_id: req.params.id});
            if (!comment) return res.json({errorMessage: "Comment not found", errorCode: 404});
            const user = await UserModel.findOne({_id: req.token?.payload.data._id});
            if (!user) return res.json({errorMessage: "User not found", errorCode: 404});
            let updatedComment: HydratedDocument<BetterCommentType> | null = null;
            if (req.params.like === "like") {
                updatedComment = await CommentModel.findOneAndUpdate({_id: req.params.id}, {likes: [...(comment.likes || []), user]}, {new: true});
                if (!updatedComment) throw new Error("Comment could not be updated");
            } else if (req.params.like === "unlike") {
                updatedComment = await CommentModel.findOneAndUpdate({_id: req.params.id}, {likes: comment.likes.filter((item) => item == user._id)}, {new: true});
                if (!updatedComment) throw new Error("Comment could not be updated");
            }
            if (!updatedComment) updatedComment = comment;
            const commentAuthor = await UserModel.findOne({_id: updatedComment.author});
            if (!commentAuthor) throw new Error("Comment author not found");
            const returnData = {
                text: updatedComment.text,
                author: {
                    username: commentAuthor.username,
                    id: commentAuthor.id
                },
                likes: updatedComment.likes,
                _id: updatedComment._id
            }
            return res.json(returnData);
        }
        } catch (err) {
        console.error(err);
        return res.json({errorMessage: "An unknown error has occured", errorCode: 500});
    }
})

app.put("/posts/comment/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
        const post = await PostModel.findOne({_id: req.params.id});
        if (!post) return res.json({errorMessage: "Post not found", errorCode: 404});
        const user = await UserModel.findOne({_id: req.token?.payload.data._id});
        if (!user) return res.json({errorMessage: "User not found", errorCode: 404});
        const commentDetails = {
            text: req.body.text,
            author: user._id,
        }
        const comment = await CommentModel.create(commentDetails);
        if (!comment) return res.json({errorMessage: "Comment could not be created", errorCode: 500});
        const updatedPost = await PostModel.findOneAndUpdate({_id: req.params.id}, {comments: [...(post.comments || []), comment]}, {new: true});
        if (!updatedPost) throw new Error("Post could not be updated");
        const comments = [];
        for (const commentId of updatedPost.comments || []) {
            const comment: HydratedDocument<BetterCommentType> | null = await CommentModel.findOne({_id: commentId}) || null;
            if (!comment) break;
            const commentAuthor = await UserModel.findOne({_id: comment.author});
            if (!commentAuthor) continue;
            comments.push({
                text: comment.text,
                author: {
                    username: commentAuthor?.username,
                    id: commentAuthor?.id
                },
                likes: comment.likes
            })
        }
        const returnData = {
            text: updatedPost.text,
            images: updatedPost.images,
            author: {
                username: user.username,
                id: user.id
            },
            comments,
            _id: updatedPost._id,
            likes: updatedPost.likes
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
        const postDetails: {text: string, images: ArrayBuffer, author: mongoose.ObjectId | string} = {
            text: req.body.postText,
            images: req.body.postImages,
            author: req.token?.payload.data._id,
        }

        const post = await PostModel.create(postDetails);
        if (!post) return res.json({errorMessage: "An unknown error has occured", errorCode: 500});
        const author = await UserModel.findOne({_id: post.author});
        if (!author) throw new Error("Author not found");
        const returnData = {
            text: post.text,
            images: post.images,
            author: {
                username: author.username,
                id: author.id
            },
            comments: [],
            _id: post._id,
            likes: []
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
