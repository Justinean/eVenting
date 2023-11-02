import {Schema, model} from 'mongoose';

interface BetterPostType extends PostType {
    author: Schema.Types.ObjectId;
    comments: Schema.Types.ObjectId[];
    likes: Schema.Types.ObjectId[];
    reposts: Schema.Types.ObjectId[];
}

const postSchema = new Schema<BetterPostType>({
    text: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    reposts: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
});

const PostModel = model<BetterPostType>('Post', postSchema);

export { PostModel, BetterPostType };