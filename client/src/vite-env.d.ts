/// <reference types="vite/client" />

interface ProfileData {
    username: string;
    id: string;
    _id: string;
    bio?: string;
    profilePicture?: string;
    following?: string[];
    followers?: string[];
}

type UserType = {
    username: string;
    id: string;
    _id: string;
    bio: string;
    followedEvents: string[];
    followers: string[];
    following: string[];
    profilePicture?: string;
}

type EventType = {
    name: string;
    date: Date;
    time: string;
    location: string;
    description: string;
    additional?: string;
    creator: {
        username: string;
        id: string;
    };
    _id: string;
}

interface PostType {
    text: string;
    images: string[];
    author: string;
    _id: string;
    comments: {
        text: string;
        author: {
            username: string;
            id: string;
        };
        likes: string[];
        _id: string;
    }[]
    likes: string[];
    reposts: string[];
}

interface CommentType {
    text: string;
    likes: string[];
    _id: string;
}

interface TokenData {
    username: string;
    id: string;
    _id: string;
}

interface TokenShape {
    exp: number;
    iat: number;
    data: TokenData;
}

interface AuthServiceType {
    getProfile: () => TokenShape;
    loggedIn: () => boolean;
    isTokenExpired: () => boolean;
    getToken: () => string;
    getRefreshToken: () => string;
    refreshToken: () => Promise<string | null>;
    login: (idToken: string, idToken2?: string) => void;
    logout: () => void;
}