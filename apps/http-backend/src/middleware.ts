import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config"

export function authMiddleWare(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if ( !token ) {
        return res.status(403).json({
            message: "JWT Required"
        })
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if ( decoded ) {
        // @ts-ignore
        req.userId = decoded.userId;
        next();
    } else {
        return res.status(403).json({
            message: "Unauthorized / Wrong JWT / JWT Expired"
        })
    }
}