import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ArrowLeft, Ticket, Loader2, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { gameService } from '@/services/game.service';
import { ticketService } from '@/services/ticket.service';
import type { Game } from '@/types';
import { cn } from '@/lib/utils';

export default function PurchaseTicket() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  // Ticket selection state
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
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
          setAvailableNumbers(ticketRes.data.available);
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
    <div className="container mx-auto py-8 px-4">
      <Link to="/lobby">
        <Button variant="ghost" className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Lobby
        </Button>
      </Link>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Game Info Header */}
        <Card className="border-2 border-violet-100 dark:border-violet-900/50 shadow-xl">
          <CardHeader className="bg-violet-50/50 dark:bg-violet-900/20 pb-4">
            <CardTitle className="text-2xl text-center text-violet-700 dark:text-violet-300">
              {game.name}
            </CardTitle>
            <CardDescription className="text-center">
              Hosted by {game.hostName} • ₹{game.ticketPrice} per ticket
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Info Alert */}
            <Alert className="bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200">
              <Info className="h-4 w-4" />
              <AlertTitle>Select Your Lucky Numbers</AlertTitle>
              <AlertDescription>
                Tap the ticket numbers you want to book. You can select up to {maxPerUser} tickets.
                Tickets will be confirmed by Admin.
              </AlertDescription>
            </Alert>

            {/* Selection Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground">
                  Selected: <strong className="text-violet-600">{selectedNumbers.length}</strong>/{maxPerUser}
                </span>
                <span className="text-muted-foreground">
                  Available: <strong className="text-green-600">{availableNumbers.length}</strong>/{totalTickets}
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

            {/* Ticket Grid */}
            <div className="grid grid-cols-10 gap-1.5">
              {Array.from({ length: totalTickets }, (_, i) => i + 1).map((num) => {
                const isAvailable = availableNumbers.includes(num);
                const isBooked = bookedNumbers.includes(num);
                const isSelected = selectedNumbers.includes(num);

                return (
                  <button
                    key={num}
                    disabled={!isAvailable || purchasing}
                    onClick={() => toggleTicket(num)}
                    className={cn(
                      'aspect-square rounded-lg font-semibold text-xs sm:text-sm flex items-center justify-center transition-all duration-200',
                      isSelected
                        ? 'bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/40 scale-105 ring-2 ring-violet-300'
                        : isAvailable
                          ? 'bg-white dark:bg-zinc-800 text-foreground border-2 border-green-200 dark:border-green-800 hover:border-violet-400 hover:shadow-md cursor-pointer'
                          : isBooked
                            ? 'bg-red-50 dark:bg-red-950/30 text-red-300 dark:text-red-700 border border-red-200 dark:border-red-900 cursor-not-allowed opacity-60'
                            : 'bg-muted text-muted-foreground cursor-not-allowed opacity-40'
                    )}
                  >
                    {num}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 rounded border-2 border-green-300 bg-white dark:bg-zinc-800" />
                Available
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 rounded bg-gradient-to-br from-violet-500 to-indigo-600" />
                Selected
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 rounded bg-red-50 border border-red-200 opacity-60" />
                Booked
              </div>
            </div>

            {/* Selected Tickets Display */}
            {selectedNumbers.length > 0 && (
              <div className="rounded-xl border-2 border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-950/20 p-4">
                <p className="text-sm font-medium mb-2 text-violet-700 dark:text-violet-300">
                  <CheckCircle2 className="h-4 w-4 inline mr-1" />
                  Your Selected Tickets:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedNumbers.map(num => (
                    <Badge
                      key={num}
                      className="bg-violet-600 text-white hover:bg-violet-700 cursor-pointer px-3 py-1"
                      onClick={() => toggleTicket(num)}
                    >
                      #{num} ×
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
                  ₹{totalPrice}
                </Badge>
              </div>
            )}
          </CardContent>

          <CardFooter className="pb-6">
            <Button
              className="w-full h-12 text-lg gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25"
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
                    ? `Book ${selectedNumbers.length} Ticket${selectedNumbers.length > 1 ? 's' : ''} — ₹${totalPrice}`
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