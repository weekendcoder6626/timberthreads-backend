import express from 'express';
import { addProductToWishList, getCurrentUser, getUserByEmail, removeProductFromWishList, updateCart } from '../services/user.service';
import { INVALID_INPUT } from '../types/response';
import { Cart } from '../types/DBTypes/Cart.type';

export const userRouter = express.Router();

// GET ENDPOINTS

userRouter.get('/:email', async (req, res) => {

    const { email } = req.params;

    if (email === null) {

        return res.status(INVALID_INPUT.status).json(INVALID_INPUT)
        
    }

    const response = await getUserByEmail(email);

    return res.status(response.status).json(response);
});

userRouter.get('/', async (req, res) => {

    const { email } = req.body;
    const token = req.header('access-token');

    if (!email || !token) {

        return res.status(INVALID_INPUT.status).json(INVALID_INPUT)
    }

    const response = await getCurrentUser(email, (token as string));

    return res.status(response.status).json(response);
});

// POST ENDPOINTS
userRouter.post('/addWishlist', async (req, res) => {

    const { email, productId } = req.body;

    if (!email || !productId) {

        return res.status(INVALID_INPUT.status).json(INVALID_INPUT)

    }

    const response = await addProductToWishList(productId, email);

    return res.status(response.status).json(response);
});

userRouter.post('/removeWishlist', async (req, res) => {

    const { email, productId } = req.body;

    if (!email || !productId) {

        return res.status(INVALID_INPUT.status).json(INVALID_INPUT)

    }

    const response = await removeProductFromWishList(productId, email);

    return res.status(response.status).json(response);
});

userRouter.post('/updateCart', async (req, res) => {

    const { email, cart } = req.body;

    if (!email || !cart) {

        return res.status(INVALID_INPUT.status).json(INVALID_INPUT)

    }

    const response = await updateCart(cart, email);

    return res.status(response.status).json(response);
});