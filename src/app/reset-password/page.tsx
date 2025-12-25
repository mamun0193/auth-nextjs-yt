"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const [token, setToken] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token') || "";
        setToken(urlToken);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");
        if (!password || password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const res = await axios.post('/api/users/reset-password', { token, password });
            setMessage(res.data?.message || 'Password reset successful');
            setTimeout(() => {
                router.push('/login');
            }, 1500);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to reset password.');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2">New Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border p-2 rounded" placeholder="Enter new password" />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Confirm Password</label>
                        <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full border p-2 rounded" placeholder="Confirm new password" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Reset Password</button>
                </form>
                {message && <p className="text-green-600 mt-4">{message}</p>}
                {error && <p className="text-red-600 mt-4">{error}</p>}
            </div>
        </div>
    );
}
