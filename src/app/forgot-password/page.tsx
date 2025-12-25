"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";



export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        setError("");
        try {
            const response = await axios.post("/api/users/forgot-password", { email });
            setMessage(response.data.message);
            setTimeout(() => {
                router.push("/reset-password");
            }, 2000);
        } catch (error) {
            console.log(error);
            setError("Failed to send reset link.");

        };

    };
    return (
        <div
            style={{
                maxWidth: "400px",
                margin: "50px auto",
                padding: "30px",
                border: "1px solid #e0e0e0",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                fontFamily: "Segoe UI, sans-serif",
            }}
        >
            <h2 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
                Forgot Password
            </h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <label
                        htmlFor="email"
                        style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#555" }}
                    >
                        Email:
                    </label>
                    <input

                        placeholder="youremail@email.com"
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            outline: "none",
                            transition: "0.3s",
                            color: "#333",
                            fontSize: "16px",
                        }}
                        onFocus={(e) =>
                            (e.target.style.border = "1px solid #0078d7")
                        }
                        onBlur={(e) =>
                            (e.target.style.border = "1px solid #ccc")
                        }
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "12px",
                        backgroundColor: "#0078d7",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "0.3s",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#005fa3")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#0078d7")}
                >
                    Send Reset Link
                </button>

            </form>
            {message && (
                <p style={{ color: "green", marginTop: "15px", textAlign: "center" }}>
                    {message}
                </p>
            )}
            {error && (
                <p style={{ color: "red", marginTop: "15px", textAlign: "center" }}>
                    {error}
                </p>
            )}
        </div>
    );
}