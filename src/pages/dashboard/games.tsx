import { useState, useEffect } from 'react';
import { Ticket, Trophy, Clock, Search, Filter, AlertCircle, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ticketService } from '@/services/ticket.service';
import type { Ticket as TicketType, TicketStatus } from '@/types';
import { TambolaTicket } from '@/components/tambola-ticket';

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

// Safely extract game name: handles populated gameId object OR plain gameName string
function getGameName(ticket: any): string {
  if (ticket.gameName) return ticket.gameName;
  if (ticket.gameId && typeof ticket.gameId === 'object' && ticket.gameId.name) {
    return ticket.gameId.name;
  }
  return 'Tambola Game';
}

// Safely format a date: tries purchasedAt then createdAt, guards against Invalid Date
function formatDate(ticket: any): string {
  const raw = ticket.purchasedAt ?? ticket.createdAt;
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function UserGames() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<TicketType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all');

  // Modal state
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketService.getMyTickets({ page: 1, limit: 100 });
      if (response.success && response.data) {
        setTickets(response.data);
      }
    } catch (err) {
      toast.error('Failed to load tickets');
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewTicket = (ticket: TicketType) => {
    setSelectedTicket(ticket);
    setIsTicketModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsTicketModalOpen(false);
    // Delay clearing selectedTicket to allow dialog close animation
    setTimeout(() => setSelectedTicket(null), 300);
  };

  // Derived stats
  const totalTickets = tickets.length;
  const pendingTickets = tickets.filter(t => t.status === 'pending').length;
  const totalXpWon = tickets.reduce(
    (sum, t) => sum + ((t as any).winnerInfo?.prizeAmount ?? 0),
    0
  );

  // Filtering
  const filteredTickets = tickets.filter(t => {
    const gameName = getGameName(t);
    const matchesSearch = gameName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">My Tickets</h1>
        <p className="text-muted-foreground">View all your purchased tickets and their status</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Ticket className="h-8 w-8 mx-auto mb-2 text-violet-500" />
            <p className="text-2xl font-bold">{totalTickets}</p>
            <p className="text-sm text-muted-foreground">Total Tickets</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold">{pendingTickets}</p>
            <p className="text-sm text-muted-foreground">Pending (Awaiting Admin)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
            <p className="text-2xl font-bold text-emerald-600">{totalXpWon.toLocaleString()} XP</p>
            <p className="text-sm text-muted-foreground">Total XP Won</p>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Ticket History</CardTitle>
              <CardDescription>All your purchased tickets and their current status</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by game..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-[200px]"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as 'all' | TicketStatus)}
              >
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">No Win</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket #</TableHead>
                <TableHead>Game Name</TableHead>
                <TableHead>Purchased</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Prize Won</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow
                  key={ticket._id}
                  className="cursor-pointer hover:bg-violet-50/60 dark:hover:bg-violet-950/20 transition-colors"
                  onClick={() => handleViewTicket(ticket)}
                >
                  <TableCell>
                    <span className="font-semibold text-violet-700 dark:text-violet-400">
                      {ticket.ticketNumber != null
                        ? `Ticket #${ticket.ticketNumber}`
                        : 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {getGameName(ticket)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDate(ticket)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <TicketStatusBadge status={ticket.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {ticket.winnerInfo?.prizeAmount ? (
                      <span className="font-semibold text-emerald-600">
                        +{ticket.winnerInfo.prizeAmount.toLocaleString()} XP
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {(ticket.status === 'active' || ticket.status === 'confirmed') && (
                      <Link
                        to={`/game/${typeof ticket.gameId === 'object' ? (ticket.gameId as any)._id : ticket.gameId}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button size="sm" variant="outline" className="gap-1.5 text-green-600 border-green-300 hover:bg-green-50">
                          Join Game
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTickets.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground font-medium">No tickets found</p>
              <p className="text-sm text-muted-foreground mt-1">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Head to the lobby and buy your first ticket!'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ticket View Modal */}
      <Dialog open={isTicketModalOpen} onOpenChange={(open) => { if (!open) handleCloseModal(); }}>
        <DialogContent className="max-w-lg">
          {selectedTicket && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 flex-wrap">
                  <DialogTitle>
                    {selectedTicket.ticketNumber != null
                      ? `Ticket #${selectedTicket.ticketNumber}`
                      : 'Ticket'}
                  </DialogTitle>
                  <TicketStatusBadge status={selectedTicket.status} />
                </div>
                <DialogDescription className="flex flex-col gap-0.5">
                  <span>{getGameName(selectedTicket)}</span>
                  <span className="text-xs text-muted-foreground">
                    Purchased: {formatDate(selectedTicket)}
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div className="mt-2">
                <TambolaTicket ticket={selectedTicket} />
              </div>

              {selectedTicket.winnerInfo && (
                <div className="mt-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300">
                  🏆 <strong>Winner!</strong> — {selectedTicket.winnerInfo.ruleName} ·{' '}
                  +{selectedTicket.winnerInfo.prizeAmount.toLocaleString()} XP
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserGames;
