import {Schema, model} from 'mongoose';

const eventSchema = new Schema<EventType>(
    {
        name: {
            type: String,
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        additional: {
            type: String,
        },
        creator: {
            type: String,
        },
        creatorId: {
            type: String,
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
    }
);

const EventModel = model<EventType>('Event', eventSchema);

export {EventModel, eventSchema};