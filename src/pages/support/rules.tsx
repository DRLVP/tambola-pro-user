import { Link } from 'react-router';
import { ArrowLeft, Scale, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const generalRules = [
  'Each Tambola ticket contains 15 numbers arranged in 3 rows and 9 columns',
  'Numbers range from 1 to 90',
  'Numbers are called randomly one at a time',
  'Players must mark the called number on their ticket if present',
  'The first player to complete a winning pattern and claim it wins the prize',
  'Each winning pattern can only be won by one player per game',
  'Games continue until all winning patterns have been claimed',
];

const claimRules = [
  'Claims must be made immediately after completing a pattern',
  'Late claims will not be accepted once the next number is called',
  'The system automatically verifies all claims',
  'False claims may result in account penalties',
  'Valid claims are announced to all players',
];

const prohibitedActions = [
  'Using multiple accounts in the same game',
  'Attempting to manipulate the game system',
  'Sharing tickets with other players during a game',
  'Using automated tools or bots to play',
  'Abusive behavior towards other players or hosts',
];

export function RulesPage() {
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
            <Scale className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Game Rules</h1>
            <p className="text-muted-foreground">Official rules and guidelines for playing Tambola Pro</p>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <Card className="mb-12 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6 flex items-start gap-4">
          <Info className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
          <p className="text-lg leading-relaxed">
            These rules ensure fair play for all participants. By playing Tambola Pro, you agree to
            abide by these rules. Violations may result in account suspension or termination.
          </p>
        </CardContent>
      </Card>

      {/* General Rules */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              General Game Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {generalRules.map((rule, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-sm font-medium text-green-700 dark:text-green-400 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Claim Rules */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Claiming Prizes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {claimRules.map((rule, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-sm font-medium text-amber-700 dark:text-amber-400 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Prohibited Actions */}
      <section className="mb-12">
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <XCircle className="h-5 w-5" />
              Prohibited Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {prohibitedActions.map((action, index) => (
                <li key={index} className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Fair Play Notice */}
      <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border-violet-200 dark:border-violet-800">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-lg mb-3">🎯 Fair Play Commitment</h3>
          <p className="text-muted-foreground">
            Tambola Pro is committed to providing a fair and enjoyable gaming experience for all players.
            Our random number generator is certified and ensures completely random number selection.
            All players have an equal chance of winning.
          </p>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="text-center mt-12">
        <Link to="/lobby">
          <Button size="lg" className="gap-2">
            Start Playing
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default RulesPage;
