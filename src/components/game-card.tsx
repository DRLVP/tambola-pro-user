import { Link, useNavigate } from 'react-router';
import { useAuth, useUser } from '@clerk/clerk-react';
import { Users, Clock, Trophy, ArrowRight, Ticket } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Game } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface GameCardProps {
  game: Game;
  className?: string;
}

export function GameCard({ game, className }: GameCardProps) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const statusColors = {
    waiting: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  };

  const statusLabels = {
    waiting: 'Waiting',
    active: 'Live Now',
    completed: 'Completed',
    cancelled: 'Cancelled',
    paused: 'Paused',
  };

  const prizeTotal = game.prizes ? game.prizes.reduce((sum: number, prize: any) => sum + prize.amount, 0) : 0;

  const handleBuyTicket = (e: React.MouseEvent) => {
    e.preventDefault();
    // Check if user session and user data are available
    if (!isSignedIn || !user) {
      // Redirect to login if user session or data is not available
      navigate('/sign-in');
    } else {
      // Proceed to purchase page if user is authenticated
      navigate(`/game/purchase/${game._id}`);
    }
  };

  return (
    <Card className={cn('group hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 hover:-translate-y-1 border-2 hover:border-violet-500/20 overflow-hidden', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg line-clamp-1">{game.name}</CardTitle>
            <CardDescription className="line-clamp-1">
              Hosted by {game.hostName}
            </CardDescription>
          </div>
          <Badge className={cn('shrink-0', statusColors[game.status])}>
            {game.status === 'active' && (
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse" />
            )}
            {statusLabels[game.status]}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{game.currentPlayers || 0}/{game.maxPlayers} Seats</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Ticket className="h-4 w-4" />
            <span>{game.ticketPrice} XP</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Trophy className="h-4 w-4" />
            <span>{prizeTotal.toLocaleString()} XP Pool</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>
              {game.scheduledAt
                ? format(new Date(game.scheduledAt), 'hh:mm a')
                : 'Now'
              }
            </span>
          </div>
        </div>

        {/* Prize Patterns */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {game.prizes && game.prizes.slice(0, 4).map((prize: any) => (
            <Badge key={prize.id} variant="secondary" className="text-xs">
              {prize.name.replace('_', ' ')}
            </Badge>
          ))}
          {game.prizes && game.prizes.length > 4 && (
            <Badge variant="secondary" className="text-xs">
              +{game.prizes.length - 4} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {game.status === 'waiting' && (
          <Button
            className="w-full gap-2 group-hover:bg-violet-600 group-hover:text-white transition-colors"
            onClick={handleBuyTicket}
          >
            <Ticket className="h-4 w-4" />
            Buy Ticket
          </Button>
        )}
        {game.status === 'active' && (
          <Link to={`/game/${game._id}`} className="w-full">
            <Button className="w-full gap-2 bg-green-600 hover:bg-green-700">
              Watch Live
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
        {game.status === 'completed' && (
          <Link to={`/game/results/${game._id}`} className="w-full">
            <Button variant="outline" className="w-full gap-2">
              View Results
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
        {game.status === 'cancelled' && (
          <Button variant="outline" className="w-full" disabled>
            Game Cancelled
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default GameCard;