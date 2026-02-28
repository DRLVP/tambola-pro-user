
import { useEffect, useState, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router';
import { useSocketStore } from '@/stores/socket-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { NumberBoard } from '@/components/number-board';
import { TambolaTicket } from '@/components/tambola-ticket';
import { gameService } from '@/services/game.service';
import { ticketService } from '@/services/ticket.service';
import type { Game, Ticket } from '@/types';
import {
  Loader2,
  Volume2,
  VolumeX,
  Trophy,
  Hash,
  Users,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

// Voice announcement helper
function speak(text: string) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }
}

// Status badge colors
const statusColors: Record<string, string> = {
  waiting: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  paused: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  completed: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export default function GameRoom() {
  const { id } = useParams();
  const { initializeSocket, joinGame, leaveGame, isConnected, socket } = useSocketStore();

  // Game state
  const [game, setGame] = useState<Game | null>(null);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [lastNumber, setLastNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Voice announcement
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const voiceEnabledRef = useRef(voiceEnabled);
  voiceEnabledRef.current = voiceEnabled;

  // ──────────── Data Fetching ────────────
  useEffect(() => {
    if (!id) return;

    async function loadGameData() {
      try {
        setLoading(true);
        setError(null);

        const [gameRes, ticketsRes] = await Promise.all([
          gameService.getGame(id!),
          ticketService.getMyTickets({ gameId: id }).catch(() => ({ data: [], pagination: { total: 0 } })),
        ]);

        if (gameRes.success && gameRes.data) {
          setGame(gameRes.data);
          setCalledNumbers(gameRes.data.calledNumbers || []);
          if (gameRes.data.calledNumbers?.length > 0) {
            setLastNumber(gameRes.data.calledNumbers[gameRes.data.calledNumbers.length - 1]);
          }
        }

        const tickets = Array.isArray(ticketsRes.data) ? ticketsRes.data : [];
        setMyTickets(tickets);
      } catch (err) {
        console.error('Failed to load game data:', err);
        setError('Failed to load game data');
      } finally {
        setLoading(false);
      }
    }

    loadGameData();
  }, [id]);

  // ──────────── Socket Connection ────────────
  useEffect(() => {
    initializeSocket();
  }, [initializeSocket]);

  useEffect(() => {
    if (isConnected && id) {
      joinGame(id);
      return () => {
        leaveGame(id);
      };
    }
  }, [isConnected, id, joinGame, leaveGame]);

  // ──────────── Socket Event Listeners ────────────
  useEffect(() => {
    if (!socket || !id) return;

    // Number called — update board + announce
    const handleNumberCalled = (data: { number: number; gameId: string } | number) => {
      const num = typeof data === 'object' ? data.number : data;

      setCalledNumbers(prev => {
        if (prev.includes(num)) return prev;
        return [...prev, num];
      });
      setLastNumber(num);

      // Update tickets — auto-mark if number is on the ticket
      setMyTickets(prev =>
        prev.map(ticket => {
          const flat = ticket.numbers.flat();
          if (flat.includes(num) && !ticket.markedNumbers.includes(num)) {
            return { ...ticket, markedNumbers: [...ticket.markedNumbers, num] };
          }
          return ticket;
        })
      );

      // Voice announcement
      if (voiceEnabledRef.current) {
        speak(`Number ${num}`);
      }
    };

    // Winner claimed
    const handleWinnerClaimed = (data: { gameId: string; prize: any }) => {
      if (voiceEnabledRef.current && data.prize?.name) {
        setTimeout(() => {
          speak(`${data.prize.name} won by ${data.prize.winner?.userName || 'a player'}!`);
        }, 500);
      }

      // Refresh game data to get updated rules/winners
      gameService.getGame(id!).then(res => {
        if (res.success && res.data) {
          setGame(res.data);
        }
      }).catch(console.error);
    };

    // Game started
    const handleGameStarted = () => {
      setGame(prev => prev ? { ...prev, status: 'active', startedAt: new Date().toISOString() } : null);
      if (voiceEnabledRef.current) {
        speak('Game has started! Good luck!');
      }
    };

    // Game ended
    const handleGameEnded = () => {
      setGame(prev => prev ? { ...prev, status: 'completed', endedAt: new Date().toISOString() } : null);
      if (voiceEnabledRef.current) {
        speak('Game has ended! Thank you for playing!');
      }
    };

    // Game paused
    const handleGamePaused = () => {
      setGame(prev => prev ? { ...prev, status: 'paused' } : null);
      if (voiceEnabledRef.current) {
        speak('Game has been paused');
      }
    };

    // Game resumed
    const handleGameResumed = () => {
      setGame(prev => prev ? { ...prev, status: 'active' } : null);
      if (voiceEnabledRef.current) {
        speak('Game has resumed');
      }
    };

    // Register all listeners
    socket.on('game:number-called', handleNumberCalled);
    socket.on('game:winner-claimed', handleWinnerClaimed);
    socket.on('game:started', handleGameStarted);
    socket.on('game:ended', handleGameEnded);
    socket.on('game:paused', handleGamePaused);
    socket.on('game:resumed', handleGameResumed);

    return () => {
      socket.off('game:number-called', handleNumberCalled);
      socket.off('game:winner-claimed', handleWinnerClaimed);
      socket.off('game:started', handleGameStarted);
      socket.off('game:ended', handleGameEnded);
      socket.off('game:paused', handleGamePaused);
      socket.off('game:resumed', handleGameResumed);
    };
  }, [socket, id]);

  // ──────────── Render ────────────
  if (!id) return <Navigate to="/lobby" />;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <Loader2 className="h-10 w-10 animate-spin text-violet-500" />
        <p className="text-muted-foreground">Loading game...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="text-muted-foreground">{error || 'Game not found'}</p>
        <Link to="/lobby">
          <Button>Back to Lobby</Button>
        </Link>
      </div>
    );
  }

  const sortedRules = [...(game.rules || [])].sort((a, b) => a.order - b.order);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{game.name}</h1>
            <Badge className={statusColors[game.status] || ''}>
              {game.status === 'active' && (
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse" />
              )}
              {game.status.charAt(0).toUpperCase() + game.status.slice(1)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {calledNumbers.length}/90 numbers called
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Socket status */}
          <div className={`flex items-center gap-2 text-sm ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
            <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            {isConnected ? 'Live' : 'Disconnected'}
          </div>
          {/* Voice toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="gap-2"
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {voiceEnabled ? 'Voice On' : 'Voice Off'}
          </Button>
        </div>
      </div>

      {/* ── Last Called Number (prominent) ── */}
      {game.status === 'active' && (
        <div className="flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 border-2 border-violet-200 dark:border-violet-700">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Last Called</span>
            <span className="text-6xl font-black text-violet-700 dark:text-violet-300 tabular-nums">
              {lastNumber || '--'}
            </span>
            {game.settings?.autoPlay && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Auto-play every {Math.round((game.settings.autoPlayInterval || 5000) / 1000)}s
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Main Grid ── */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Number Board (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Hash className="h-5 w-5 text-violet-500" />
                Number Board
              </CardTitle>
            </CardHeader>
            <CardContent>
              <NumberBoard
                calledNumbers={calledNumbers}
                lastCalledNumber={lastNumber}
              />
            </CardContent>
          </Card>

          {/* My Tickets */}
          {myTickets.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">My Tickets ({myTickets.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {myTickets.map((ticket) => (
                    <TambolaTicket key={ticket._id} ticket={ticket} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Game Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-violet-500" />
                Game Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Host</span>
                <span className="text-sm font-medium">{game.hostName || 'Admin'}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Ticket Price</span>
                <span className="text-sm font-medium">₹{game.ticketPrice}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Numbers Called</span>
                <span className="text-sm font-medium">{calledNumbers.length}/90</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">My Tickets</span>
                <span className="text-sm font-medium">{myTickets.length}</span>
              </div>
            </CardContent>
          </Card>

          {/* Rules & Winners */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Prizes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sortedRules.map((rule) => (
                <div
                  key={rule.id}
                  className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-colors ${rule.isCompleted
                    ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800'
                    : 'bg-muted/30 border-transparent'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    {rule.isCompleted ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium">{rule.name}</p>
                      {rule.isCompleted && rule.winner && (
                        <p className="text-xs text-muted-foreground">
                          Won by {rule.winner.userName}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-green-600">₹{rule.prizeAmount}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Waiting State ── */}
      {game.status === 'waiting' && (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
            <span className="text-amber-700 dark:text-amber-300 font-medium">
              Waiting for the host to start the game...
            </span>
          </div>
        </div>
      )}

      {/* ── Completed State ── */}
      {game.status === 'completed' && (
        <Card className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
          <CardContent className="flex flex-col items-center py-8 gap-4">
            <Trophy className="h-12 w-12 text-amber-500" />
            <h2 className="text-2xl font-bold">Game Complete!</h2>
            <p className="text-muted-foreground">All prizes have been awarded.</p>
            <Link to="/lobby">
              <Button className="mt-2">Back to Lobby</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
