import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Login attempt:", { email, password });
  };

  const handleCreateAccount = () => {
    navigate("/signup");
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic here
    console.log("Forgot password clicked");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image (2/3 of the page) */}
      <div className="flex-[2] relative">
        <img
          src="/sigin_in.jpg"
          alt="Login Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Login Form (1/3 of the page) */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-16 w-auto"
            />
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Forgot your password? Click here.
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Log in
            </Button>
          </form>

          {/* Create Account Button */}
          <Button
            onClick={handleCreateAccount}
            variant="outline"
            className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
            size="lg"
          >
            Create an account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;