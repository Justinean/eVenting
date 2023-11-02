import { Request, Response, NextFunction } from 'express';
const expiration = "5s";
import * as jwt from 'jsonwebtoken';
import { Schema } from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();
import { verify } from 'jsonwebtoken';
import { BetterToken } from '../../types/custom';

interface BetterUserData extends UserData {
    _id: Schema.Types.ObjectId;
}

export async function generateAccessToken({username, id, _id}: BetterUserData) {
    const payload = {username, id, _id};
    if (process.env.ACCESS_TOKEN_SECRET === undefined) throw new Error("ACCESS_TOKEN_SECRET is undefined");
    return new Promise((resolve, reject) => {
        return jwt.sign({data: payload}, process.env.ACCESS_TOKEN_SECRET || '', {}, (err, token) => {
            if (err) {
                reject(err);
            } else if (token == null) {
                reject(new Error("Token is undefined"));
            } else {
                resolve(token);
            }
    })})
}

export function generateRefreshToken(payload: object) {
    if (process.env.REFRESH_TOKEN_SECRET === undefined) throw new Error("ACCESS_TOKEN_SECRET is undefined");
    return new Promise((resolve, reject) => {
        return jwt.sign({data: payload}, process.env.REFRESH_TOKEN_SECRET || '', {}, (err, token) => {
            if (err) {
                reject(err);
            } else if (token == null) {
                reject(new Error("Token is undefined"));
            } else {
                resolve(token);
            }
    })})
}

export function verifyRefreshToken(token: string) {
    if (process.env.REFRESH_TOKEN_SECRET === undefined) throw new Error("ACCESS_TOKEN_SECRET is undefined");
    return new Promise((resolve, reject) => {verify(token, process.env.REFRESH_TOKEN_SECRET || '', {complete: true}, (err: Error | null, tokenData: object | undefined) => {
        if (err) reject(err);
        const accessToken = generateAccessToken({username: (tokenData as BetterToken)?.payload?.data.username, id: (tokenData as BetterToken)?.payload?.data.id, _id: (tokenData as BetterToken)?.payload?.data._id});
        if (!accessToken) reject(new Error("Could not generate access token"));
        resolve(accessToken);
    })});
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
            req.token = tokenData as BetterToken;
            next();
        })
    } catch (err) {
        console.error(err);
        return res.sendStatus(403);
    }
}

export { BetterUserData };