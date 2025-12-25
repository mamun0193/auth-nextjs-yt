import { NextResponse } from "next/server";

export async function POST() {
    try {
        console.log("Logout request received");

        const response = NextResponse.json({
            message: "Logout successful",
            success: true,
        });

        // Clear the token cookie with multiple approaches to ensure it's removed
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });
        
        // Alternative: explicitly delete the cookie
        // response.cookies.delete("token");

        console.log("Logout successful, cookie cleared");
        return response;

    } catch (error) {
        console.error("Error during logout:", error);
        return NextResponse.json({ 
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
