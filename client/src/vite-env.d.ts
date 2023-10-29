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
    refreshToken: () => Promise<TokenType>;
    login: (idToken: string, idToken2?: string) => void;
    logout: () => void;
}