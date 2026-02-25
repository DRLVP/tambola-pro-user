import { useEffect, useState, useRef } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { setAuthTokenGetter } from '@/services/api';
import { authService } from '@/services/auth.service';
import { Loader2 } from 'lucide-react';

import { useLocation } from 'react-router';

/**
 * Component that:
 * 1. Initializes authentication token getter
 * 2. Syncs Clerk session with Backend Database
 * 3. Blocks rendering until sync is complete
 */
export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const location = useLocation();

  // State to block rendering while we sync with backend
  const [isSyncing, setIsSyncing] = useState(false);
  // Ref to ensure we don't spam the API in Strict Mode
  const hasSynced = useRef(false);

  useEffect(() => {
    // 1. Always keep the token getter fresh
    setAuthTokenGetter(async () => {
      try {
        return await getToken();
      } catch (error) {
        console.error('Failed to get auth token:', error);
        return null;
      }
    });

    // 2. Sync Logic
    const syncUserWithBackend = async () => {
      // Only sync if:
      // - Clerk is loaded and User is signed in
      // - We haven't synced yet in this session
      // - We have user data available
      if (isLoaded && isSignedIn && user && !hasSynced.current && !location.pathname.includes('sso-callback')) {
        setIsSyncing(true);
        console.log("🔄 Syncing user with backend...");

        try {
          // Ensure token is ready before calling API
          const token = await getToken();
          if (token) {
            // Check intent based on current URL or existing metadata
            const isAdminRoute = location.pathname.startsWith('/admin');
            const currentRole = user.publicMetadata?.role as string | undefined;

            // Sync as Admin if:
            // 1. We are on an admin route (e.g. /admin/sign-in, /admin/dashboard)
            // 2. OR user is already an admin (checked via metadata)
            if (isAdminRoute || currentRole === 'admin') {
              console.log("👮‍♂️ Syncing as ADMIN based on route/metadata");
              await authService.syncAdmin({
                clerkId: user.id,
                email: user.primaryEmailAddress?.emailAddress || '',
                name: user.fullName || user.firstName || 'Admin',
              });
            } else {
              console.log("👤 Syncing as USER");
              await authService.syncUser({
                clerkId: user.id,
                email: user.primaryEmailAddress?.emailAddress || '',
                name: user.fullName || user.firstName || 'User',
              });
            }

            console.log("✅ Identity synced successfully");
            hasSynced.current = true;
          }
        } catch (error) {
          console.error("❌ Failed to sync identity:", error);
          // We allow the app to load even if sync fails, 
          // but you could choose to show an error screen here.
        } finally {
          setIsSyncing(false);
          // Optional: Clear intended_role after sync? 
          // Maybe better to keep it for the session or let pages handle it.
        }
      }
    };

    syncUserWithBackend();
  }, [getToken, isLoaded, isSignedIn, user]);

  // 3. Loading View
  // Show loader if Clerk is loading OR if we are currently syncing to Backend
  if (!isLoaded || (isSignedIn && isSyncing)) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-violet-600 mb-4" />
        <p className="text-muted-foreground animate-pulse">
          Syncing profile data...
        </p>
      </div>
    );
  }

  // 4. Render App
  return <>{children}</>;
}

export default AuthInitializer;