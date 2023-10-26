type UserData = {
    data: {
        username: string;
        id: string;
        _id: string;
    }
}
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

interface CustomObject extends Object {
    payload: {
        data: {
            username: string;
            id: string;
        };
        iat: number;
        exp: number;
    };
    signature?: string;
}