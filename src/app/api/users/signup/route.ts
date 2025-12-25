import connectDB  from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
    console.log("=== SIGNUP API CALLED ===");
    console.log("Environment check:");
    console.log("- NODE_ENV:", process.env.NODE_ENV);
    console.log("- MONGO_URI exists:", !!process.env.MONGO_URI);
    console.log("- TOKEN_SECRET exists:", !!process.env.TOKEN_SECRET);
    
    try {
        // Connect to database first
        console.log("1. Attempting to connect to database...");
        await connectDB();
        console.log("2. Database connected successfully"); 
        console.log("3. Parsing request body...");
        const reqBody = await request.json();
        const { name, username, email, password } = reqBody;

        console.log("4. Request body parsed:", { name, username, email, password: password ? "***" : "missing" });

        // Validate required fields
        if (!name || !username || !email || !password) {
            console.log("5. ERROR: Missing required fields");
            return NextResponse.json({ message: "All fields are required" }, { status: 400 });
        }
        
        console.log("5. Checking for existing user...");
        //check if user is already registered
        const existingUser = await User.findOne({ email  });
        if (existingUser) {
            console.log("6. ERROR: User already exists");
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

        const forcedUser = await User.findOne({ username });
        if (forcedUser) {
            console.log("6. ERROR: Username already exists");
            return NextResponse.json({ message: "Username already exists, Try different one" }, { status: 409 });
        }

        console.log("6. User doesn't exist, proceeding with creation...");
        console.log("7. Hashing password...");
        //hash password in DB
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        console.log("8. Creating new user object...");
        //create new user
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword,
        });

        console.log("9. Saving user to database...");
        const savedUser = await newUser.save();
        console.log("10. SUCCESS: User saved with ID:", savedUser._id);

        //send verification email

        console.log("11. Sending verification email...");
        await sendVerificationEmail({ email, emailType: "VERIFY", userId: savedUser._id });
        console.log("12. Verification email sent to:", email);
        
        
        return NextResponse.json({ 
            message: "User registered successfully",
            userId: savedUser._id 
        }, { status: 201 });
    }
    catch (error) {
        console.error("=== SIGNUP ERROR ===");
        console.error("Error occurred at step: Unknown");
        console.error("Error type:", typeof error);
        console.error("Error constructor:", error?.constructor?.name);
        console.error("Full error object:", error);
        
        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            
            return NextResponse.json({ 
                message: "Internal Server Error", 
                error: error.message, 
                name: error.name,
                stack: error.stack 
            }, { status: 500 });
        } else {
            console.error("Non-Error object thrown:", String(error));
            return NextResponse.json({ 
                message: "Internal Server Error", 
                error: String(error) 
            }, { status: 500 });
        }
    }
}