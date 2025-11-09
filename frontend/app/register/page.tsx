"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SiGoogle, SiGithub, SiApple } from "react-icons/si";
import api from "@/lib/api";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("❌ Passwords do not match!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });

      console.log("✅ Registration success:", res.data);
      alert("✅ Account created successfully!");
      router.push("/"); // Redirect to login page
    } catch (err: any) {
      console.error("❌ Registration error:", err.response?.data || err.message);
      alert("⚠️ Error during registration");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] md:min-h-[75vh] lg:min-h-[80vh] bg-gradient-to-tr from-blue-100 to-blue-300 py-6">
      <Card className="w-[400px] backdrop-blur-md bg-white/30 shadow-2xl rounded-3xl border border-blue-200">
        <CardHeader className="space-y-2 pb-6 text-center">
          <CardTitle className="text-3xl font-bold text-black">Create Your Account</CardTitle>
          <CardDescription className="text-black/70">Sign up to get started</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-black">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                className="h-11 border border-blue-200 rounded-md bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-black text-black"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-black">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="h-11 border border-blue-200 rounded-md bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-black text-black"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-black">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                className="h-11 border border-blue-200 rounded-md bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-black text-black"
              />
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-black">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="h-11 border border-blue-200 rounded-md bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-black text-black"
              />
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              className={`w-full h-11 font-semibold rounded-md text-white ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} transition-colors duration-300`}
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
          </form>

          {/* Or continue with */}
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

          <p className="text-center text-sm text-black/80 pt-4">
            Already have an account?{" "}
            <Link href="/" className="text-blue-600 font-medium hover:underline">Sign in</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
