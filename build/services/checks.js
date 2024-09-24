"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkProduct = exports.checkUser = void 0;
const product_1 = require("../database/models/product");
const user_1 = require("../database/models/user");
const product_mapping_1 = require("./mappings/product.mapping");
const checkUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const errorRes = { status: 400, message: "", payload: { error: {} } };
    const userDoc = yield user_1.userModel.findOne({ email })
        .populate('wishlist')
        .exec();
    if (!userDoc) {
        errorRes.status = 400;
        errorRes.message = "User does not exist";
        return {
            valid: false,
            res: errorRes
        };
    }
    const fullCart = [];
    const fullWishlist = [];
    for (const prod of userDoc.wishlist) {
        const povw = yield (0, product_mapping_1.detailedToOverviewProductMapping)(prod);
        fullWishlist.push(povw);
    }
    for (const item of userDoc.cart) {
        const productId = item.product;
        if (!productId)
            continue;
        const productDoc = yield product_1.productModel.findOne({ _id: productId });
        if (!productDoc)
            continue;
        const povw = yield (0, product_mapping_1.detailedToOverviewProductMapping)(productDoc.toObject());
        fullCart.push({
            product: povw,
            quantity: item.quantity
        });
    }
    return {
        valid: true,
        userDoc: Object.assign(Object.assign({}, userDoc === null || userDoc === void 0 ? void 0 : userDoc.toObject()), { cart: fullCart, wishlist: fullWishlist })
    };
});
exports.checkUser = checkUser;
const checkProduct = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const errorRes = { status: 400, message: "", payload: { error: {} } };
    try {
        const productDoc = yield product_1.productModel.findOne({ _id: productId });
        if (!productDoc) {
            errorRes.status = 400;
            errorRes.message = "Product doesn't exist";
            return {
                valid: false,
                res: errorRes
            };
        }
        const sellerUser = yield user_1.userModel.findOne({ email: productDoc.sellerEmail });
        if (!sellerUser) {
            errorRes.status = 400;
            errorRes.message = "Seller doesn't exist";
            return {
                valid: false,
                res: errorRes
            };
        }
        return {
            valid: true,
            productDoc,
            sellerUser
        };
    }
    catch (error) {
        errorRes.status = 400;
        errorRes.message = "Some error occurred.";
        errorRes.payload.error = error;
        return {
            valid: false,
            res: errorRes
        };
    }
});
exports.checkProduct = checkProduct;
