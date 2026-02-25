import { useAuthWithRole } from '@/hooks/use-auth';
import { Navigate, useLocation } from 'react-router';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const UserRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, role, signOut } = useAuthWithRole();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Check for 'user' role specifically
  if (role === 'admin') {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 px-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <h1 className="text-2xl font-bold tracking-tight">Access Denied</h1>
          <p className="text-muted-foreground text-lg">
            Your role is not user.
          </p>
          <p className="text-sm text-muted-foreground max-w-[400px]">
            This application is for players only. Please use the admin dashboard or sign in with a player account.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => signOut()}
          className="mt-2"
        >
          Sign Out
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};
