import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { registerUser, type RegisterCredentials, fetchBuildings, type Building } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<string>("");
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    const loadBuildings = async () => {
      try {
        const buildingsData = await fetchBuildings();
        setBuildings(buildingsData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load condominiums",
          variant: "destructive",
        });
      } finally {
        setIsLoadingBuildings(false);
      }
    };

    loadBuildings();
  }, [toast]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const credentials: RegisterCredentials = {
        ...formData,
        ...(selectedBuilding && { building_id: parseInt(selectedBuilding) })
      };
      await registerUser(credentials);
      
      toast({
        title: "Success",
        description: "Account created successfully! Redirecting...",
      });
      
      // Navigate to main page after successful signup
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleAlreadyHaveAccount = () => {
    navigate("/login");
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
          <div className="bg-white/30 backdrop-blur rounded-2xl shadow-2xl p-8 border border-white/20">
            {/* Logo */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">SINDIPRO</h1>
            </div>
            
            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-3">
              <Select value={selectedBuilding} onValueChange={setSelectedBuilding} disabled={isLoadingBuildings}>
                <SelectTrigger className="w-full h-12 bg-white/70 backdrop-blur-sm border-white/30">
                  <SelectValue placeholder={isLoadingBuildings ? "Loading condominiums..." : "Select condominium"} />
                </SelectTrigger>
                <SelectContent>
                  {buildings.map((building) => (
                    <SelectItem key={building.id} value={building.id.toString()}>
                      {building.building_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                required
                className="w-full h-12 bg-white/70 backdrop-blur border-white/30 placeholder:text-gray-600"
              />

              <Input
                type="email"
                placeholder="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="w-full h-12 bg-white/70 backdrop-blur-sm border-white/30 placeholder:text-gray-600"
              />

              <Input
                type="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                className="w-full h-12 bg-white/70 backdrop-blur-sm border-white/30 placeholder:text-gray-600"
              />

              <Input
                type="password"
                placeholder="Confirmar Senha"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
                className="w-full h-12 bg-white/70 backdrop-blur-sm border-white/30 placeholder:text-gray-600"
              />

              {/* Sign Up Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-white font-medium mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Criar Conta"}
              </Button>
            </form>

            {/* Already have account */}
            <div className="text-center mt-4">
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

      {/* Desktop View - Keep existing */}
      <div className="hidden lg:flex w-full">
        {/* Image section - left side (2/3) on desktop */}
        <div className="w-full lg:flex-[2] relative">
          <img
            src="/sigin_in.jpg"
            alt="Sign Up Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Sign Up Form section - right side (1/3) on desktop */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
          <div className="w-full max-w-sm space-y-6">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img
                src="/logo.png"
                alt="SINDIPRO Logo"
                className="h-16 w-auto"
              />
            </div>
            {/* Sign Up Form */}
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Select value={selectedBuilding} onValueChange={setSelectedBuilding} disabled={isLoadingBuildings}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={isLoadingBuildings ? "Loading condominiums..." : "Select condominium"} />
                  </SelectTrigger>
                  <SelectContent>
                    {buildings.map((building) => (
                      <SelectItem key={building.id} value={building.id.toString()}>
                        {building.building_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
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
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Criar Conta"}
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
    </div>
  );
};

export default SignUp;