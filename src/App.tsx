import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Buildings from "./pages/Buildings";
import LegalObligations from "./pages/LegalObligations";
import Equipment from "./pages/Equipment";
import Financial from "./pages/Financial";
import Consumption from "./pages/Consumption";
import FieldManagement from "./pages/FieldManagement";
import Reports from "./pages/Reports";
import Users from "./pages/Users";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/buildings" element={<Buildings />} />
          <Route path="/legal-obligations" element={<LegalObligations />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/financial" element={<Financial />} />
          <Route path="/consumption" element={<Consumption />} />
          <Route path="/field-management" element={<FieldManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/users" element={<Users />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
