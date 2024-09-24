"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderModel = void 0;
const mongoose_1 = require("mongoose");
exports.orderModel = (0, mongoose_1.model)('Order', new mongoose_1.Schema({
    orderID: String,
    userEmail: String,
    items: [{
            product: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                default: 1
            }
        }],
    orderDate: String
}));
