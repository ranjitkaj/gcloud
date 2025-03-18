
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/use-auth';
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import AddProperty from "@/pages/add-property";
import PostPropertyFree from "./pages/post-property-free";
import ProjectCategory from "@/pages/projects/project-category";
import SearchResults from "@/pages/search-results";
import AdminDashboard from "@/pages/admin/dashboard";
import { queryClient } from '@/lib/query-client';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/post-property-free" element={<PostPropertyFree />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/projects/:category" element={<ProjectCategory />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
