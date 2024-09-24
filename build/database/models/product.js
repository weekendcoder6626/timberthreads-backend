"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productModel = void 0;
const mongoose_1 = require("mongoose");
exports.productModel = (0, mongoose_1.model)('Product', new mongoose_1.Schema({
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
