"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
export default function SignupPage() {

    const router = useRouter();
    const [user, setUser] = React.useState({
        name: "",
        email: "",
        password: "",
        username: ""
    });

    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const onSignUp = async () => {
        setButtonDisabled(true);
        try {
            const response = await axios.post("/api/users/signup", user);
            console.log(response.data);
            if (response.status === 201) {
                // fallback: if server still creates user immediately, go to login
                router.push("/login");
                toast.success("Signup successful!");
            } else if (response.status === 200) {
                // verification email sent — redirect to verification instructions page
                router.push("/verifyemail");
                toast.success("Verification email sent — check your inbox");
            } else {
                toast.error(response.data.message || "Signup failed");
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || "Signup failed");
            } else {
                toast.error("Signup failed");
            }
            console.log(error);
        } finally {
            setButtonDisabled(false);
        }
    };

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up</h1>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={e => {
                        e.preventDefault();
                        onSignUp();
                    }}
                >
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={user.name}
                            onChange={e => setUser({ ...user, name: e.target.value })}
                            required
                            placeholder="Enter your name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={user.username}
                            onChange={e => setUser({ ...user, username: e.target.value })}
                            required
                            placeholder="Set a username"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
                        />
                    </div>
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
                        {buttonDisabled ? "Sign Up" : "Sign Up"}
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <span className="text-gray-700"> Already have an account?</span>
                    <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
                </div>
            </div>
        </div>
    );
}
