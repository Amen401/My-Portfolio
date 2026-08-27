import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Shield, Eye, EyeOff, Lock } from "lucide-react";
import { useAuth } from "@/src/contexts/AuthContext";
import { useToast } from "@/src/components/ui/Toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // Sending request to your Node.js backend
      const res = await axios.post(
        "https://my-portifolio-backend-swart.vercel.app/api/auth/login",
        {
          username: email, // Matches the 'username' field in your Profile model
          password: password,
        },
      );

      // res.data should contain { token, user: { email, name } }
      const { token, user } = res.data;

      // Store token in localStorage so the API interceptor can find it
      localStorage.setItem("token", token);

      // Update AuthContext state
      login(user);

      toast("Login successful", "success");
      navigate("/admin/dashboard");
    } catch (err: any) {
      // Display the error message from the backend or a default one
      toast(
        err.response?.data?.message ||
          "Authentication failed. Check your credentials.",
        "error",
      );
    }
  };

  return (
    <div
      className="min-h-[70vh] flex items-center justify-center"
      id="login-page"
    >
      <div className="w-full max-w-sm space-y-8 bg-white dark:bg-neutral-900 p-8 rounded-md border border-neutral-100 dark:border-neutral-800">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-md bg-primary flex items-center justify-center text-white">
            <Shield className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-tighter">
              Admin Portal
            </h1>
            <p className="text-xs text-neutral-500">
              Secure entry for system administrators only.
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Identity
            </label>
            <input
              required
              type="text" // Changed to text to support email-as-username
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 text-xs bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary"
              placeholder="pawlosgelgelo@gmail.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Cipher
            </label>
            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-neutral-800 rounded-md focus:outline-hidden focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-primary cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5" />
                ) : (
                  <Eye className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-primary text-white rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm font-medium"
          >
            Authorize Access <Lock className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="text-[10px] text-center text-neutral-500 font-mono">
          Enter your admin credentials to proceed.
        </p>
      </div>
    </div>
  );
}
