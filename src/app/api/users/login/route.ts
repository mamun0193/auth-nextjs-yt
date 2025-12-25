import connectDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
    try {
        // Connect to database first
        await connectDB();

        const reqBody = await request.json();
        const { email, password } = reqBody;
        
        console.log("Login request body:", reqBody);
        
        // Validate required fields
        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }
        
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: "User does not exist" }, { status: 404 });
        }

        // Check if password is correct
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({ message: "Invalid password" }, { status: 400 });
        }

        // Ensure email is verified before allowing login
        if (!user.isVerified) {
            return NextResponse.json({ message: "Please verify your email before logging in" }, { status: 403 });
        }

        // Create token data
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        };

        // Create token
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: "1d" });

        const response = NextResponse.json({
            message: "Login successful",
            success: true,
        });

        response.cookies.set("token", token, {
            httpOnly: true,
        });

        return response;

    } catch (error) {
        console.error("Error during user login:", error);
        if (error instanceof Error) {
            return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ message: "Internal Server Error", error: String(error) }, { status: 500 });
        }
    }
}