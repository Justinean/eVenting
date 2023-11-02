import {Schema, model} from 'mongoose';

interface BetterCommentType extends CommentType {
    author: Schema.Types.ObjectId;
    likes: Schema.Types.ObjectId[];
    comments: Schema.Types.ObjectId[];
}

const commentSchema = new Schema<BetterCommentType>({
    text: {
        type: String,
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
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});

const CommentModel = model<BetterCommentType>('Comment', commentSchema);

export { CommentModel, BetterCommentType };