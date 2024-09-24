import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {sessionModel} from '../database/models/session';
import {userModel} from '../database/models/user';
import { ErrorResponse, SuccessResponse } from '../types/response';
import { CurrentUser } from '../types/DBTypes/User.type';

export const registerService = async (username: string, phNumber: string, email: string, password: string, profilePic?: string) => {

    const errorRes: ErrorResponse = { status: 400, message: "", payload: {error: {}} }
    const successRes: SuccessResponse = { status: 200, message: "", payload: {} }

    try {

        //CHECK WHETHER USER EXISTS
        const doc = await userModel.findOne({ email }).exec();

        if (!!doc) {

            errorRes.status = 400;
            errorRes.message = "User already exists"
            return errorRes;
        }

        const salt = await bcrypt.genSalt();

        const hashedPassword = await bcrypt.hash(password, salt);

        profilePic = profilePic || "https://via.placeholder.com/500";

        await (new userModel({ username, phNumber, email, password: hashedPassword, profilePic, isFirstLogin: 1 })).save();

        successRes.status = 200;
        successRes.message = "Registered successfully"
        return successRes;

    }
    catch (error: any) {
        errorRes.status = 400;
        errorRes.message = "Registration failed"
        errorRes.payload.error = error;
        return errorRes;
    }
};

export const loginService = async (email: string, password: string) => {

    const errorRes: ErrorResponse = { status: 400, message: "", payload: {error: {}} }
    const successRes: SuccessResponse<CurrentUser> = { status: 200, message: "" }

    if (!email || !password) {

        errorRes.status = 400
        errorRes.message = "Invalid input"
        return errorRes;
    }

    try {

        const user = await userModel.findOne({ email });

        if (!user || !user.password) {

            errorRes.status = 400;
            errorRes.message = "User not found";
            return errorRes;
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            errorRes.status = 400;
            errorRes.message = "Incorrect credentials"
            return errorRes;
        }

        let jwtSecretKey = (process.env.JWT_SECRET_KEY as string);

        let data = {
            uuid: user._id,
        }

        const token = jwt.sign(data, jwtSecretKey);

        await (new sessionModel({ token, email })).save();

        const payload = { ...user.toObject(), token } as CurrentUser

        successRes.status = 200
        successRes.message = "Login Succesful"
        successRes.payload = payload

        if (user.isFirstLogin === 1) {

            await userModel.updateOne({email}, {isFirstLogin: 0}).exec();
        }

        return successRes;

    } catch (error: any) {

        errorRes.status = 400;
        errorRes.message = "Login failed"
        errorRes.payload.error = error;
        return errorRes;
    }
}

export const logoutService = async (token: string) => {

    const errorRes: ErrorResponse = { status: 400, message: "", payload: {error: {}} }
    const successRes: SuccessResponse = { status: 200, message: "", payload: {} }

    if (!token) {

        errorRes.status = 400
        errorRes.message = "Invalid input"
        return errorRes;
    }

    try {

        const deleteResult = await sessionModel.deleteOne({ token });

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

    } catch (error: any) {

        errorRes.status = 400;
        errorRes.message = "Logout failed"
        errorRes.payload.error = error;
        return errorRes;
    }
}