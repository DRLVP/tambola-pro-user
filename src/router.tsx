import { createBrowserRouter, Outlet } from 'react-router';

// Shared Layouts
import MainLayout from '@/layouts/main-layout';

// User Layouts
import DashboardLayout from '@/layouts/dashboard-layout';

// Auth Components
import { UserRoute } from '@/components/auth/user-route';
import { AuthInitializer } from '@/components/auth/auth-initializer';

// User Auth Pages
import UserSignInPage from '@/pages/auth/sign-in/page';
import SSOCallback from '@/pages/auth/sso-callback/page';

// Shared Public Pages
import HomePage from '@/pages/home/page';

// Shared Support Pages
import HowToPlayPage from '@/pages/support/how-to-play';
import RulesPage from '@/pages/support/rules';
import FAQPage from '@/pages/support/faq';
import ContactPage from '@/pages/support/contact';

// Shared Legal Pages
import PrivacyPage from '@/pages/legal/privacy';
import TermsPage from '@/pages/legal/terms';
import DisclaimerPage from '@/pages/legal/disclaimer';

// User Dashboard Pages
import UserDashboard from '@/pages/dashboard/page';
import UserGames from '@/pages/dashboard/games';
import UserProfile from '@/pages/dashboard/profile';

// User Lobby & Game Pages
import LobbyPage from '@/pages/lobby/page';
import GameRoom from '@/pages/game/[id]/page';
import PurchaseTicket from '@/pages/game/purchase';
import GameResults from '@/pages/game/results';

// Shared Error Page
import NotFound from '@/pages/not-found';

const router = createBrowserRouter([
  {
    element: (
      <AuthInitializer>
        <Outlet />
      </AuthInitializer>
    ),
    children: [
      // Auth Routes (Public)
      { path: '/sign-in/*', element: <UserSignInPage /> },
      { path: '/sso-callback', element: <SSOCallback /> },

      // Public Routes
      {
        path: '/',
        element: <MainLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'lobby', element: <LobbyPage /> },
          { path: 'game/:id', element: <GameRoom /> },
          { path: 'game/purchase/:gameId', element: <PurchaseTicket /> },
          { path: 'game/results/:gameId', element: <GameResults /> },
          // Support Pages
          { path: 'how-to-play', element: <HowToPlayPage /> },
          { path: 'rules', element: <RulesPage /> },
          { path: 'faq', element: <FAQPage /> },
          { path: 'contact', element: <ContactPage /> },
          // Legal Pages
          { path: 'privacy', element: <PrivacyPage /> },
          { path: 'terms', element: <TermsPage /> },
          { path: 'disclaimer', element: <DisclaimerPage /> },
        ],
      },

      // User Dashboard Routes (Protected)
      {
        path: '/dashboard',
        element: (
          <UserRoute>
            <DashboardLayout />
          </UserRoute>
        ),
        children: [
          { index: true, element: <UserDashboard /> },
          { path: 'games', element: <UserGames /> },
          { path: 'profile', element: <UserProfile /> },
        ],
      },

      // 404
      { path: '*', element: <NotFound /> },
    ],
  },
]);



export default router;
