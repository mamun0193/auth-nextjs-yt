"use client"
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
export default function ProfilePage({ params }: { params: { id: string } }) {
    const router = useRouter();

    const logout = async () => {

        try {
            await axios.get("/api/users/logout");
            toast.success("Logged out successfully");
            router.push("/login");
        } catch (error) {
            console.log(error);
            toast.error("Error during logout");
        }

    }
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Profile</h1>
            <hr />
            <p className="text-center">User ID: {params.id}</p>

            <hr />
            <button
                onClick={
                    logout
                }
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Log Out</button>
        </div>
    );

}