import express from 'express';
import { productModel } from '../database/models/product';
import { testProducts } from './resources/test-products';
import { testUsers } from './resources/test-users';
import { userModel } from '../database/models/user';
import { registerService } from '../services/auth.service';

export const devRouter = express.Router();

// POST ENDPOINTS

devRouter.post('/addProducts', async (req, res) => {

    const prodDocs = testProducts.map((prod) => new productModel(prod));

    prodDocs.forEach(async (doc) => {
        await doc.save();
    });

    res.json("Success");
});

devRouter.post('/addUsers', async (req, res) => {

    // const prodDocs = testUsers.map((user) => new userModel(user));

    testUsers.forEach(async (user) => {
        // await doc.save();
        await registerService(user.username, user.phNumber, user.email, user.password!)
    });

    res.json("Success");
});