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
exports.getUserByEmail = void 0;
exports.getCurrentUser = getCurrentUser;
exports.addProductToWishList = addProductToWishList;
exports.removeProductFromWishList = removeProductFromWishList;
exports.updateCart = updateCart;
const user_1 = require("../database/models/user");
const checks_1 = require("./checks");
// GET ENDPOINTS
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const errorRes = { status: 400, message: "", payload: { error: {} } };
    const successRes = { status: 200, message: "" };
    try {
        //CHECK WHETHER USER EXISTS
        const isUser = yield (0, checks_1.checkUser)(email);
        if (!isUser.valid)
            return isUser.res;
        const userDoc = isUser.userDoc;
        successRes.status = 200;
        successRes.message = "User details found";
        successRes.payload = {
            email: userDoc.email,
            username: userDoc.username,
            profilePic: userDoc.profilePic,
            wishlist: userDoc.wishlist || undefined,
            cart: userDoc.cart ? userDoc.cart.map((doc) => ({ product: doc.product, quantity: doc.quantity })) : undefined,
            isFirstLogin: userDoc.isFirstLogin,
            phNumber: userDoc.phNumber
        };
        return successRes;
    }
    catch (error) {
        errorRes.status = 400;
        errorRes.message = "Not able to get user";
        errorRes.payload.error = error;
        return errorRes;
    }
});
exports.getUserByEmail = getUserByEmail;
function getCurrentUser(email, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const errorRes = { status: 400, message: "", payload: { error: {} } };
        const successRes = { status: 200, message: "" };
        try {
            const res = yield (0, exports.getUserByEmail)(email);
            if (res.status !== 200) {
                return res;
            }
            successRes.status = 200;
            successRes.message = "User details found";
            successRes.payload = Object.assign(Object.assign({}, res.payload), { token });
            return successRes;
        }
        catch (error) {
            errorRes.status = 400;
            errorRes.message = "Not able to get user";
            errorRes.payload.error = error;
            return errorRes;
        }
    });
}
// POST
function addProductToWishList(productId, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const errorRes = { status: 400, message: "", payload: { error: {} } };
        const successRes = { status: 200, message: "" };
        try {
            const isUser = yield (0, checks_1.checkUser)(email);
            const isProd = yield (0, checks_1.checkProduct)(productId);
            if (!isUser.valid)
                return isUser.res;
            if (!isProd.valid)
                return isProd.res;
            const userWishlist = isUser.userDoc.wishlist.map((prod) => prod.productId);
            const newWishlist = [];
            if (!userWishlist) {
                newWishlist.push(productId);
            }
            else {
                newWishlist.push(...userWishlist, productId);
            }
            const res = yield user_1.userModel.updateOne({ email }, { wishlist: newWishlist });
            if (res.modifiedCount === 1) {
                successRes.status = 200;
                successRes.message = "Added to wishlist";
                return successRes;
            }
            errorRes.status = 400;
            errorRes.message = "Unexpected error occured";
            return errorRes;
        }
        catch (error) {
            errorRes.status = 400;
            errorRes.message = "Not able to update wishlist";
            errorRes.payload.error = error;
            return errorRes;
        }
    });
}
function removeProductFromWishList(productId, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const errorRes = { status: 400, message: "", payload: { error: {} } };
        const successRes = { status: 200, message: "" };
        try {
            const isUser = yield (0, checks_1.checkUser)(email);
            const isProd = yield (0, checks_1.checkProduct)(productId);
            if (!isUser.valid)
                return isUser.res;
            if (!isProd.valid)
                return isProd.res;
            const userWishlist = isUser.userDoc.wishlist.map((prod) => prod.productId);
            const newWishlist = [];
            if (!userWishlist) {
                successRes.status = 200;
                successRes.message = "Nothing in wishlist";
                return successRes;
            }
            else {
                newWishlist.push(...userWishlist.filter((prod) => {
                    return prod.toString() !== productId;
                }));
            }
            const res = yield user_1.userModel.updateOne({ email }, { wishlist: newWishlist });
            if (res.modifiedCount === 1) {
                successRes.status = 200;
                successRes.message = "Removed from wishlist";
                return successRes;
            }
            errorRes.status = 400;
            errorRes.message = "Unexpected error occured";
            return errorRes;
        }
        catch (error) {
            errorRes.status = 400;
            errorRes.message = "Not able to update wishlist";
            errorRes.payload.error = error;
            return errorRes;
        }
    });
}
function updateCart(cart, email) {
    return __awaiter(this, void 0, void 0, function* () {
        const errorRes = { status: 400, message: "", payload: { error: {} } };
        const successRes = { status: 200, message: "" };
        try {
            const isUser = yield (0, checks_1.checkUser)(email);
            if (!isUser.valid)
                return isUser.res;
            const res = yield user_1.userModel.updateOne({ email }, { cart: cart.map((item) => ({ product: item.productId, quantity: item.quantity })) });
            if (res.modifiedCount === 1) {
                successRes.status = 200;
                return successRes;
            }
            errorRes.status = 400;
            errorRes.message = "Unexpected error occured";
            return errorRes;
        }
        catch (error) {
            errorRes.status = 400;
            errorRes.message = "Not able to update wishlist";
            errorRes.payload.error = error;
            return errorRes;
        }
    });
}
