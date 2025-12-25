import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import connectDB from "@/dbConfig/dbConfig";

export async function GET(request: NextRequest) {
    try {
        // Connect to database
        await connectDB();
        
        // Get user data from token
        const userData = getDataFromToken(request);
        if (typeof userData === "string") {
            return NextResponse.json({ message: userData }, { status: 401 });
        }

        // Find user in database
        const user = await User.findById(userData.id).select("-password");
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ 
            message: "User data retrieved successfully",
            data: user 
        }, { status: 200 });
        
    } catch (error) {
        console.error("Error in /api/users/me:", error);
        return NextResponse.json({ 
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}