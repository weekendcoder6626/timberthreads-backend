import {sessionModel} from '../database/models/session'
import {userModel} from '../database/models/user'
import jwt from 'jsonwebtoken';
import { ErrorResponse } from '../types/response.js';

function tokenAuth(req: any, res: any, next: any) {

    const errorRes: ErrorResponse = { status: 400, message: "", payload: {error: {}} }

    if(req.header("ignore-token") || req.url === "/") {

        next();
        return;
    }

    let jwtSecretKey = (process.env.JWT_SECRET_KEY as string);

    try {
        const token = req.header('access-token');

        
        let verified= jwt.verify(token, jwtSecretKey);
        verified = verified as jwt.JwtPayload

        if (verified) {
            //authenticate token
            sessionModel.findOne({ token }).then((session) => {


                if (!!session) {

                    const uuid = verified.uuid;


                    // get email from user
                    userModel.findOne({ _id: uuid }).then((user) => {

                        if(!user) {

                            errorRes.status = 400;
                            errorRes.message = "User doesn't exist"
                            return res.status(errorRes.status).json(errorRes);
                        }

                        const email = user.email;
                        req.body.email = email;

                        next();
                        return;
                    }).catch(() => {

                        errorRes.status = 400;
                        errorRes.message = "User doesn't exist"
                        return res.status(errorRes.status).json(errorRes);
                    });

                } else {

                    // const errorRes = getErrorResponse(ERROR_TYPES.INVALID_TOKEN);
                    errorRes.status = 400;
                    errorRes.message = "Please login with a valid account"
                    return res.status(errorRes.status).json(errorRes);
                }

            }).catch((error) => {

                // const errorRes = getErrorResponse(ERROR_TYPES.INVALID_TOKEN, {error});
                errorRes.status = 400;
                errorRes.message = "Please login with a valid account"
                return res.status(errorRes.status).json(errorRes);
            });
        } else {
            // Access Denied
            // const errorRes = getErrorResponse(ERROR_TYPES.INVALID_TOKEN, {error});
            errorRes.status = 400;
            errorRes.message = "Please login with a valid account"
            return res.status(errorRes.status).json(errorRes);
        }
    } catch (error) {
        // Access Denied
        // const errorRes = getErrorResponse(ERROR_TYPES.INVALID_TOKEN, {error});
        errorRes.status = 400;
        errorRes.message = "Please login with a valid account"  
        return res.status(errorRes.status).json(errorRes);
    }
}

export default tokenAuth;