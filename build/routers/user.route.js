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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const user_service_1 = require("../services/user.service");
const response_1 = require("../types/response");
exports.userRouter = express_1.default.Router();
// GET ENDPOINTS
exports.userRouter.get('/:email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    if (email === null) {
        return res.status(response_1.INVALID_INPUT.status).json(response_1.INVALID_INPUT);
    }
    const response = yield (0, user_service_1.getUserByEmail)(email);
    return res.status(response.status).json(response);
}));
exports.userRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const token = req.header('access-token');
    if (!email || !token) {
        return res.status(response_1.INVALID_INPUT.status).json(response_1.INVALID_INPUT);
    }
    const response = yield (0, user_service_1.getCurrentUser)(email, token);
    return res.status(response.status).json(response);
}));
// POST ENDPOINTS
exports.userRouter.post('/addWishlist', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, productId } = req.body;
    if (!email || !productId) {
        return res.status(response_1.INVALID_INPUT.status).json(response_1.INVALID_INPUT);
    }
    const response = yield (0, user_service_1.addProductToWishList)(productId, email);
    return res.status(response.status).json(response);
}));
exports.userRouter.post('/removeWishlist', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, productId } = req.body;
    if (!email || !productId) {
        return res.status(response_1.INVALID_INPUT.status).json(response_1.INVALID_INPUT);
    }
    const response = yield (0, user_service_1.removeProductFromWishList)(productId, email);
    return res.status(response.status).json(response);
}));
exports.userRouter.post('/updateCart', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, cart } = req.body;
    if (!email || !cart) {
        return res.status(response_1.INVALID_INPUT.status).json(response_1.INVALID_INPUT);
    }
    const response = yield (0, user_service_1.updateCart)(cart, email);
    return res.status(response.status).json(response);
}));
