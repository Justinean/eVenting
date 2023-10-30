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
    email: string;
    password: string;
    bio?: string;
    id: string;
    followedEvents?: EventType[];
    followers?: UserType[];
    following?: UserType[];
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

interface TokenData {
    data: {
        username: string;
        id: string;
        _id: string;
    }
}

interface TokenShape {
    exp: number;
    iat: number;
    data: TokenData;
}

interface AuthServiceType {
    getProfile: () => TokenData;
    loggedIn: () => boolean;
    isTokenExpired: () => boolean;
    getToken: () => string;
    getRefreshToken: () => string;
    refreshToken: () => Promise<string | null>;
    login: (idToken: string, idToken2?: string) => void;
    logout: () => void;
}