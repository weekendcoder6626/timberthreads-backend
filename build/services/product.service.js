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
exports.removeProductReview = exports.addProductReview = exports.getProductReviews = exports.getProductDetailed = exports.getAllProductsOverview = void 0;
const product_1 = require("../database/models/product");
const user_1 = require("../database/models/user");
const checks_1 = require("./checks");
const product_mapping_1 = require("./mappings/product.mapping");
// GET ENDPOINTS
const getAllProductsOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    const errorRes = { status: 400, message: "", payload: { error: {} } };
    const successRes = { status: 200, message: "" };
    try {
        const productDocs = yield product_1.productModel.find({});
        if (!productDocs) {
            errorRes.status = 400;
            errorRes.message = "No products";
            return errorRes;
        }
        successRes.payload = [];
        for (const doc of productDocs) {
            const sellerUser = yield user_1.userModel.findOne({ email: doc.sellerEmail });
            if (!sellerUser) {
                continue;
            }
            const povw = (yield (0, product_mapping_1.detailedToOverviewProductMapping)(doc.toObject()));
            successRes.payload.push(povw);
        }
        successRes.status = 200;
        successRes.message = "Products fetched";
        return successRes;
    }
    catch (error) {
        errorRes.status = 400;
        errorRes.message = "Not able to get products.";
        errorRes.payload.error = error;
        return errorRes;
    }
});
exports.getAllProductsOverview = getAllProductsOverview;
const getProductDetailed = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const errorRes = { status: 400, message: "", payload: { error: {} } };
    const successRes = { status: 200, message: "" };
    try {
        const isProd = yield (0, checks_1.checkProduct)(productId);
        if (!isProd.valid)
            return isProd.res;
        const productDoc = isProd.productDoc;
        const sellerUser = isProd.sellerUser;
        successRes.status = 200;
        successRes.message = "Product fetched";
        successRes.payload = (yield (0, product_mapping_1.detailedProductMapping)(productDoc.toObject()));
        return successRes;
    }
    catch (error) {
        errorRes.status = 400;
        errorRes.message = "Not able to get product.";
        errorRes.payload.error = error;
        return errorRes;
    }
});
exports.getProductDetailed = getProductDetailed;
const getProductReviews = (productId) => __awaiter(void 0, void 0, void 0, function* () {
    const errorRes = { status: 400, message: "", payload: { error: {} } };
    const successRes = { status: 200, message: "" };
    try {
        const isProd = yield (0, checks_1.checkProduct)(productId);
        if (!isProd.valid)
            return isProd.res;
        const productDoc = isProd.productDoc;
        const sellerUser = isProd.sellerUser;
        successRes.status = 200;
        // successRes.message = "Reviews fetched";
        successRes.payload = (yield (0, product_mapping_1.detailedProductMapping)(productDoc.toObject())).reviews;
        return successRes;
    }
    catch (error) {
        errorRes.status = 400;
        errorRes.message = "Not able to fetch reviews.";
        errorRes.payload.error = error;
        return errorRes;
    }
});
exports.getProductReviews = getProductReviews;
// POST ENDPOINTS
const addProductReview = (email, rating, productId, review) => __awaiter(void 0, void 0, void 0, function* () {
    const errorRes = { status: 400, message: "", payload: { error: {} } };
    const successRes = { status: 200, message: "" };
    try {
        const isProd = yield (0, checks_1.checkProduct)(productId);
        if (!isProd.valid)
            return isProd.res;
        const productDoc = isProd.productDoc;
        const isUser = yield (0, checks_1.checkUser)(email);
        if (!isUser.valid)
            return isUser.res;
        if (productDoc.reviews.findIndex((rev) => rev.email === email) !== -1) {
            errorRes.status = 400;
            errorRes.message = "You have already added a review for this product!\nYou need to delete the previous review to be able to post again.";
        }
        const reviewOb = {
            email,
            rating,
            review
        };
        const newReviews = [...productDoc.reviews, reviewOb];
        let newRating = 0;
        newReviews.forEach((rev) => {
            newRating += rev.rating || 0;
        });
        newRating = newRating / newReviews.length;
        const res = yield product_1.productModel.updateOne({ _id: productId }, { reviews: newReviews, rating: newRating });
        if (res.modifiedCount === 1) {
            successRes.status = 200;
            successRes.message = "Added review";
            const reviews = yield (0, exports.getProductReviews)(productId);
            if (!!reviews.payload && Object.keys(reviews.payload).findIndex((v) => v === "error") !== -1)
                return reviews;
            successRes.payload = {
                reviews: reviews.payload,
                rating: newRating
            };
            return successRes;
        }
        errorRes.status = 400;
        errorRes.message = "Not able to add review.";
        return errorRes;
    }
    catch (error) {
        errorRes.status = 400;
        errorRes.message = "Not able to add review.";
        errorRes.payload.error = error;
        return errorRes;
    }
});
exports.addProductReview = addProductReview;
const removeProductReview = (email, productId) => __awaiter(void 0, void 0, void 0, function* () {
    const errorRes = { status: 400, message: "", payload: { error: {} } };
    const successRes = { status: 200, message: "" };
    try {
        const isProd = yield (0, checks_1.checkProduct)(productId);
        if (!isProd.valid)
            return isProd.res;
        const productDoc = isProd.productDoc;
        const isUser = yield (0, checks_1.checkUser)(email);
        if (!isUser.valid)
            return isUser.res;
        const newReviews = [...productDoc.reviews];
        newReviews.splice(productDoc.reviews.findIndex((rev) => rev.email === email), 1);
        let newRating = 0;
        newReviews.forEach((rev) => {
            newRating += rev.rating || 0;
        });
        newRating = !!newReviews && newReviews.length > 0 ? newRating / newReviews.length : 0;
        const res = yield product_1.productModel.updateOne({ _id: productId }, { reviews: newReviews, rating: newRating });
        if (res.modifiedCount === 1) {
            successRes.status = 200;
            successRes.message = "Removed review";
            const reviews = yield (0, exports.getProductReviews)(productId);
            if (!!reviews.payload && Object.keys(reviews.payload).findIndex((v) => v === "error") !== -1)
                return reviews;
            successRes.payload = {
                reviews: reviews.payload,
                rating: newRating
            };
            return successRes;
        }
        errorRes.status = 400;
        errorRes.message = "Not able to remove review.";
        return errorRes;
    }
    catch (error) {
        errorRes.status = 400;
        errorRes.message = "Not able to remove review.";
        errorRes.payload.error = error;
        return errorRes;
    }
});
exports.removeProductReview = removeProductReview;
