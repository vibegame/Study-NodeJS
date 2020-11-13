import {Document, model, Schema} from "mongoose";

export interface SessionDocument extends Document {
    token: string,
    expiration: Date,
    user: any
}

export interface SessionFields {
    token?: string,
    expiration?: Date,
    user?: any
}

const SessionSchema = new Schema({
    expiration: {
        type: Date,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
        unique: true
    }
});

export const Session = model<SessionDocument>('sessions', SessionSchema);
