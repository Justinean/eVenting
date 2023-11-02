import * as bcrypt from 'bcrypt';
import { Schema, model } from "mongoose";

interface BetterUserType extends UserType {
    _id: Schema.Types.ObjectId;
    followedEvents?: Schema.Types.ObjectId[];
    followers?: Schema.Types.ObjectId[];
    following?: Schema.Types.ObjectId[];
}

const userSchema = new Schema<BetterUserType>(
    {
        username: {
            type: String,
            required: true,
            unique: false,
            caseSensitive: false
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, 'Must use a valid email address'],
            caseSensitive: false
        },
        bio: {
            type: String,
            required: false,
            unique: false,
            caseSensitive: true
        },
        password: {
            type: String,
            required: true,
        },
        id: {
            type: String,
        },
        followedEvents: [{
            type: Schema.Types.ObjectId, 
            ref: 'Event'
        }],
        followers: [{
            type: Schema.Types.ObjectId, 
            ref: 'User'
        }],
        following: [{
            type: Schema.Types.ObjectId, 
            ref: 'User'
        }],
        profilePicture: {
            type: String,
        }
    },
    {
        toJSON: {
            virtuals: true,
        },
    }
);

// Hashes user password.
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        if (this.id.length < 4) {
            this.id = this.id.padStart(4, "1");
        }
    }

    next();
});

// Custom method to compare and validate password for logging in.
userSchema.methods.isCorrectPassword = async function (password: string) {
    return bcrypt.compare(password, this.password);
};

const UserModel = model<BetterUserType>('User', userSchema);

export {UserModel, userSchema, BetterUserType};