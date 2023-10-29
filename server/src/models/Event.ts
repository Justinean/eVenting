import {Schema, model} from 'mongoose';

interface BetterEventType extends EventType {
    creator: Schema.Types.ObjectId;
}

const eventSchema = new Schema<BetterEventType>(
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
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        toJSON: {
            virtuals: true,
        },
    }
);

const EventModel = model<BetterEventType>('Event', eventSchema);

export {EventModel, eventSchema};