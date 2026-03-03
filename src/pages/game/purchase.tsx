import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ArrowLeft, Ticket, Loader2, Info, CheckCircle2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { gameService } from '@/services/game.service';
import { ticketService } from '@/services/ticket.service';
import type { Game } from '@/types';
import { cn } from '@/lib/utils';

// Ticket object from backend
interface AvailableTicket {
  ticketNumber: number;
  numbers: number[][]; // 3×9 matrix
}

export default function PurchaseTicket() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  // Ticket selection state
  const [availableTickets, setAvailableTickets] = useState<AvailableTicket[]>([]);
  const [bookedNumbers, setBookedNumbers] = useState<number[]>([]);
  const [totalTickets, setTotalTickets] = useState(0);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!gameId) return;

        const [gameRes, ticketRes] = await Promise.all([
          gameService.getGame(gameId),
          ticketService.getAvailableTickets(gameId)
        ]);

        if (gameRes.success) setGame(gameRes.data);
        if (ticketRes.success && ticketRes.data) {
          setAvailableTickets(ticketRes.data.available);
          setBookedNumbers(ticketRes.data.booked);
          setTotalTickets(ticketRes.data.total);
        }
      } catch (error) {
        toast.error("Failed to load game details");
        navigate('/lobby');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [gameId, navigate]);

  const toggleTicket = (num: number) => {
    if (!game) return;
    const maxPerUser = game.settings?.maxTicketsPerUser || 6;

    setSelectedNumbers(prev => {
      if (prev.includes(num)) {
        return prev.filter(n => n !== num);
      }
      if (prev.length >= maxPerUser) {
        toast.warning(`You can select maximum ${maxPerUser} tickets`);
        return prev;
      }
      return [...prev, num].sort((a, b) => a - b);
    });
  };

  const handlePurchase = async () => {
    if (!game || selectedNumbers.length === 0) return;

    try {
      setPurchasing(true);
      await ticketService.purchaseTickets({
        gameId: game._id,
        ticketNumbers: selectedNumbers
      });

      toast.success(`${selectedNumbers.length} ticket(s) booked successfully! Awaiting Admin confirmation.`);
      navigate('/dashboard/games');
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to purchase tickets");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!game) return null;

  const maxPerUser = game.settings?.maxTicketsPerUser || 6;
  const totalPrice = selectedNumbers.length * game.ticketPrice;

  return (
    <div className="container mx-auto py-6 sm:py-8 px-4">
      <Link to="/lobby">
        <Button variant="ghost" className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Lobby
        </Button>
      </Link>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Game Info Header */}
        <Card className="border-2 border-violet-100 dark:border-violet-900/50 shadow-xl">
          <CardHeader className="bg-violet-50/50 dark:bg-violet-900/20 pb-4">
            <CardTitle className="text-xl sm:text-2xl text-center text-violet-700 dark:text-violet-300">
              {game.name}
            </CardTitle>
            <CardDescription className="text-center">
              Hosted by {game.hostName} • {game.ticketPrice} XP per ticket
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Info Alert */}
            <Alert className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200">
              <Info className="h-4 w-4" />
              <AlertTitle>Select Your Lucky Tickets</AlertTitle>
              <AlertDescription>
                Tap on any ticket to select it. You can select up to {maxPerUser} tickets.
                Tickets will be confirmed by Admin.
              </AlertDescription>
            </Alert>

            {/* Selection Stats */}
            <div className="flex items-center justify-between text-sm flex-wrap gap-2">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-muted-foreground">
                  Selected: <strong className="text-violet-600">{selectedNumbers.length}</strong>/{maxPerUser}
                </span>
                <span className="text-muted-foreground">
                  Available: <strong className="text-green-600">{availableTickets.length}</strong>/{totalTickets}
                </span>
              </div>
              {selectedNumbers.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedNumbers([])}
                  className="text-xs text-muted-foreground"
                >
                  Clear All
                </Button>
              )}
            </div>

            {/* ── Ticket Cards Grid ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableTickets.map((ticket) => {
                const isSelected = selectedNumbers.includes(ticket.ticketNumber);

                return (
                  <button
                    key={ticket.ticketNumber}
                    disabled={purchasing}
                    onClick={() => toggleTicket(ticket.ticketNumber)}
                    className={cn(
                      'relative rounded-2xl p-3 sm:p-4 text-left transition-all duration-300 w-full',
                      'border-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400',
                      isSelected
                        ? 'border-violet-500 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/40 dark:to-indigo-950/40 shadow-lg shadow-violet-500/20 scale-[1.02] ring-2 ring-violet-300'
                        : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-violet-300 hover:shadow-md active:scale-[0.98]'
                    )}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg animate-bounce-in z-10">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                    )}

                    {/* Ticket Header */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm',
                          isSelected
                            ? 'bg-violet-600 text-white'
                            : 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300'
                        )}>
                          {ticket.ticketNumber}
                        </div>
                        <span className={cn(
                          'text-xs font-medium uppercase tracking-wider',
                          isSelected ? 'text-violet-600 dark:text-violet-400' : 'text-muted-foreground'
                        )}>
                          Ticket #{ticket.ticketNumber}
                        </span>
                      </div>
                      {isSelected && (
                        <Badge className="bg-violet-600 text-white text-[10px] px-2 py-0.5">Selected</Badge>
                      )}
                    </div>

                    {/* Ticket Numbers Grid — 9 columns, 3 rows */}
                    <div className="grid grid-cols-9 gap-0.5 sm:gap-1">
                      {ticket.numbers.map((row, rowIndex) =>
                        row.map((num, colIndex) => {
                          const isEmpty = num === 0;
                          return (
                            <div
                              key={`${rowIndex}-${colIndex}`}
                              className={cn(
                                'aspect-square flex items-center justify-center rounded-md text-[10px] sm:text-xs font-bold select-none',
                                isEmpty
                                  ? 'bg-gray-50 dark:bg-zinc-800/40'
                                  : isSelected
                                    ? 'bg-violet-100 dark:bg-violet-900/50 text-violet-800 dark:text-violet-200 border border-violet-200 dark:border-violet-700'
                                    : 'bg-gray-100 dark:bg-zinc-800 text-foreground border border-gray-200 dark:border-zinc-700'
                              )}
                            >
                              {isEmpty ? '' : num}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Booked ticket placeholders */}
              {bookedNumbers.map((num) => (
                <div
                  key={`booked-${num}`}
                  className="rounded-2xl p-3 sm:p-4 border-2 border-dashed border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/10 opacity-60"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center font-bold text-sm text-red-400">
                      {num}
                    </div>
                    <span className="text-xs font-medium text-red-400 uppercase tracking-wider">
                      Ticket #{num}
                    </span>
                    <Badge variant="secondary" className="text-[10px] bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 ml-auto">
                      <X className="h-3 w-3 mr-0.5" /> Booked
                    </Badge>
                  </div>
                  <div className="h-16 flex items-center justify-center text-xs text-muted-foreground">
                    This ticket has been booked by another player
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 rounded border-2 border-gray-200 bg-white dark:bg-zinc-900" />
                Available
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 rounded border-2 border-violet-500 bg-violet-50" />
                Selected
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 rounded border-2 border-dashed border-red-200 bg-red-50 opacity-60" />
                Booked
              </div>
            </div>

            {/* Selected Tickets Summary */}
            {selectedNumbers.length > 0 && (
              <div className="rounded-xl border-2 border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20 p-4 animate-fade-in-up">
                <p className="text-sm font-medium mb-2 text-violet-700 dark:text-violet-300">
                  <CheckCircle2 className="h-4 w-4 inline mr-1" />
                  Your Selected Tickets:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedNumbers.map(num => (
                    <Badge
                      key={num}
                      className="bg-violet-600 text-white hover:bg-violet-700 cursor-pointer px-3 py-1 gap-1"
                      onClick={(e) => { e.stopPropagation(); toggleTicket(num); }}
                    >
                      #{num} <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            {selectedNumbers.length > 0 && (
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="font-semibold text-lg">Total</span>
                <Badge variant="secondary" className="text-lg px-4 py-1.5 bg-violet-100 text-violet-700 hover:bg-violet-100">
                  {totalPrice} XP
                </Badge>
              </div>
            )}
          </CardContent>

          <CardFooter className="pb-6">
            <Button
              className="w-full h-12 text-base sm:text-lg gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25"
              onClick={handlePurchase}
              disabled={purchasing || selectedNumbers.length === 0}
            >
              {purchasing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <Ticket className="h-5 w-5" />
                  {selectedNumbers.length > 0
                    ? `Book ${selectedNumbers.length} Ticket${selectedNumbers.length > 1 ? 's' : ''} — ${totalPrice} XP`
                    : 'Select Tickets to Book'}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}