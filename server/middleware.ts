import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = 'bakar31';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req)
    const userToken = req.cookies['userToken'];
    console.log(userToken)

    if (userToken) {
        try {
            const decodedToken = jwt.verify(userToken, JWT_SECRET);
            const userId = (decodedToken as { userId: number }).userId;
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });

            if (user) {
                req.user = user;
                next();
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            res.status(401).json({ message: 'Invalid token' });
        }
    } else {
        res.status(404).json({ message: 'Cookie not found' });
    }
};
