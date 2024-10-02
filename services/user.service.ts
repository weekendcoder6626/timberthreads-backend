import { userModel } from "../database/models/user";
import { CurrentUser, User } from "../types/DBTypes/User.type";
import { ErrorResponse, SuccessResponse } from "../types/response";
import { detailedToOverviewProductMapping } from "./mappings/product.mapping";
import { checkProduct, checkUser } from "./checks";

// GET ENDPOINTS

export const getUserByEmail = async (email: string) => {

    const errorRes: ErrorResponse = { status: 400, message: "", payload: { error: {} } }
    const successRes: SuccessResponse<User> = { status: 200, message: "" }

    try {

        //CHECK WHETHER USER EXISTS
        const isUser = await checkUser(email)

        if (!isUser.valid)
            return isUser.res!;

        const userDoc = isUser.userDoc!;

        successRes.status = 200;
        successRes.message = "User details found";
        successRes.payload = {
            email: userDoc.email!,
            username: userDoc.username!,
            profilePic: userDoc.profilePic!,
            wishlist:  userDoc.wishlist || undefined,
            cart: userDoc.cart ? userDoc.cart.map((doc) => ({ product: doc.product, quantity: doc.quantity })) : undefined,
            isFirstLogin: userDoc.isFirstLogin,
            phNumber: userDoc.phNumber!
        }

        return successRes;

    }
    catch (error: any) {
        errorRes.status = 400;
        errorRes.message = "Not able to get user"
        errorRes.payload.error = error;
        return errorRes;
    }
};


export async function getCurrentUser(email: string, token: string) {

    const errorRes: ErrorResponse = { status: 400, message: "", payload: { error: {} } }
    const successRes: SuccessResponse<CurrentUser> = { status: 200, message: "" }

    try {

        const res = await getUserByEmail(email);

        if (res.status !== 200) {
            return (res as ErrorResponse);
        }

        successRes.status = 200;
        successRes.message = "User details found";
        successRes.payload = {
            ...(res.payload as User),
            token
        }

        return successRes;

    } catch (error: any) {
        errorRes.status = 400;
        errorRes.message = "Not able to get user"
        errorRes.payload.error = error;
        return errorRes;
    }
}

// POST

export async function addProductToWishList(productId: string, email: string) {

    const errorRes: ErrorResponse = { status: 400, message: "", payload: { error: {} } }
    const successRes: SuccessResponse = { status: 200, message: "" }

    try {

        const isUser = await checkUser(email);
        const isProd = await checkProduct(productId);

        if (!isUser.valid)
            return isUser.res!;

        if (!isProd.valid)
            return isProd.res!;

        const userWishlist = isUser.userDoc!.wishlist!.map((prod) => prod.productId);
        const newWishlist: string[] = [];

        if (!userWishlist) {

            newWishlist.push(productId);

        } else {

            newWishlist.push(...userWishlist, productId)
        }

        const res = await userModel.updateOne({ email }, { wishlist: newWishlist });

        if (res.modifiedCount === 1) {

            successRes.status = 200;

            successRes.message = "Added to wishlist";

            return successRes;

        }

        errorRes.status = 400;
        errorRes.message = "Unexpected error occured"
        return errorRes;

    } catch (error: any) {

        errorRes.status = 400;
        errorRes.message = "Not able to update wishlist"
        errorRes.payload.error = error;
        return errorRes;
    }


}

export async function removeProductFromWishList(productId: string, email: string) {

    const errorRes: ErrorResponse = { status: 400, message: "", payload: { error: {} } }
    const successRes: SuccessResponse = { status: 200, message: "" }

    try {

        const isUser = await checkUser(email);
        const isProd = await checkProduct(productId);

        if (!isUser.valid)
            return isUser.res!;

        if (!isProd.valid)
            return isProd.res!;

        const userWishlist = isUser.userDoc!.wishlist!.map((prod) => prod.productId);
        const newWishlist: string[] = [];

        if (!userWishlist) {

            successRes.status = 200;
            successRes.message = "Nothing in wishlist"
            return successRes;

        } else {

            newWishlist.push(...userWishlist.filter((prod) => {

                return prod.toString() !== productId

            }))

        }

        const res = await userModel.updateOne({ email }, { wishlist: newWishlist });

        if (res.modifiedCount === 1) {

            successRes.status = 200;

            successRes.message = "Removed from wishlist";

            return successRes;

        }

        errorRes.status = 400;
        errorRes.message = "Unexpected error occured";
        return errorRes;

    } catch (error: any) {

        errorRes.status = 400;
        errorRes.message = "Not able to update wishlist";
        errorRes.payload.error = error;
        return errorRes;
    }

}


export async function updateCart(cart: {productId: string, quantity: number}[], email: string) {

    const errorRes: ErrorResponse = { status: 400, message: "", payload: { error: {} } }
    const successRes: SuccessResponse = { status: 200, message: "" }

    try {

        const isUser = await checkUser(email);

        if (!isUser.valid)
            return isUser.res!;

        const res = await userModel.updateOne({ email }, { cart: cart.map((item) => ({ product: item.productId, quantity: item.quantity })) });

        if (res.modifiedCount === 1) {

            successRes.status = 200;

            return successRes;

        }

        errorRes.status = 400;
        errorRes.message = "Unexpected error occured";
        return errorRes;

    } catch (error: any) {

        errorRes.status = 400;
        errorRes.message = "Not able to update wishlist";
        errorRes.payload.error = error;
        return errorRes;
    }

}