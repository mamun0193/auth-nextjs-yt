import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const getDataFromToken = (req: NextRequest) => {
    const token = req.cookies.get('token')?.value

    if (!token) return "can't find token"

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as { id: string }
        return decoded
    } catch (error) {
        throw new Error("Failed to verify token")
    }
}
