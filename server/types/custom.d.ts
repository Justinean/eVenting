export {};

declare module 'express' {
        interface Request {
            token?: Token;
        }
}
