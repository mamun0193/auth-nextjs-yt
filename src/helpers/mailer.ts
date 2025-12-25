import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "@/models/userModel";


export  const sendVerificationEmail = async ({ email, emailType, userId }: { email: string; emailType: "VERIFY" | "RESET"; userId: string; }) => {
    try {
        //create hashed token for verification and reset password

        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, { emailVerificationToken: hashedToken, emailVerificationTokenExpiry: Date.now() + 3600000 });
        }
        else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, { passwordResetToken: hashedToken, passwordResetTokenExpiry: Date.now() + 3600000 });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT) || 2525,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}&type=${emailType}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br>
            </p>`,
        };

        const response = await transporter.sendMail(mailOptions);
        return response;
    } catch (error) {
        throw new Error("Failed to send verification email" + (error instanceof Error ? `: ${error.message}` : ""));
    }
}