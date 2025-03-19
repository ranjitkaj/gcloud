
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/use-auth';

// Pages
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import AddProperty from "@/pages/add-property";
import PostPropertyFree from "@/pages/post-property-free";
import Dashboard from "@/pages/dashboard";
import PropertyDetail from "@/pages/property-detail";
import PropertiesPage from "@/pages/properties-page";
import ProjectCategory from "@/pages/projects/project-category";
import SearchResults from "@/pages/search-results";
import RecommendationsPage from "@/pages/recommendations";
import AdminDashboard from "@/pages/admin/dashboard";
import { queryClient } from '@/lib/query-client';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/search-results" element={<SearchResults />} />
            <Route path="/projects/:category" element={<ProjectCategory />} />
            <Route path="/post-property-free" element={<PostPropertyFree />} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-property" element={<AddProperty />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
