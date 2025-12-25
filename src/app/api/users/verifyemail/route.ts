import connectDB from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";


connectDB();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token } = reqBody;
        console.log(token);

        const user = await User.findOne({ $or: [{ emailVerificationToken: token, emailVerificationTokenExpiry: { $gt: Date.now() } }, { passwordResetToken: token, passwordResetTokenExpiry: { $gt: Date.now() } }] });
        if (!user) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }

        // Determine which token matched and handle accordingly
        if (user.emailVerificationToken === token) {
            user.isVerified = true;
            user.emailVerificationToken = undefined;
            user.emailVerificationTokenExpiry = undefined;
            await user.save();
            return NextResponse.json({ message: "Email verified successfully", type: "VERIFY" }, { status: 200 });
        }

        if (user.passwordResetToken === token) {
            // Don't clear the reset token here — let the reset endpoint consume it.
            return NextResponse.json({ message: "Token valid for password reset", type: "RESET" }, { status: 200 });
        }
    } catch (error) {
        throw new Error("Failed to verify Email");
        console.log(error);
    }
}