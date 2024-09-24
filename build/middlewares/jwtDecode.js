"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtDecode = jwtDecode;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function jwtDecode(token) {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    try {
        const verified = jsonwebtoken_1.default.verify(token, jwtSecretKey);
        return verified;
    }
    catch (error) {
        // Access Denied
        return { message: "Some issue occurred", payload: { error } };
    }
}
