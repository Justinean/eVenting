// declare global {
//     namespace Express {
//         interface Request {
//             userdata: {
//                 data: {
//                     username: string;
//                     id: string;
//                     _id: string;
//                 }
//             }
//             body: any
//         }
//     }
// }

declare namespace ModelTypes {
    export interface UserType {
        username: string;
        email: string;
        password: string;
        id: string;
        followedEvents: [EventType];
        isCorrectPassword: (password: string) => Promise<boolean>;
    }
    export interface EventType {
        name: string;
        date: Date;
        time: string;
        location: string;
        description: string;
        additional?: string;
        creator?: string;
        creatorId?: string;
    }
}