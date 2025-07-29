import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign-up logic here
    console.log("Sign-up attempt:", formData);
  };


  const handleAlreadyHaveAccount = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image (2/3 of the page) */}
      <div className="flex-[2] relative">
        <img
          src="/sigin_in.jpg"
          alt="Sign Up Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Sign Up Form (1/3 of the page) */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/logo.png"
              alt="SINDIPRO Logo"
              className="h-16 w-auto"
            />
          </div>
          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder={t("fullName")}
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div>
              <Input
                type="email"
                placeholder={t("email")}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Confirmar Senha"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
                className="w-full"
              />
            </div>

            {/* Sign Up Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Criar Conta
            </Button>
          </form>

          {/* Already have account */}
          <div className="text-center">
            <span className="text-sm text-gray-600">Já tem uma conta? </span>
            <button
              onClick={handleAlreadyHaveAccount}
              className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Fazer login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;