import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ChefHat } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white/10 border-t-[#d4a843] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-16 w-16 text-[#d4a843] mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-4">You need to login first</h2>
          <p className="text-gray-500 mb-6">Please sign in to access this delicious content</p>
          <Link to="/auth" className="btn-primary">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;