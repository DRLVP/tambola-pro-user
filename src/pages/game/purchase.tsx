import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { toast } from 'sonner';
import { ArrowLeft, Ticket, Minus, Plus, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { gameService } from '@/services/game.service';
import { ticketService } from '@/services/ticket.service';
import type { Game } from '@/types';

export default function PurchaseTicket() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchGame() {
      try {
        if (!gameId) return;
        const response = await gameService.getGame(gameId);
        setGame(response.data);
      } catch (error) {
        toast.error("Failed to load game details");
        navigate('/lobby');
      } finally {
        setLoading(false);
      }
    }
    fetchGame();
  }, [gameId, navigate]);

  const handlePurchase = async () => {
    if (!game) return;

    try {
      setPurchasing(true);
      await ticketService.purchaseTickets({
        gameId: game._id,
        quantity
      });

      toast.success("Tickets booked successfully! Awaiting Admin confirmation.");

      // Redirect to dashboard where they can see the 'pending' ticket
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

  const maxTickets = game.settings?.maxTicketsPerUser || 6;
  const totalPrice = quantity * game.ticketPrice;

  return (
    <div className="container mx-auto py-8 px-4">
      <Link to="/lobby">
        <Button variant="ghost" className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Lobby
        </Button>
      </Link>

      <div className="max-w-md mx-auto space-y-6">
        <Card className="border-2 border-violet-100 dark:border-violet-900/50 shadow-xl">
          <CardHeader className="bg-violet-50/50 dark:bg-violet-900/20 pb-6">
            <CardTitle className="text-2xl text-center text-violet-700 dark:text-violet-300">
              {game.name}
            </CardTitle>
            <CardDescription className="text-center">
              Hosted by {game.hostName}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Status Info */}
            <Alert className="bg-amber-50 border-amber-200 text-amber-800">
              <Info className="h-4 w-4" />
              <AlertTitle>Allocation Process</AlertTitle>
              <AlertDescription>
                Tickets are booked temporarily. They will be permanently allocated once the Admin confirms your booking.
              </AlertDescription>
            </Alert>

            {/* Ticket Counter */}
            <div className="flex flex-col items-center gap-4 py-4">
              <span className="text-sm font-medium text-muted-foreground">
                How many tickets do you want?
              </span>

              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || purchasing}
                >
                  <Minus className="h-5 w-5" />
                </Button>

                <div className="w-16 text-center">
                  <span className="text-3xl font-bold">{quantity}</span>
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full"
                  onClick={() => setQuantity(q => Math.min(maxTickets, q + 1))}
                  disabled={quantity >= maxTickets || purchasing}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Maximum {maxTickets} tickets allowed per player
              </p>
            </div>

            <Separator />

            {/* Price Calculation */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per ticket</span>
                <span>{game.ticketPrice} XP</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="font-semibold">Total Amount</span>
                <Badge variant="secondary" className="text-lg px-3 py-1 bg-violet-100 text-violet-700 hover:bg-violet-100">
                  {totalPrice} XP
                </Badge>
              </div>
            </div>

          </CardContent>

          <CardFooter className="pb-6">
            <Button
              className="w-full h-12 text-lg gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-violet-500/25"
              onClick={handlePurchase}
              disabled={purchasing}
            >
              {purchasing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Booking...
                </>
              ) : (
                <>
                  <Ticket className="h-5 w-5" />
                  Book {quantity} Ticket{quantity > 1 ? 's' : ''}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}