"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";




export default function VerifyEmailPage() {
    const [emailType, setEmailType] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const [error, setError] = useState<boolean>(false);
    const [verified, setVerified] = useState<boolean>(false);
    const router = useRouter();


    const verifyEmail = async () => {
        try {
            await axios.post('/api/users/verifyemail', { token })
            if (emailType === "RESET") {
                router.push('/reset-password?token=' + token);
                return;
            }
            setVerified(true);
        } catch (error: any) {
            setError(true);
            console.log("error.response.data.message:", error.response?.data?.message);
        }
    }
    // ✅ First useEffect: extract token and emailType safely
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get("token") || "";
        const urlEmailType = (params.get("type") || params.get("emailType") || "VERIFY").toUpperCase();
        setToken(urlToken);
        setEmailType(urlEmailType);
    }, []);

    // ✅ Second useEffect: trigger verification when token + emailType are set
    useEffect(() => {
        if (token) {
            verifyEmail();
        }
    }, [token]);

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
                {verified ? (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Email Verified Successfully!</h1>
                        <p className="mb-4">Your email has been verified.</p>
                        <Link href="/login" className="text-blue-500 hover:underline">
                            Login
                        </Link>
                    </div>
                ) : error ? (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Verification Failed</h1>
                        <p className="mb-4">There was an error verifying your email.</p>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
                    </div>
                )}
            </div>
        </div>
    );
}