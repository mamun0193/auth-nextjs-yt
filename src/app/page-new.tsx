import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Welcome to Auth App
        </h1>
        <p className="text-gray-600 text-center mb-8">
          A secure authentication system built with Next.js
        </p>
        
        <div className="flex flex-col gap-4">
          <Link 
            href="/signup"
            className="w-full py-3 px-4 rounded-md bg-blue-600 text-white font-semibold text-center hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </Link>
          <Link 
            href="/login"
            className="w-full py-3 px-4 rounded-md border border-blue-600 text-blue-600 font-semibold text-center hover:bg-blue-50 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
