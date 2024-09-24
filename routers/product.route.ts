import express from 'express';
import { getProductDetailed, getAllProductsOverview, addProductReview, removeProductReview, getProductReviews } from '../services/product.service';
import { INVALID_INPUT } from '../types/response';

export const productRouter = express.Router();

// POST ENDPOINTS

productRouter.post('/addReview', async (req, res) => {

    const { email, rating, review, productId } = req.body;

    if(!email || !rating || !productId)
        return res.status(INVALID_INPUT.status).json(INVALID_INPUT);

    const response = await addProductReview(email, rating, productId, review);

    return res.status(response.status).json(response);
});

productRouter.post('/removeReview', async (req, res) => {

    const { email, productId } = req.body;

    if(!email || !productId)
        return res.status(INVALID_INPUT.status).json(INVALID_INPUT);

    const response = await removeProductReview(email, productId);

    return res.status(response.status).json(response);
});

// GET ENDPOINTS

productRouter.get('/:productId/reviews', async (req, res) => {

    const { productId } = req.params;

    const response = await getProductReviews(productId);
    
    return res.status(response.status).json(response);

})

productRouter.get('/:productId', async (req, res) => {

    const { productId } = req.params;

    const response = await getProductDetailed(productId);

    return res.status(response.status).json(response);

})

productRouter.get('/', async (_, res) => {

    const response = await getAllProductsOverview();

    return res.status(response.status).json(response);
});