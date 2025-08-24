// App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import AuthDashboard from "./pages/AuthDashboard";
import Products from "./pages/Products";
import Clients from "./pages/Clients";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import LegalNotice from "./pages/LegalNotice";
import CookiesPolicy from "./pages/CookiesPolicy";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import {RequireAuth, RequireRole} from "@/components/routing/RouteGuards.tsx";

// 👇 Nouveau
const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Routes publiques */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/legal-notice" element={<LegalNotice />} />
                <Route path="/cookies-policy" element={<CookiesPolicy />} />

                {/* Routes protégées (auth requise) */}
                <Route
                    path="/dashboard"
                    element={
                      <RequireAuth>
                        <AuthDashboard />
                      </RequireAuth>
                    }
                />

                <Route
                    path="/products"
                    element={
                      <RequireAuth>
                        <Products />
                      </RequireAuth>
                    }
                />
                <Route
                    path="/clients"
                    element={
                      <RequireAuth>
                        <Clients />
                      </RequireAuth>
                    }
                />
                <Route
                    path="/orders"
                    element={
                      <RequireAuth>
                        <Orders />
                      </RequireAuth>
                    }
                />
                <Route
                    path="/profile"
                    element={
                      <RequireAuth>
                        <Profile />
                      </RequireAuth>
                    }
                />
                <Route
                    path="/settings"
                    element={
                      <RequireAuth>
                        <Settings />
                      </RequireAuth>
                    }
                />

                {/* Routes protégées par rôle */}
                <Route
                    path="/users"
                    element={
                      <RequireRole allowedRoles={['ADMIN', 'MANAGER']}>
                        <Users />
                      </RequireRole>
                    }
                />

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
);

export default App;
