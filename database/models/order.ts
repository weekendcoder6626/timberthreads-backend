import { Schema, model } from 'mongoose';

export const orderModel = model('Order', new Schema({
    orderID: String,
    userEmail: String,
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        },

        quantity: {
            type: Number,
            default: 1
        }
    }],
    orderDate: String
}));