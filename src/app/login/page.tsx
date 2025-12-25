//login page  

"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function LoginPage() {
    const [user, setUser] = React.useState({
        email: "",
        password: "",
    });
    const [buttonDisabled, setButtonDisabled] = React.useState(true);
    const router = useRouter();

    React.useEffect(() => {
        setButtonDisabled(!(user.email.length > 0 && user.password.length > 0));
    }, [user]);

    const onLogin = async () => {
        setButtonDisabled(true);
        try {
            const response = await axios.post("/api/users/login", user);
            console.log(response.data);
            if (response.status === 200) {
                router.push("/profile");
                toast.success("Login successful!");
            } else {
                toast.error(response.data.message || "Login failed");
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || "Login failed");
            } else {
                toast.error("Login failed");
            }
            console.error("Error during login:", error);
        } finally {
            setButtonDisabled(false);
        }
    };

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0) {
            setButtonDisabled(false);
        }
        else {
            setButtonDisabled(true);
        }
    }, [user]);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h1>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={e => {
                        e.preventDefault();
                        onLogin();
                    }}
                >
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={user.email}
                            onChange={e => setUser({ ...user, email: e.target.value })}
                            required
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={user.password}
                            onChange={e => setUser({ ...user, password: e.target.value })}
                            required
                            placeholder="Enter your password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={buttonDisabled}
                        className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-colors ${buttonDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        Login
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <span className="text-gray-700"> Don&apos;t have an account?</span> <Link href="/signup" className="text-blue-600 hover:underline">Signup</Link>
                </div>
            </div>
        </div>
    );
}

