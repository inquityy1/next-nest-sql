import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { signupUser } from "@/utils/req/chatReq";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await signupUser(username, password);
      toast.success(data.message);
      router.push("/login");
    } catch (err) {
      setError("U have to put both username and password");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block font-medium">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block font-medium">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Sign Up
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}
