import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  Trophy,
  Users,
  Gamepad2,
  Zap,
  Shield,
  Star,
  ArrowRight,
  Play,
  Gift,
  Clock,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { gameService } from '@/services/game.service';
import { GameCard } from '@/components/game-card';
import type { Game } from '@/types';

const features = [
  {
    icon: Gamepad2,
    title: 'Easy to Play',
    description: 'Simple rules and intuitive interface make it easy for everyone to join and play.',
  },
  {
    icon: Users,
    title: 'Play with Friends',
    description: 'Invite your friends and family to join the game for a fun-filled experience.',
  },
  {
    icon: Zap,
    title: 'Real-time Action',
    description: 'Live number calling and instant updates keep the excitement going.',
  },
  {
    icon: Shield,
    title: 'Fair & Secure',
    description: 'Random number generation ensures fair play for everyone.',
  },
  {
    icon: Gift,
    title: 'Win Prizes',
    description: 'Multiple winning patterns mean more chances to claim victory!',
  },
  {
    icon: Clock,
    title: 'Games Anytime',
    description: 'Join games 24/7.',
  },
];

const winningPatterns = [
  { name: 'Early Five', description: 'First to mark 5 numbers', color: 'bg-amber-500' },
  { name: 'Top Line', description: 'Complete the first row', color: 'bg-blue-500' },
  { name: 'Middle Line', description: 'Complete the middle row', color: 'bg-green-500' },
  { name: 'Bottom Line', description: 'Complete the last row', color: 'bg-purple-500' },
  { name: 'Corners', description: 'All four corner numbers', color: 'bg-pink-500' },
  { name: 'Full House', description: 'Complete all numbers!', color: 'bg-red-500' },
];

const testimonials = [
  {
    name: 'Rahul S.',
    avatar: 'RS',
    role: 'Regular Player',
    content: 'Best Tambola experience online! The interface is so smooth and the games are super fun.',
    rating: 5,
  },
  {
    name: 'Priya M.',
    avatar: 'PM',
    role: 'Game Host',
    content: 'Love hosting games for my family gatherings. Everyone enjoys it so much!',
    rating: 5,
  },
  {
    name: 'Amit K.',
    avatar: 'AK',
    role: 'Winner',
    content: 'Won my first Full House yesterday! The excitement was unreal. Highly recommend!',
    rating: 5,
  },
];

export function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [gamesLoading, setGamesLoading] = useState(true);

  useEffect(() => {
    async function fetchGames() {
      try {
        const res = await gameService.getAvailableGames();
        if (res.success && res.data) {
          setGames(Array.isArray(res.data) ? res.data : []);
        }
      } catch { /* ignore */ }
      finally { setGamesLoading(false); }
    }
    fetchGames();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Available Games Section (Moved to top, Hero removed) */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-violet-50/50 to-white dark:from-violet-950/20 dark:to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Tambola Online
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join an ongoing game or check back later!
            </p>
          </div>


          {gamesLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-violet-500 mb-4" />
              <p className="text-lg text-muted-foreground font-medium animate-pulse">Checking for available games...</p>
            </div>
          ) : games.length === 0 ? (
            <div className="max-w-xl mx-auto bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border-2 border-dashed border-violet-200 dark:border-violet-900 rounded-3xl p-12 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-violet-100 dark:bg-violet-900/40 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-12 w-12 text-violet-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No Games available right now.</h3>
              <p className="text-lg text-muted-foreground mb-8">
                The host hasn't started any games yet. Please wait here, a new game will begin shortly!
              </p>
              <Button onClick={() => window.location.reload()} variant="outline" size="lg" className="gap-2">
                <Zap className="h-4 w-4" />
                Refresh Page
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {games.slice(0, 6).map((game) => (
                <GameCard key={game._id} game={game} />
              ))}
            </div>
          )}

          {games.length > 6 && (
            <div className="text-center mt-8">
              <Link to="/lobby">
                <Button variant="outline" size="lg" className="gap-2">
                  View All Games
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Play Tambola Pro?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover what makes our platform the best place to enjoy Tambola online
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300 hover:-translate-y-1 border-2 hover:border-violet-500/20 cursor-pointer"
                >
                  <CardHeader>
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Play Section */}
      <section className="py-20 md:py-28 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How to Play</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started in 3 Easy Steps</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Playing Tambola has never been easier. Follow these simple steps!
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Join a Game', desc: 'Browse the lobby and join an available game that suits you.' },
                { step: '02', title: 'Get Your Ticket', desc: 'Receive your unique Tambola ticket with random numbers.' },
                { step: '03', title: 'Mark & Win', desc: 'Mark numbers as they\'re called and claim your prize!' },
              ].map((item, index) => (
                <div key={index} className="text-center relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl shadow-lg shadow-violet-500/25">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>

                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-violet-300" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Winning Patterns Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Prizes</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Winning Patterns</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Multiple ways to win! Complete these patterns to claim your prize.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {winningPatterns.map((pattern, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-full ${pattern.color} flex items-center justify-center mx-auto mb-3`}>
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-1">{pattern.name}</h3>
                  <p className="text-xs text-muted-foreground">{pattern.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Players Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of happy players who love playing Tambola Pro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative overflow-hidden cursor-pointer">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-violet-500/10 to-transparent rounded-bl-full" />
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.content}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-medium text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 border-0 overflow-hidden relative ">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
              <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
            </div>
            <CardContent className="py-16 md:py-20 relative z-10">
              <div className="text-center text-white max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Play?
                </h2>
                <p className="text-white/80 mb-8 text-lg">
                  Join a game now and experience the excitement of Tambola Pro!
                </p>
                <Link to="/lobby">
                  <Button
                    size="lg"
                    className="gap-2 bg-white text-violet-700 hover:bg-white/90 shadow-xl text-lg px-8 py-6 cursor-pointer"
                  >
                    <Gamepad2 className="h-5 w-5" />
                    Join a Game Now
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
