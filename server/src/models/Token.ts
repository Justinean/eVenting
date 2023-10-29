import {Schema, model} from 'mongoose';

const tokenSchema = new Schema<TokenType>({
    token: {
        type: String,
    }
});

const TokenModel = model<TokenType>('Token', tokenSchema);

export {TokenModel};