import { Schema, model } from 'mongoose';

export const userModel = model('User', new Schema({
    username: String,
    profilePic: String,
    phNumber: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    wishlist: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }]
    },
    cart:
        [{
            product: String,

            quantity: Number
        }]
    ,
    isFirstLogin: {
        type: Number,
        default: 0
    }
}));