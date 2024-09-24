import jwt from 'jsonwebtoken';

export function jwtDecode(token: string): jwt.JwtPayload {

    let jwtSecretKey = (process.env.JWT_SECRET_KEY as string);

    try {

        const verified = (jwt.verify(token, jwtSecretKey) as jwt.JwtPayload);

        return verified;

    } catch (error) {
        
        // Access Denied
        return {message: "Some issue occurred", payload: {error}};
    }
}