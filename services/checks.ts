import { productModel } from "../database/models/product";
import { userModel } from "../database/models/user";
import { Cart } from "../types/DBTypes/Cart.type";
import { ProductOverviewType } from "../types/DBTypes/Product.type";
import { ProductDetailedWithIDType } from "../types/ProductWithID.type";
import { ErrorResponse } from "../types/response";
import { detailedToOverviewProductMapping } from "./mappings/product.mapping";

export const checkUser = async (email: string) => {

    const errorRes: ErrorResponse = { status: 400, message: "", payload: { error: {} } }

    const userDoc = await userModel.findOne({ email })
        .populate<{ wishlist: ProductDetailedWithIDType[] }>('wishlist')
        .exec();

    if (!userDoc) {

        errorRes.status = 400;
        errorRes.message = "User does not exist"
        return {
            valid: false,
            res: errorRes
        };

    }

    const fullCart: Cart = [];
    const fullWishlist: ProductOverviewType[] = [];

    for (const prod of userDoc.wishlist) {

        const povw = await detailedToOverviewProductMapping(prod);

        fullWishlist.push(
            povw!
        )

    }

    for(const item of userDoc.cart) {

        const productId = item.product;

        if (!productId) continue;

        const productDoc = await productModel.findOne({_id: productId });

        if (!productDoc) continue;

        const povw = await detailedToOverviewProductMapping(productDoc.toObject())

        fullCart.push(
            {
                product: povw!,
                quantity: item.quantity!
            }
        )

    }

    return {
        valid: true,
        userDoc: { ...userDoc?.toObject(), cart: fullCart, wishlist: fullWishlist }
    }

}

export const checkProduct = async (productId: string) => {

    const errorRes: ErrorResponse = { status: 400, message: "", payload: { error: {} } }

    try {
        const productDoc = await productModel.findOne({ _id: productId });

        if (!productDoc) {

            errorRes.status = 400;
            errorRes.message = "Product doesn't exist"
            return {
                valid: false,
                res: errorRes
            };
        }

        const sellerUser = await userModel.findOne({email: productDoc.sellerEmail});

        if (!sellerUser) {

            errorRes.status = 400;
            errorRes.message = "Seller doesn't exist"
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
    catch (error: any) {
        errorRes.status = 400;
        errorRes.message = "Some error occurred."
        errorRes.payload.error = error;
        return {
            valid: false,
            res: errorRes
        };
    }

}