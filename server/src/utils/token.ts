import { Request, Response, NextFunction } from 'express';
const expiration = "10s";
import * as jwt from 'jsonwebtoken';
import { Types } from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();
import { verify } from 'jsonwebtoken';

export function generateAccessToken(username: string, id: string, _id: string | Types.ObjectId) {
    const payload = {username, id, _id};
    if (process.env.ACCESS_TOKEN_SECRET === undefined) throw new Error("ACCESS_TOKEN_SECRET is undefined");
    return jwt.sign({data: payload}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: expiration});
}

export function generateRefreshToken(payload: object) {
    if (process.env.REFRESH_TOKEN_SECRET === undefined) throw new Error("ACCESS_TOKEN_SECRET is undefined");
    return jwt.sign({data: payload}, process.env.REFRESH_TOKEN_SECRET);
}

export function verifyRefreshToken(token: string) {
    return verify(token, process.env.REFRESH_TOKEN_SECRET || '', {complete: true}, (err: Error | null, tokenData: object | undefined) => {
        if (err) throw err;
        const accessToken = generateAccessToken((tokenData as Token)?.payload?.data.username, (tokenData as Token)?.payload?.data.id, (tokenData as Token)?.payload?.data._id);
        return accessToken;
    })
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    try {
        console.log("in auth")
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (token == null) return res.sendStatus(401);
        verify(token, process.env.ACCESS_TOKEN_SECRET || '', {complete: true}, (err: Error | null, tokenData: object | undefined) => {
            if (err) throw err;
            if (err || tokenData == null) return res.sendStatus(403);
            if (tokenData === undefined) return res.sendStatus(403);
            req.token = tokenData as Token;
            next();
        })
    } catch (err) {
        console.error(err);
        return res.sendStatus(403);
    }
}