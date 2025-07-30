import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, type LoginCredentials } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      await loginUser({ email, password } as LoginCredentials);
      
      toast({
        title: "Success",
        description: "Login successful! Redirecting...",
      });
      
      // Navigate to main page after successful login
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    navigate("/signup");
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic here
    console.log("Forgot password clicked");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Image section - Top on mobile, left side (2/3) on desktop */}
      <div className="w-full h-48 sm:h-64 lg:h-auto lg:flex-[2] relative">
        <img
          src="/sigin_in.jpg"
          alt="Login Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Login Form section - Below image on mobile, right side (1/3) on desktop */}
      <div className="flex-1 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-white min-h-0">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-12 sm:h-16 w-auto"
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
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
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