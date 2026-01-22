import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import api from "../../services/api";

interface Props {
  onSuccess: (userData: { email: string; role: "user" | "admin"; token: string }) => void;
}

const LoginForm = ({ onSuccess }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, email: userEmail, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ email: userEmail, role }));

      onSuccess(res.data);
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 shadow-lg rounded-2xl space-y-4">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
