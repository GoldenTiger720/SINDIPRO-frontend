import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "@/components/AuthGuard";
import { isAuthenticated } from "@/lib/auth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Buildings from "./pages/Buildings";
import LegalObligations from "./pages/LegalObligations";
import Equipment from "./pages/Equipment";
import Financial from "./pages/Financial";
import Consumption from "./pages/Consumption";
import FieldManagement from "./pages/FieldManagement";
import Reports from "./pages/Reports";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import SupplierContacts from "./pages/SupplierContacts";

const queryClient = new QueryClient();

// Component to handle public routes (login, signup)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  return isAuthenticated() ? <Navigate to="/" replace /> : <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes - redirect to dashboard if already authenticated */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          } />
          
          {/* Protected routes - require authentication */}
          <Route path="/" element={
            <AuthGuard>
              <Index />
            </AuthGuard>
          } />
          <Route path="/buildings" element={
            <AuthGuard>
              <Buildings />
            </AuthGuard>
          } />
          <Route path="/legal-obligations" element={
            <AuthGuard>
              <LegalObligations />
            </AuthGuard>
          } />
          <Route path="/equipment" element={
            <AuthGuard>
              <Equipment />
            </AuthGuard>
          } />
          <Route path="/financial" element={
            <AuthGuard>
              <Financial />
            </AuthGuard>
          } />
          <Route path="/consumption" element={
            <AuthGuard>
              <Consumption />
            </AuthGuard>
          } />
          <Route path="/field-management" element={
            <AuthGuard>
              <FieldManagement />
            </AuthGuard>
          } />
          <Route path="/reports" element={
            <AuthGuard>
              <Reports />
            </AuthGuard>
          } />
          <Route path="/users" element={
            <AuthGuard>
              <Users />
            </AuthGuard>
          } />
          <Route path="/profile" element={
            <AuthGuard>
              <Profile />
            </AuthGuard>
          } />
          <Route path="/settings" element={
            <AuthGuard>
              <Settings />
            </AuthGuard>
          } />
          <Route path="/supplier-contacts" element={
            <AuthGuard>
              <SupplierContacts />
            </AuthGuard>
          } />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
