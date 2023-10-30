import {Schema, model} from 'mongoose';

interface BetterPostType extends PostType {
    author: Schema.Types.ObjectId;
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
    }
});

const PostModel = model<BetterPostType>('Post', postSchema);

export { PostModel };