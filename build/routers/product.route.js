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
exports.productRouter = void 0;
const express_1 = __importDefault(require("express"));
const product_service_1 = require("../services/product.service");
const response_1 = require("../types/response");
exports.productRouter = express_1.default.Router();
// POST ENDPOINTS
exports.productRouter.post('/addReview', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, rating, review, productId } = req.body;
    if (!email || !rating || !productId)
        return res.status(response_1.INVALID_INPUT.status).json(response_1.INVALID_INPUT);
    const response = yield (0, product_service_1.addProductReview)(email, rating, productId, review);
    return res.status(response.status).json(response);
}));
exports.productRouter.post('/removeReview', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, productId } = req.body;
    if (!email || !productId)
        return res.status(response_1.INVALID_INPUT.status).json(response_1.INVALID_INPUT);
    const response = yield (0, product_service_1.removeProductReview)(email, productId);
    return res.status(response.status).json(response);
}));
// GET ENDPOINTS
exports.productRouter.get('/:productId/reviews', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const response = yield (0, product_service_1.getProductReviews)(productId);
    return res.status(response.status).json(response);
}));
exports.productRouter.get('/:productId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    const response = yield (0, product_service_1.getProductDetailed)(productId);
    return res.status(response.status).json(response);
}));
exports.productRouter.get('/', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield (0, product_service_1.getAllProductsOverview)();
    return res.status(response.status).json(response);
}));
