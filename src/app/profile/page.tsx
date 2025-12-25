"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/dist/client/link";

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<{
        _id: string;
        name?: string;
        username: string;
        email: string;
    } | null>(null);

    useEffect(() => {
        const getUserData = async () => {
            try {
                const response = await axios.get("/api/users/me");
                console.log("User data response:", response.data);
                setUserData(response.data.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                // If token is invalid, redirect to login
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    toast.error("Please login to access profile");
                    router.push("/login");
                }
            } finally {
                setLoading(false);
            }
        };

        // Fetch user data when component mounts
        getUserData();
    }, [router]);

    const logout = async () => {
        try {
            await axios.post("/api/users/logout");
            toast.success("Logged out successfully");
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed");
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Profile</h1>
                <div className="text-center mb-6">
                    <p className="text-gray-600">Welcome to your profile!</p>
                    {userData ? (
                        <div className="mt-4 p-4 bg-gray-100 rounded-md">
                            <p className="font-semibold text-gray-800">Name: {userData.name || 'Not provided'}</p>
                            <p className="font-semibold text-gray-800">Username: {userData.username}</p>
                            <p className="text-sm text-gray-600">Email: {userData.email}</p>
                        </div>
                    ) : (
                        <p className="text-red-500">No user data available</p>
                    )}
                </div>
                <button
                    onClick={logout}
                    className="w-full py-2 px-4 rounded-md bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
                >
                    Logout
                </button>

                <Link href="/forgot-password" className="mt-4 block text-center text-blue-600 hover:underline">
                    Forgot Password?
                </Link>
            </div>
        </div>
    );
}
