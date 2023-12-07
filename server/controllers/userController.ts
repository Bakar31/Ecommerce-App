import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    {
                        username,
                    },
                    {
                        email,
                    },
                ],
            },
        });

        if (existingUser) {
            return res
                .status(400)
                .json({ error: "Username or email already exists" });
        }

        const hashPassword = await hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashPassword,
            },
        });

        res.status(201).json({
            message: "User created successfully",
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Error creating user" });
    }
};
