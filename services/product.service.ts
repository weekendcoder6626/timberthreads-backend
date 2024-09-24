import { productModel } from "../database/models/product";
import { userModel } from "../database/models/user";
import { ProductDetailedType, ProductOverviewType } from "../types/DBTypes/Product.type";
import { Review } from "../types/DBTypes/Review.type";
import { ErrorResponse, SuccessResponse } from "../types/response";
import { checkProduct, checkUser } from "./checks";
import { detailedProductMapping, detailedToOverviewProductMapping } from "./mappings/product.mapping";

// GET ENDPOINTS

export const getAllProductsOverview = async () => {

    const errorRes: ErrorResponse = { status: 400, message: "", payload: { error: {} } }
    const successRes: SuccessResponse<ProductOverviewType[]> = { status: 200, message: "" }

    try {

        const productDocs = await productModel.find({});

        if (!productDocs) {

            errorRes.status = 400;
            errorRes.message = "No products"
            return errorRes;
        }

        successRes.payload = [];

        for (const doc of productDocs) {

            const sellerUser = await userModel.findOne({ email: doc.sellerEmail });

            if (!sellerUser) {

                continue;

            }

            const povw = (await detailedToOverviewProductMapping(doc.toObject()));

            successRes.payload.push(povw!);

        }

        successRes.status = 200;
        successRes.message = "Products fetched";

        return successRes;

    }
    catch (error: any) {
        errorRes.status = 400;
        errorRes.message = "Not able to get products."
        errorRes.payload.error = error;
        return errorRes;
    }
};

export const getProductDetailed = async (productId: string) => {

    const errorRes: ErrorResponse = { status: 400, message: "", payload: { error: {} } }
    const successRes: SuccessResponse<ProductDetailedType> = { status: 200, message: "" }

    try {

        const isProd = await checkProduct(productId);

        if(!isProd.valid) 
            return isProd.res!;

        const productDoc = isProd.productDoc!;
        const sellerUser = isProd.sellerUser!;

        successRes.status = 200;
        successRes.message = "Product fetched";
        successRes.payload = (await detailedProductMapping(productDoc.toObject()))!;

        return successRes;

    }
    catch (error: any) {
        errorRes.status = 400;
        errorRes.message = "Not able to get product."
        errorRes.payload.error = error;
        return errorRes;
    }
};

export const getProductReviews = async (productId: string) => {

    const errorRes: ErrorResponse = { status: 400, message: "", payload: { error: {} } }
    const successRes: SuccessResponse<Review[]> = { status: 200, message: "" }

    try {

        const isProd = await checkProduct(productId);

        if(!isProd.valid) 
            return isProd.res!;

        const productDoc = isProd.productDoc!;
        const sellerUser = isProd.sellerUser!;

        successRes.status = 200;
        // successRes.message = "Reviews fetched";
        successRes.payload = (await detailedProductMapping(productDoc.toObject()))!.reviews;

        return successRes;

    }
    catch (error: any) {
        errorRes.status = 400;
        errorRes.message = "Not able to fetch reviews."
        errorRes.payload.error = error;
        return errorRes;
    }
};

// POST ENDPOINTS

export const addProductReview = async (email: string, rating: number, productId: string, review?: string) => {

    const errorRes: ErrorResponse = { status: 400, message: "", payload: { error: {} } }
    const successRes: SuccessResponse<{
        reviews: Review[],
        rating: number
    }> = { status: 200, message: "" }

    try {

        const isProd = await checkProduct(productId);

        if(!isProd.valid) 
            return isProd.res!;

        const productDoc = isProd.productDoc!;

        const isUser = await checkUser(email);

        if(!isUser.valid)
            return isUser.res!;

        if(productDoc.reviews.findIndex((rev) => rev.email === email) !== -1) {

            errorRes.status = 400;
            errorRes.message = "You have already added a review for this product!\nYou need to delete the previous review to be able to post again."

        }

        const reviewOb: Review = {
            email,
            rating,
            review
        }

        const newReviews = [...productDoc.reviews, reviewOb] as Review[];

        let newRating = 0;
        
        newReviews.forEach((rev) => {

            newRating += rev.rating || 0;

        });

        newRating = newRating / newReviews.length;

        const res = await productModel.updateOne({ _id: productId }, { reviews: newReviews, rating: newRating });

        if (res.modifiedCount === 1) {

            successRes.status = 200;

            successRes.message = "Added review";

            const reviews = await getProductReviews(productId);

            if(!!reviews.payload && Object.keys(reviews.payload).findIndex((v) => v === "error") !== -1)
                return reviews as ErrorResponse;

            successRes.payload = {
                reviews: reviews.payload as Review[],
                rating: newRating
            };

            return successRes;

        }

        errorRes.status = 400;
        errorRes.message = "Not able to add review."
        return errorRes;

    }
    catch (error: any) {
        errorRes.status = 400;
        errorRes.message = "Not able to add review."
        errorRes.payload.error = error;
        return errorRes;
    }

}

export const removeProductReview = async (email: string, productId: string) => {

    const errorRes: ErrorResponse = { status: 400, message: "", payload: { error: {} } }
    const successRes: SuccessResponse<{
        reviews: Review[],
        rating: number
    }> = { status: 200, message: "" }

    try {

        const isProd = await checkProduct(productId);

        if(!isProd.valid) 
            return isProd.res!;

        const productDoc = isProd.productDoc!;

        const isUser = await checkUser(email);

        if(!isUser.valid)
            return isUser.res!;

        
        const newReviews = [...productDoc.reviews] as Review[];

        newReviews.splice(productDoc.reviews.findIndex((rev) => rev.email === email), 1)

        let newRating = 0;
        
        newReviews.forEach((rev) => {

            newRating += rev.rating || 0;

        });

        newRating = !!newReviews && newReviews.length > 0 ? newRating / newReviews.length : 0;

        const res = await productModel.updateOne({ _id: productId }, { reviews: newReviews, rating: newRating });

        if (res.modifiedCount === 1) {

            successRes.status = 200;

            successRes.message = "Removed review";

            const reviews = await getProductReviews(productId);

            if(!!reviews.payload && Object.keys(reviews.payload).findIndex((v) => v === "error") !== -1)
                return reviews as ErrorResponse;

            successRes.payload = {
                reviews: reviews.payload as Review[],
                rating: newRating
            };

            return successRes;

        }

        errorRes.status = 400;
        errorRes.message = "Not able to remove review."
        return errorRes;

    }
    catch (error: any) {
        errorRes.status = 400;
        errorRes.message = "Not able to remove review."
        errorRes.payload.error = error;
        return errorRes;
    }

}