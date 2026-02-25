
import { useParams, Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy } from 'lucide-react';

export default function GameResults() {
  const { gameId } = useParams();

  return (
    <div className="container mx-auto py-8">
      <Link to="/lobby">
        <Button variant="ghost" className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Lobby
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            <CardTitle>Game Results</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p>Results for game: {gameId}</p>
          {/* Winners list would go here */}
        </CardContent>
      </Card>
    </div>
  );
}
