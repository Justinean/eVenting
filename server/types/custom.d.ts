declare module 'express' {
        interface Request {
            token?: BetterToken;
        }
}

import { BetterEventType } from "../src/models/Event.ts";
import { BetterPostType } from "../src/models/Post.ts";
import { BetterCommentType } from "../src/models/Comment.ts";
import { BetterUserType } from "../src/models/User.ts";

import { BetterUserData } from "../src/utils/token.ts";


interface BetterToken extends Token {
    payload: {
        data: BetterUserData;
        iat: number;
        exp: number;
    };
}

export {BetterEventType, BetterPostType, BetterCommentType, BetterUserType, BetterToken};