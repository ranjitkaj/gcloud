import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/use-auth';
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import ProjectCategory from "@/pages/projects/project-category";
import AuthPage from "@/pages/auth-page"; // Added import for AuthPage
import { queryClient } from '@/lib/query-client';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/projects/:category" element={<ProjectCategory />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;