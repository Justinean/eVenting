/// <reference types="mongoose" />

type UserData = {
    username: string;
    id: string;
    _id: string;
}

interface Token extends Object {
    header: {
        alg: string;
        typ: string;
    };
    payload: {
        data: UserData;
        iat: number;
        exp: number;
    };
    signature?: string;
}

type UserType = {
    username: string;
    email: string;
    password: string;
    bio?: string;
    id: string;
    followedEvents?: EventType[];
    followers?: string[];
    following?: string[];
    profilePicture?: string;
    _id?: string;
    isCorrectPassword: (password: string) => Promise<boolean>;
}

type EventType = {
    name: string;
    date: Date;
    time: string;
    location: string;
    description: string;
    additional?: string;
}

interface TokenType {
    token: string;
}

interface PostType {
    text: string;
    images?: string[];
}