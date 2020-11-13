import {Document, model, Schema} from 'mongoose';

interface IUser extends Document {
    email: string,
    username: string,
    password: string
}

const UserSchema = new Schema({
    email: {
        unique: true,
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    }
});

export const User = model<IUser>('users', UserSchema);
