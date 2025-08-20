import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated, setupTokenRefresh, hasRole } from '@/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        navigate('/login');
        return;
      }
      
      // Setup automatic token refresh
      setupTokenRefresh();
      setIsLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Role-based access control component
interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole: string;
  fallbackMessage?: string;
}

export const RoleGuard = ({ children, requiredRole, fallbackMessage = "Access denied. You don't have permission to view this page." }: RoleGuardProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    if (!hasRole(requiredRole)) {
      // You could navigate to an access denied page or show a message
      return;
    }
  }, [navigate, requiredRole]);

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasRole(requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.332 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">{fallbackMessage}</p>
          <button 
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Higher-order component for protecting routes
export const withAuthGuard = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => (
    <AuthGuard>
      <Component {...props} />
    </AuthGuard>
  );
};

// Higher-order component for role-based route protection
export const withRoleGuard = <P extends object>(Component: React.ComponentType<P>, requiredRole: string) => {
  return (props: P) => (
    <RoleGuard requiredRole={requiredRole}>
      <Component {...props} />
    </RoleGuard>
  );
};