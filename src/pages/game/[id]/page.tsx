
import { useEffect } from 'react';
import { useParams, Navigate } from 'react-router';
import { useSocketStore } from '@/stores/socket-store';
import { Card } from '@/components/ui/card';

export default function GameRoom() {
  const { id } = useParams();
  const { initializeSocket, joinGame, leaveGame, isConnected } = useSocketStore();

  useEffect(() => {
    initializeSocket();
    if (id) {
      joinGame(id);
    }

    return () => {
      if (id) {
        leaveGame(id);
      }
    };
  }, [id, initializeSocket, joinGame, leaveGame]);

  if (!id) return <Navigate to="/lobby" />;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Game Room: {id}</h1>
        <div className={`flex items-center gap-2 ${isConnected ? 'text-green-500' : 'text-red-500'}`}>
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8 space-y-6">
          <Card className="min-h-[400px] flex items-center justify-center">
            Game Board Area
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card className="p-4">
            Game Stats & Chat
          </Card>
        </div>
      </div>
    </div>
  );
}
