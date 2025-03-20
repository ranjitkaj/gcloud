
import React from 'react';
import { Route, Switch } from "wouter";
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/use-auth';

// Global UI Components
import ScrollToTop from "@/components/ui/scroll-to-top";
import Chatbot from "@/components/ui/chatbot";
import { Toaster } from "@/components/ui/toaster";

// Pages
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import TopPropertiesList from "@/pages/top-properties-list";
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
import AboutPage from "@/pages/about";
import ContactPage from "@/pages/contact";

// Policy Pages
import TermsConditions from "@/pages/policies/terms-conditions";
import PrivacyPolicy from "@/pages/policies/privacy-policy";
import Disclaimer from "@/pages/policies/disclaimer";
import Feedback from "@/pages/policies/feedback";
import ReportProblem from "@/pages/policies/report-problem";

import { queryClient } from '@/lib/query-client';

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
          <Route path="/about" component={AboutPage} />
          <Route path="/contact" component={ContactPage} />
          
          {/* Policy & Legal Pages */}
          <Route path="/terms-conditions" component={TermsConditions} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/disclaimer" component={Disclaimer} />
          <Route path="/feedback" component={Feedback} />
          <Route path="/report-problem" component={ReportProblem} />
          
          {/* User Routes */}
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/add-property" component={AddProperty} />
          <Route path="/recommendations" component={RecommendationsPage} />
          
          {/* Admin Routes */}
          <Route path="/admin" component={AdminDashboard} />
          
          {/* Top Properties Routes */}
          <Route path="/top-properties/:category">
            <TopPropertiesList />
          </Route>

          {/* 404 Route */}
          <Route component={NotFound} />
        </Switch>
        <Toaster />
        <ScrollToTop />
        <Chatbot />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
