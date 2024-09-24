import jwt from 'jsonwebtoken';
import { jwtDecode } from './jwtDecode';
import { ErrorResponse } from '../types/response';
import e from 'express';

function adminAuth(req: any, res: any, next: any) {

    const errorRes: ErrorResponse = { status: 400, message: "", payload: {error: {}} }

    if(!req.header('only-admin')) {

        next();
        return;
    }
    
    console.log("Only admin");

    try {
        if (req.body.role === 0) {
            next();
            return;
        } else {
            // Access Denied
            // const errRes = getErrorResponse(ERROR_TYPES.NOT_ADMIN);
            errorRes.status = 400;
            errorRes.message = "Unauthorized request - Not an admin"
            return res.status(errorRes.status).json(errorRes);
        }
    } catch (error: any) {
        
        // Access Denied
        errorRes.status = 400;
        errorRes.message = "Unauthorized request - Not an admin";
        errorRes.payload.error = error;
        return res.status(errorRes.status).json(errorRes);
    }
}

export default adminAuth;