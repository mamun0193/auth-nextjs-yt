import User from "@/models/userModel";
import {sendVerificationEmail} from "@/helpers/mailer";
import connectDB from "@/dbConfig/dbConfig";
import {NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest) {
    await connectDB();
    const { email } = await request.json();

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "User not found." }, { status: 404 });
        }
        await sendVerificationEmail({ email, emailType: "RESET", userId: user._id.toString() });
        return NextResponse.json({ message: "Reset link sent to your email." }, { status: 200 });
    } catch (error) {
        console.error("Error sending reset link:", error);
        return NextResponse.json({ message: "Failed to send reset link." }, { status: 500 });
    }
}
