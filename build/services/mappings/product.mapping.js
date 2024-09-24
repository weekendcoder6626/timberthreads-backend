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
exports.detailedProductMapping = detailedProductMapping;
exports.detailedToOverviewProductMapping = detailedToOverviewProductMapping;
const user_1 = require("../../database/models/user");
function detailedProductMapping(productDoc) {
    return __awaiter(this, void 0, void 0, function* () {
        const fullReviews = [];
        const userDoc = yield user_1.userModel.findOne({ email: productDoc.sellerEmail });
        if (!userDoc)
            return null;
        for (const review of productDoc.reviews) {
            const reviewerDoc = yield user_1.userModel.findOne({ email: review.email });
            if (!reviewerDoc)
                continue;
            fullReviews.push({
                email: review.email,
                rating: review.rating,
                review: review.review,
                username: reviewerDoc.username,
                profilePic: reviewerDoc.profilePic,
            });
        }
        return {
            productId: productDoc._id.toString(),
            productName: productDoc.productName,
            sellerName: userDoc.username,
            sellerEmail: productDoc.sellerEmail,
            sellerPic: userDoc.profilePic,
            shortDesc: productDoc.shortDesc,
            productDesc: productDoc.productDesc,
            productFeatures: productDoc.productFeatures,
            smallImage: productDoc.smallImage,
            largeImage: productDoc.largeImage,
            rating: productDoc.rating,
            reviews: fullReviews,
            price: productDoc.price,
            discountPercent: productDoc.discountPercent,
            featured: productDoc.featured,
        };
    });
}
function detailedToOverviewProductMapping(productDoc) {
    return __awaiter(this, void 0, void 0, function* () {
        const userDoc = yield user_1.userModel.findOne({ email: productDoc.sellerEmail });
        if (!userDoc)
            return null;
        return {
            productId: productDoc._id.toString(),
            productName: productDoc.productName,
            sellerName: userDoc.username,
            sellerEmail: productDoc.sellerEmail,
            shortDesc: productDoc.shortDesc,
            smallImage: productDoc.smallImage,
            rating: productDoc.rating,
            price: productDoc.price,
            discountPercent: productDoc.discountPercent,
            featured: productDoc.featured,
        };
    });
}
