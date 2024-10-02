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
exports.logoutService = exports.loginService = exports.registerService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const session_1 = require("../database/models/session");
const user_1 = require("../database/models/user");
const checks_1 = require("./checks");
const registerService = (username, phNumber, email, password, profilePic) => __awaiter(void 0, void 0, void 0, function* () {
    const errorRes = { status: 400, message: "", payload: { error: {} } };
    const successRes = { status: 200, message: "", payload: {} };
    try {
        //CHECK WHETHER USER EXISTS
        const doc = yield user_1.userModel.findOne({ email }).exec();
        if (!!doc) {
            errorRes.status = 400;
            errorRes.message = "User already exists";
            return errorRes;
        }
        const salt = yield bcryptjs_1.default.genSalt();
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        profilePic = profilePic || "https://via.placeholder.com/500";
        yield (new user_1.userModel({ username, phNumber, email, password: hashedPassword, profilePic, isFirstLogin: 1 })).save();
        successRes.status = 200;
        successRes.message = "Registered successfully";
        return successRes;
    }
    catch (error) {
        errorRes.status = 400;
        errorRes.message = "Registration failed";
        errorRes.payload.error = error;
        return errorRes;
    }
});
exports.registerService = registerService;
const loginService = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const errorRes = { status: 400, message: "", payload: { error: {} } };
    const successRes = { status: 200, message: "" };
    if (!email || !password) {
        errorRes.status = 400;
        errorRes.message = "Invalid input";
        return errorRes;
    }
    try {
        // const user = await userModel.findOne({ email });
        const isUser = yield (0, checks_1.checkUser)(email);
        if (!isUser.valid) {
            errorRes.status = 400;
            errorRes.message = "User not found";
            return errorRes;
        }
        const user = isUser.userDoc;
        if (!user || !user.password) {
            errorRes.status = 400;
            errorRes.message = "User not found";
            return errorRes;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            errorRes.status = 400;
            errorRes.message = "Incorrect credentials";
            return errorRes;
        }
        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
            uuid: user._id,
        };
        const token = jsonwebtoken_1.default.sign(data, jwtSecretKey);
        yield (new session_1.sessionModel({ token, email })).save();
        const payload = Object.assign(Object.assign({}, user), { token });
        successRes.status = 200;
        successRes.message = "Login Succesful";
        successRes.payload = payload;
        if (user.isFirstLogin) {
            yield user_1.userModel.updateOne({ email }, { isFirstLogin: 0 }).exec();
        }
        return successRes;
    }
    catch (error) {
        errorRes.status = 400;
        errorRes.message = "Login failed";
        errorRes.payload.error = error;
        return errorRes;
    }
});
exports.loginService = loginService;
const logoutService = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const errorRes = { status: 400, message: "", payload: { error: {} } };
    const successRes = { status: 200, message: "", payload: {} };
    if (!token) {
        errorRes.status = 400;
        errorRes.message = "Invalid input";
        return errorRes;
    }
    try {
        const deleteResult = yield session_1.sessionModel.deleteOne({ token });
        switch (deleteResult.deletedCount) {
            case 1:
                successRes.status = 200;
                successRes.message = "Logout successful";
                return successRes;
            case 0:
                errorRes.status = 400;
                errorRes.message = "Session doesn't exist";
                return errorRes;
            default:
                errorRes.status = 400;
                errorRes.message = "Session doesn't exist";
                return errorRes;
        }
    }
    catch (error) {
        errorRes.status = 400;
        errorRes.message = "Logout failed";
        errorRes.payload.error = error;
        return errorRes;
    }
});
exports.logoutService = logoutService;
