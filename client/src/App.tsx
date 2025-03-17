import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import PropertiesPage from "@/pages/properties-page";
import PropertyDetail from "@/pages/property-detail";
import { ProtectedRoute } from "./lib/protected-route";
import AddProperty from "@/pages/add-property";
import Dashboard from "@/pages/dashboard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage}/>
      <Route path="/auth" component={AuthPage}/>
      <Route path="/properties" component={PropertiesPage}/>
      <Route path="/property/:id" component={PropertyDetail}/>
      <ProtectedRoute path="/add-property" component={AddProperty}/>
      <ProtectedRoute path="/dashboard" component={Dashboard}/>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import ProjectCategory from "@/pages/projects/project-category";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:category" element={<ProjectCategory />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}