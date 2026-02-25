import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  Gamepad2,
  Ticket,
  Clock,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Hourglass,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { StatsCard } from '@/components/stats-card';
import { userService } from '@/services/user.service';
import { ticketService } from '@/services/ticket.service';
import type { User, Ticket as TicketType, TicketStatus } from '@/types';

// Reuse the same status badge logic as the tickets page
function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const config: Record<TicketStatus, { label: string; className: string }> = {
    pending: {
      label: 'Pending',
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    },
    confirmed: {
      label: 'Confirmed',
      className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    },
    active: {
      label: 'Active',
      className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    },
    won: {
      label: 'Won 🏆',
      className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-semibold',
    },
    lost: {
      label: 'No Win',
      className: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    },
    cancelled: {
      label: 'Cancelled',
      className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    },
  };

  const { label, className } = config[status] ?? { label: status, className: '' };
  return <Badge className={className}>{label}</Badge>;
}

export function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [recentTickets, setRecentTickets] = useState<TicketType[]>([]);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch user profile for stats
      const profileResponse = await userService.getProfile();
      if (profileResponse.success && profileResponse.data) {
        setProfile(profileResponse.data);
      }

      // Fetch tickets: latest 3 for "Recent Tickets" section
      const recentResponse = await ticketService.getMyTickets({ page: 1, limit: 3 });
      if (recentResponse.success && recentResponse.data) {
        setRecentTickets(recentResponse.data);
      }

      // Fetch all tickets to calculate per-status counts
      const allTicketsResponse = await ticketService.getMyTickets({ page: 1, limit: 100 });
      if (allTicketsResponse.success && allTicketsResponse.data) {
        const all = allTicketsResponse.data;
        setConfirmedCount(all.filter(t => t.status === 'active').length);
        setPendingCount(all.filter(t => t.status === 'pending').length);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard';
      setError(errorMessage);
      toast.error('Unable to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6 flex items-center gap-2 text-destructive">
          <AlertCircle className="h-4 w-4" />
          <p>{error}. Please try refreshing the page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 border-0 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl" />
        </div>
        <CardContent className="py-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}! 👋
              </h1>
              <p className="text-white/80">Ready for another exciting game?</p>
            </div>
            <Link to="/lobby">
              <Button className="gap-2 bg-white text-violet-700 hover:bg-white/90 shadow-lg">
                <Gamepad2 className="h-4 w-4" />
                Play Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid — 4 specific status-based cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Confirmed Tickets"
          value={confirmedCount}
          icon={CheckCircle2}
          iconClassName="bg-gradient-to-br from-green-500 to-emerald-500"
          description="Status: Active"
        />
        <StatsCard
          title="Pending Tickets"
          value={pendingCount}
          icon={Hourglass}
          iconClassName="bg-gradient-to-br from-amber-500 to-orange-400"
          description="Awaiting admin confirmation"
        />
        <StatsCard
          title="Total Winnings"
          value={`₹${(profile?.totalWinnings || 0).toLocaleString()}`}
          icon={TrendingUp}
          iconClassName="bg-gradient-to-br from-green-500 to-emerald-500"
        />
        <StatsCard
          title="Games Played"
          value={profile?.gamesPlayed || 0}
          icon={Gamepad2}
          description="All time"
        />
      </div>

      {/* Recent Tickets */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">Recent Tickets</CardTitle>
            <CardDescription>Your 3 most recently purchased tickets</CardDescription>
          </div>
          <Link to="/dashboard/games">
            <Button variant="ghost" size="sm" className="gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentTickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Ticket className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No tickets purchased yet</p>
              <Link to="/lobby">
                <Button variant="outline" size="sm" className="mt-4">
                  Browse Games
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <div
                  key={ticket._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                      <Ticket className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium">{ticket.gameName ?? 'Tambola Game'}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        {/* Clean sequential ticket number badge */}
                        <Badge
                          variant="outline"
                          className="text-xs font-semibold text-violet-700 border-violet-300 bg-violet-50 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-700"
                        >
                          {ticket.ticketNumber != null
                            ? `Ticket #${ticket.ticketNumber}`
                            : 'Ticket #N/A'}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(ticket.purchasedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <TicketStatusBadge status={ticket.status} />
                    {ticket.winnerInfo?.prizeAmount ? (
                      <p className="text-sm font-semibold text-emerald-600 mt-1">
                        +{ticket.winnerInfo.prizeAmount.toLocaleString()} XP
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center">
                <Gamepad2 className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">Join a Game</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse available games in the lobby and join the fun!
                </p>
                <Link to="/lobby">
                  <Button variant="outline" size="sm" className="gap-1">
                    Go to Lobby
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Ticket className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">My Tickets</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check your ticket history, status and winnings!
                </p>
                <Link to="/dashboard/games">
                  <Button variant="outline" size="sm" className="gap-1">
                    View Tickets
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UserDashboard;