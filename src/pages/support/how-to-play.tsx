import { Link } from 'react-router';
import { ArrowLeft, Gamepad2, Users, Trophy, Ticket, Target, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const steps = [
  {
    step: 1,
    icon: Users,
    title: 'Join a Game',
    description: 'Browse the game lobby and find an active game to join. Each game has different ticket prices and prize pools.',
  },
  {
    step: 2,
    icon: Ticket,
    title: 'Get Your Ticket',
    description: 'Purchase a ticket to receive your unique Tambola card with random numbers between 1-90 arranged in a 3x9 grid.',
  },
  {
    step: 3,
    icon: Target,
    title: 'Mark Numbers',
    description: 'As numbers are called, mark them on your ticket. Numbers are called randomly one at a time.',
  },
  {
    step: 4,
    icon: Trophy,
    title: 'Claim Your Prize',
    description: 'When you complete a winning pattern, claim your prize immediately! Multiple patterns mean multiple chances to win.',
  },
];

const winningPatterns = [
  { name: 'Early Five', description: 'Be the first to mark any 5 numbers on your ticket', color: 'bg-amber-500' },
  { name: 'Top Line', description: 'Complete all numbers in the first (top) row', color: 'bg-blue-500' },
  { name: 'Middle Line', description: 'Complete all numbers in the middle row', color: 'bg-green-500' },
  { name: 'Bottom Line', description: 'Complete all numbers in the bottom (last) row', color: 'bg-purple-500' },
  { name: 'Corners', description: 'Mark all four corner numbers of your ticket', color: 'bg-pink-500' },
  { name: 'Full House', description: 'Mark ALL numbers on your entire ticket - the biggest prize!', color: 'bg-red-500' },
];

export function HowToPlayPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link to="/">
          <Button variant="ghost" className="gap-2 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
            <Gamepad2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">How to Play Tambola</h1>
            <p className="text-muted-foreground">Learn everything you need to start playing and winning!</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <Card className="mb-12 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border-violet-200 dark:border-violet-800">
        <CardContent className="pt-6">
          <p className="text-lg leading-relaxed">
            <strong>Tambola</strong> (also known as Housie or Bingo) is a fun and exciting game of chance where players
            mark off numbers on their tickets as they are randomly called out. The first player to complete a
            specific pattern wins a prize! It's easy to learn and incredibly entertaining.
          </p>
        </CardContent>
      </Card>

      {/* Steps */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Star className="h-6 w-6 text-violet-500" />
          Getting Started
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.step} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {step.step}
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                  </div>
                  <CardTitle className="text-xl mt-4">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Winning Patterns */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-500" />
          Winning Patterns
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {winningPatterns.map((pattern) => (
            <Card key={pattern.name} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full ${pattern.color} flex items-center justify-center flex-shrink-0`}>
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{pattern.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{pattern.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="mb-12">
        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Badge className="mt-1">1</Badge>
                <span>Stay focused and mark numbers quickly as they are called</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge className="mt-1">2</Badge>
                <span>Keep an eye on multiple winning patterns - you might be close to more than one!</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge className="mt-1">3</Badge>
                <span>Claim your prize immediately when you complete a pattern</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge className="mt-1">4</Badge>
                <span>Have fun! Tambola is a social game - enjoy playing with others</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <div className="text-center">
        <Link to="/lobby">
          <Button size="lg" className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
            <Gamepad2 className="h-5 w-5" />
            Start Playing Now
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default HowToPlayPage;
