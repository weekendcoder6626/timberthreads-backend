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
exports.devRouter = void 0;
const express_1 = __importDefault(require("express"));
const product_1 = require("../database/models/product");
const test_products_1 = require("./resources/test-products");
const test_users_1 = require("./resources/test-users");
const auth_service_1 = require("../services/auth.service");
exports.devRouter = express_1.default.Router();
// POST ENDPOINTS
exports.devRouter.post('/addProducts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prodDocs = test_products_1.testProducts.map((prod) => new product_1.productModel(prod));
    prodDocs.forEach((doc) => __awaiter(void 0, void 0, void 0, function* () {
        yield doc.save();
    }));
    res.json("Success");
}));
exports.devRouter.post('/addUsers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const prodDocs = testUsers.map((user) => new userModel(user));
    test_users_1.testUsers.forEach((user) => __awaiter(void 0, void 0, void 0, function* () {
        // await doc.save();
        yield (0, auth_service_1.registerService)(user.username, user.phNumber, user.email, user.password);
    }));
    res.json("Success");
}));
