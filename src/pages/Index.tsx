
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginForm } from '@/components/auth/LoginForm';
import { AdminDashboard } from '@/components/AdminDashboard';
import { OwnerDashboard } from '@/components/dashboard/OwnerDashboard';

const Index = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  // Role-based dashboard rendering
  if (user.role === 'owner') {
    return <OwnerDashboard />;
  }

  // Default to admin dashboard
  return <AdminDashboard />;
};

export default Index;
