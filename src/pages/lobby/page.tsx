import { useState, useEffect } from 'react';
import { Search, RefreshCw, Gamepad2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GameCard } from '@/components/game-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { gameService } from '@/services/game.service';
import type { Game } from '@/types';

export function LobbyPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'waiting' | 'active' | 'completed'>('all');

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await gameService.getAvailableGames();

      if (response.success && response.data) {
        setGames(response.data);
      } else {
        setError('Failed to load games');
        toast.error('Failed to load games');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch games';
      setError(errorMessage);
      toast.error('Unable to load games. Please try again.');
      console.error('Error fetching games:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const filteredGames = games.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.hostName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || game.status === filter;
    return matchesSearch && matchesFilter;
  });

  const handleRefresh = () => {
    fetchGames();
  };

  const statusCounts = {
    all: games.length,
    waiting: games.filter(g => g.status === 'waiting').length,
    active: games.filter(g => g.status === 'active').length,
    completed: games.filter(g => g.status === 'completed').length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Game Lobby</h1>
        <p className="text-muted-foreground">
          Browse and join available Tambola games
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search games or hosts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="gap-1.5">
                <span className="hidden sm:inline">All</span>
                <Badge variant="secondary" className="h-5 px-1.5">{statusCounts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="waiting" className="gap-1.5">
                <span className="hidden sm:inline">Waiting</span>
                <Badge variant="secondary" className="h-5 px-1.5">{statusCounts.waiting}</Badge>
              </TabsTrigger>
              <TabsTrigger value="active" className="gap-1.5">
                <span className="hidden sm:inline">Live</span>
                <Badge variant="secondary" className="h-5 px-1.5">{statusCounts.active}</Badge>
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-1.5">
                <span className="hidden sm:inline">Ended</span>
                <Badge variant="secondary" className="h-5 px-1.5">{statusCounts.completed}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="icon" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-destructive mb-6">
          <CardContent className="pt-6 flex items-center gap-2 text-destructive">
            <AlertCircle className="h-4 w-4" />
            <p>{error}. Please try refreshing or check your connection.</p>
          </CardContent>
        </Card>
      )}

      {/* Games Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-4 border rounded-xl">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
              </div>
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : filteredGames.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Gamepad2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No games found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "Try adjusting your search or filter"
              : "There are no games available at the moment"
            }
          </p>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}

export default LobbyPage;
