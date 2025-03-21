import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { username: string; password: string }) => Promise<any>;
  logout: () => Promise<any>;
  signup: (data: any) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['/api/user'],
    retry: false,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      console.log('Attempting login with:', credentials.username);
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        console.error('Login failed with status:', response.status);
        // Try to get the error message from the response
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Login failed');
        } catch (e) {
          throw new Error('Login failed: Invalid credentials');
        }
      }
      
      const data = await response.json();
      console.log('Login successful:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Attempting registration with:', { 
        username: data.username, 
        email: data.email,
        verificationMethod: data.verificationMethod 
      });
      
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        console.error('Registration failed with status:', response.status);
        // Try to get the error message from the response
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed');
        } catch (e) {
          throw new Error('Registration failed: ' + (e instanceof Error ? e.message : 'Unknown error'));
        }
      }
      
      const userData = await response.json();
      console.log('Registration successful:', userData);
      return userData;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/user'], data);
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      console.log('Logging out user...');
      const response = await fetch('/api/logout', { method: 'POST' });
      if (!response.ok) throw new Error('Logout failed');
      return true;
    },
    onSuccess: () => {
      console.log('Logout successful, clearing user data');
      // Clear user data immediately from cache before invalidating
      queryClient.setQueryData(['/api/user'], null);
      // Then invalidate queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      // Clear any other user-specific data
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations'] });
      
      // Force a location reload to ensure all components update
      window.location.href = '/';
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        login: loginMutation.mutateAsync,
        signup: signupMutation.mutateAsync,
        logout: logoutMutation.mutateAsync,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}