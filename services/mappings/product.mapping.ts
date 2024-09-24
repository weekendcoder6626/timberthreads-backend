import { userModel } from "../../database/models/user";
import { ProductDetailedType, ProductOverviewType } from "../../types/DBTypes/Product.type";
import { Review } from "../../types/DBTypes/Review.type";
import { User } from "../../types/DBTypes/User.type";
import { ProductDetailedWithIDType } from "../../types/ProductWithID.type";
import { checkUser } from "../checks";

export async function detailedProductMapping(productDoc: ProductDetailedWithIDType): Promise<ProductDetailedType | null> {

    const fullReviews: Review[] = [];

    const userDoc = await userModel.findOne({ email: productDoc.sellerEmail });

    if(!userDoc) return null;

    for(const review of productDoc.reviews!) {

        const reviewerDoc = await userModel.findOne({email: review.email});

        if(!reviewerDoc)
            continue;

        fullReviews.push(
            {
                email: review.email!,
                rating: review.rating!,
                review: review.review!,
                username: reviewerDoc.username!,
                profilePic: reviewerDoc.profilePic!,
            }
        )
    }

    return {
        productId: productDoc._id.toString(),
        productName: productDoc.productName!,
        sellerName: userDoc.username!,
        sellerEmail: productDoc.sellerEmail!,
        sellerPic: userDoc.profilePic!,
        shortDesc: productDoc.shortDesc!,
        productDesc: productDoc.productDesc!,
        productFeatures: productDoc.productFeatures!,
        smallImage: productDoc.smallImage!,
        largeImage: productDoc.largeImage!,
        rating: productDoc.rating!,
        reviews: fullReviews,
        price: productDoc.price!,
        discountPercent: productDoc.discountPercent!,
        featured: productDoc.featured!,
    }
}


export async function detailedToOverviewProductMapping(productDoc: ProductDetailedWithIDType): Promise<ProductOverviewType | null> {

    const userDoc = await userModel.findOne({ email: productDoc.sellerEmail });

    if(!userDoc) return null;

    return {
        productId: productDoc._id.toString(),
        productName: productDoc.productName!,
        sellerName: userDoc.username!,
        sellerEmail: productDoc.sellerEmail!,
        shortDesc: productDoc.shortDesc!,
        smallImage: productDoc.smallImage!,
        rating: productDoc.rating!,
        price: productDoc.price!,
        discountPercent: productDoc.discountPercent!,
        featured: productDoc.featured!,
    }
}

