import * as bcrypt from 'bcrypt';
import { Schema, model } from "mongoose";

const userSchema = new Schema<UserType>(
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

const UserModel = model<UserType>('User', userSchema);

export {UserModel, userSchema};