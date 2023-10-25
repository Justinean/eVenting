import { Request, Response, NextFunction } from 'express';
import * as env from 'dotenv';
env.config();
import { VerifyErrors, verify} from 'jsonwebtoken';

// type ReqBody = {
//     username: string; 
//     password: string; 
//     email: string; 
//     title: string; 
//     description: string; 
//     additional: string; 
//     date: string; 
//     time: string;
//     location: string; 
//     creator: string; 
//     creatorId: string;
// }

function authenticateToken(req: Request, res: Response, next: NextFunction) {
    console.log("in auth")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (token == null) return res.sendStatus(401);
    verify(token, process.env.ACCESS_TOKEN_SECRET || '', {complete: true}, (err: VerifyErrors | null, user: object | undefined) => {
        console.log(err);
        if (err) return res.sendStatus(403);
        console.log(user);
        // req.userdata = user;
        next();
    })
}

export default authenticateToken;

