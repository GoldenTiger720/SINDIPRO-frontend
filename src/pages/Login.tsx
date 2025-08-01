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
      {/* Mobile View */}
      <div className="lg:hidden min-h-screen relative flex items-center justify-center">
        {/* Full screen background image with reduced opacity */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-70"
          style={{ backgroundImage: `url("/mobile.png")` }}
        />
        
        {/* Card/Modal Form */}
        <div className="relative z-10 w-full max-w-sm mx-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {/* Logo */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">SINDIPRO</h1>
            </div>
            
            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-12 border-gray-300"
                />
                
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 border-gray-300"
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
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </form>

            {/* Create Account Button */}
            <Button
              onClick={handleCreateAccount}
              variant="outline"
              className="w-full mt-4 bg-white hover:bg-gray-50 h-12 text-blue-600 font-medium border border-blue-600"
            >
              Create an account
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop View - Keep existing */}
      <div className="hidden lg:flex w-full">
        {/* Image section - left side (2/3) on desktop */}
        <div className="w-full lg:flex-[2] relative">
          <img
            src="/sigin_in.jpg"
            alt="Login Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Login Form section - right side (1/3) on desktop */}
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
    </div>
  );
};

export default Login;