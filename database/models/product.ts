import { Schema, model } from 'mongoose';

export const productModel = model('Product', new Schema({
    productName: String,
    sellerEmail: String,
    shortDesc: String,
    productDesc: String,
    productFeatures: [String],
    smallImage: String,
    largeImage: [String],
    rating: {
        type: Number,
        default: 0
    },
    reviews: [{
        email: String,
        review: String,
        rating: Number
    }],
    price: Number,
    discountPercent: {
        type: Number,
        default: 0
    },
    featured: Number,
}));