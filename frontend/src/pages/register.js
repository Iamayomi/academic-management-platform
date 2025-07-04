import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        email,
        password,
        role,
      });
      router.push("/login");
    } catch (err) {
      setError(err.response?.data?.response?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl text-black font-bold mb-6 text-center">Register</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div>
          <div className="mb-4">
            <label className="block text-gray-800">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border  text-black rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full  text-black p-2 border rounded" required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2  text-black text border rounded">
              <option value="student">student</option>
              <option value="lecturer">lecturer</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <button onClick={handleRegister} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Register
          </button>
          <p className="mt-4 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
