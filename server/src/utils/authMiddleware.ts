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
interface customObject extends Object {
    payload?: {
        data: object;
        iat: number;
        exp: number;
    };
    signature?: string;
}

function authenticateToken(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("in auth")
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (token == null) return res.sendStatus(401);
        verify(token, process.env.ACCESS_TOKEN_SECRET || '', {complete: true}, (err: Error | null, tokenData: object | undefined) => {
            if (err) throw err;
            if (err || tokenData == null) return res.sendStatus(403);
            if (tokenData === undefined) return res.sendStatus(403);
            req.userdata = tokenData as customObject;
            next();
        })
    } catch (err) {
        console.error(err);
        return res.sendStatus(403);
    }
}

export default authenticateToken;

