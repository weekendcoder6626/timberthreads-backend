import { Schema, model } from 'mongoose';

export const sessionModel = model('Session', new Schema({
    token: {
        type: String,
        unique: true
    },
    email: String,
}));