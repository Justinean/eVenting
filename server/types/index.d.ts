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

type UserType = {
    username: string;
    email: string;
    password: string;
    id: string;
    followedEvents: [EventType];
    isCorrectPassword: (password: string) => Promise<boolean>;
}
type EventType = {
    name: string;
    date: Date;
    time: string;
    location: string;
    description: string;
    additional?: string;
    creator?: string;
    creatorId?: string;
}