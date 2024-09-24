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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../types/response");
exports.authRouter = express_1.default.Router();
// POST ENDPOINTS
//AUTH
exports.authRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, phNumber, email, password, profilePic } = req.body;
    if (username === null || phNumber === null || email === null || password === null) {
        return res.status(response_1.INVALID_INPUT.status).json(response_1.INVALID_INPUT);
    }
    const response = yield (0, auth_service_1.registerService)(username, phNumber, email, password, profilePic);
    return res.status(response.status).json(response);
}));
exports.authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (email === null || password === null) {
        return res.status(response_1.INVALID_INPUT.status).json(response_1.INVALID_INPUT);
    }
    const response = yield (0, auth_service_1.loginService)(email, password);
    return res.status(response.status).json(response);
}));
exports.authRouter.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('access-token');
    const response = yield (0, auth_service_1.logoutService)(token);
    return res.status(response.status).json(response);
}));
