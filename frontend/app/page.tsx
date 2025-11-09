"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SiGoogle, SiGithub, SiApple } from "react-icons/si";
import api from "@/lib/api";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      console.log("✅ Login response:", res.data);

      // Store token, name, and email in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.name);
      localStorage.setItem("userEmail", res.data.user.email);

      // Redirect to todos page
      router.push("/todos");
    } catch (err: any) {
      console.error(
        "❌ Login error:",
        err.response ? err.response.data : err.message
      );
      alert("Login failed. Check email/password!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    console.log("Reset password for:", resetEmail);
    setShowReset(false);
    alert("Password reset link sent to your email!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-blue-100 to-blue-300">
      <Card className="w-[400px] backdrop-blur-md bg-white/30 shadow-2xl rounded-3xl border border-blue-200">
        <CardHeader className="space-y-2 pb-6 text-center">
          <CardTitle className="text-3xl font-bold text-black">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-black/70">
            Sign in to your account
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11 border border-blue-200 rounded-md bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-black text-black"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-black">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  onClick={() => setShowReset(true)}
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 border border-blue-200 rounded-md bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-black text-black"
              />
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              className={`w-full h-11 font-semibold rounded-md text-white ${
                isLoading
                  ? "bg-blue-400"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              } transition-colors duration-300`}
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="bg-blue-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase text-black/70">
              <span className="bg-blue-100/60 px-3 py-0.5 rounded-full backdrop-blur-sm border border-blue-200 shadow-sm">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social OAuth Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="w-11 h-11 rounded-full border border-blue-200 bg-white/60 hover:bg-blue-100/70 backdrop-blur-md transition-all duration-200 flex items-center justify-center shadow-sm"
              onClick={() => signIn("google")}
            >
              <SiGoogle className="w-5 h-5 text-[#EA4335]" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="w-11 h-11 rounded-full border border-blue-200 bg-white/60 hover:bg-blue-100/70 backdrop-blur-md transition-all duration-200 flex items-center justify-center shadow-sm"
              onClick={() => signIn("github")}
            >
              <SiGithub className="w-5 h-5 text-[#181717]" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="w-11 h-11 rounded-full border border-blue-200 bg-white/60 hover:bg-blue-100/70 backdrop-blur-md transition-all duration-200 flex items-center justify-center shadow-sm"
              onClick={() => signIn("apple")}
            >
              <SiApple className="w-5 h-5 text-black" />
            </Button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-black/80 pt-4">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>

      {/* Password Reset Modal */}
      {showReset && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-[350px] border border-blue-200 backdrop-blur-md">
            <h3 className="text-lg font-semibold mb-4 text-black">
              Reset Password
            </h3>
            <Input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              className="h-10 border border-blue-200 rounded-md bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-black text-black"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                className="text-blue-700 border-blue-300 hover:bg-blue-50"
                onClick={() => setShowReset(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleResetPassword}
              >
                Send Link
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
