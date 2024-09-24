"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = require("mongoose");
exports.userModel = (0, mongoose_1.model)('User', new mongoose_1.Schema({
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
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Product'
            }]
    },
    cart: [{
            product: String,
            quantity: Number
        }],
    isFirstLogin: {
        type: Number,
        default: 0
    }
}));
