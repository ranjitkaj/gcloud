
import React from 'react';
import { Route, Switch } from "wouter";
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
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          {/* Public Routes */}
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/properties" component={PropertiesPage} />
          <Route path="/property/:id" component={PropertyDetail} />
          <Route path="/property-detail/:id" component={PropertyDetail} />
          <Route path="/search-results" component={SearchResults} />
          <Route path="/projects/:category" component={ProjectCategory} />
          <Route path="/post-property-free" component={PostPropertyFree} />
          
          {/* User Routes */}
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/add-property" component={AddProperty} />
          <Route path="/recommendations" component={RecommendationsPage} />
          
          {/* Admin Routes */}
          <Route path="/admin" component={AdminDashboard} />
          
          {/* 404 Route */}
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
