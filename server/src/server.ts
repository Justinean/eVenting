import * as express from 'express';
import { Request, Response } from 'express';
import {config as dotconfig} from 'dotenv';
dotconfig();
import * as mongoose from 'mongoose';
import { EventModel } from './models';
import authenticateToken from './utils/authMiddleware';
import { HydratedDocument } from 'mongoose';
const app = express();

const port = process.env.PORT || 3001;

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

app.get("/", (req, res) => {
    console.log(req.url);
    res.send("../client/public/index.html");
});

app.post("/api/events/create", authenticateToken, async (req: Request, res: Response) => {
    console.log("Creating event");
    try {
        console.log("Creating event");
        const event: HydratedDocument<EventType> = await EventModel.create({...req.body, creator: (req as any).userdata.data.username, creatorId: (req as any).userdata.data.id});
        console.log(event);
        if (!event) return res.json({errorMessage: "An unknown error has occured"});
        return res.json(event);
    } catch (err) {
        console.error(err);
        return res.json({errorMessage: "An unknown error has occured"});
    }
})

db.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
        console.log(`Main server listening on port ${port}`);
    })
});
