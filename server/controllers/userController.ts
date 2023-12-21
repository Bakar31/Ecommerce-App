import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { compare, hash } from "bcrypt";
import * as z from "zod";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

// Schema for input
const userSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must have at least 8 characters"),
});

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = userSchema.parse(req.body);

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
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
        name,
        email,
        password: hashPassword,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

export const resetPassword =async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
      },
    });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user.id }, "bakar31", {
      expiresIn: "1h",
    });

    res.cookie("userToken", token, {
      httpOnly: true,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ error: "Error logging in" });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("userToken");
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ error: "Error logging out" });
  }
};

export const checkAuthStatus = async (req: Request, res: Response) => {
  const userToken = req.cookies['userToken'];

  if (userToken) {
    res.status(200).json({ userToken });
  } else {
    res.status(404).json({ message: 'Cookie not found' });
  }
};
