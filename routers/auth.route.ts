import express from 'express';
import { loginService, logoutService, registerService } from '../services/auth.service';
import { INVALID_INPUT } from '../types/response';

export const authRouter = express.Router();

// POST ENDPOINTS

//AUTH

authRouter.post('/register', async (req, res) => {

    const { username, phNumber, email, password, profilePic } = req.body;

    if (username === null || phNumber === null || email === null || password === null) {

        return res.status(INVALID_INPUT.status).json(INVALID_INPUT)

    }

    const response = await registerService(username, phNumber, email, password, profilePic);

    return res.status(response.status).json(response);
});

authRouter.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (email === null || password === null) {

        return res.status(INVALID_INPUT.status).json(INVALID_INPUT)

    }

    const response = await loginService(email, password);

    return res.status(response.status).json(response);
});

authRouter.post('/logout', async (req, res) => {

    const token: any = req.header('access-token');

    const response = await logoutService(token);

    return res.status(response.status).json(response);                                                                

});