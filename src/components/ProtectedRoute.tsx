import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ChefHat } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ChefHat className="h-16 w-16 text-primary-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">You need to login first</h2>
          <p className="text-gray-600 mb-6">Please sign in to access this delicious content</p>
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