"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const session_1 = require("../database/models/session");
const user_1 = require("../database/models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function tokenAuth(req, res, next) {
    const errorRes = { status: 400, message: "", payload: { error: {} } };
    if (req.header("ignore-token") || req.url === "/") {
        next();
        return;
    }
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    try {
        const token = req.header('access-token');
        let verified = jsonwebtoken_1.default.verify(token, jwtSecretKey);
        verified = verified;
        if (verified) {
            //authenticate token
            session_1.sessionModel.findOne({ token }).then((session) => {
                if (!!session) {
                    const uuid = verified.uuid;
                    // get email from user
                    user_1.userModel.findOne({ _id: uuid }).then((user) => {
                        if (!user) {
                            errorRes.status = 400;
                            errorRes.message = "User doesn't exist";
                            return res.status(errorRes.status).json(errorRes);
                        }
                        const email = user.email;
                        req.body.email = email;
                        next();
                        return;
                    }).catch(() => {
                        errorRes.status = 400;
                        errorRes.message = "User doesn't exist";
                        return res.status(errorRes.status).json(errorRes);
                    });
                }
                else {
                    // const errorRes = getErrorResponse(ERROR_TYPES.INVALID_TOKEN);
                    errorRes.status = 400;
                    errorRes.message = "Please login with a valid account";
                    return res.status(errorRes.status).json(errorRes);
                }
            }).catch((error) => {
                // const errorRes = getErrorResponse(ERROR_TYPES.INVALID_TOKEN, {error});
                errorRes.status = 400;
                errorRes.message = "Please login with a valid account";
                return res.status(errorRes.status).json(errorRes);
            });
        }
        else {
            // Access Denied
            // const errorRes = getErrorResponse(ERROR_TYPES.INVALID_TOKEN, {error});
            errorRes.status = 400;
            errorRes.message = "Please login with a valid account";
            return res.status(errorRes.status).json(errorRes);
        }
    }
    catch (error) {
        // Access Denied
        // const errorRes = getErrorResponse(ERROR_TYPES.INVALID_TOKEN, {error});
        errorRes.status = 400;
        errorRes.message = "Please login with a valid account";
        return res.status(errorRes.status).json(errorRes);
    }
}
exports.default = tokenAuth;
