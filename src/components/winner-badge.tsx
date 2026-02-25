import { Trophy, Crown, Medal, Award, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { TicketWinnerInfo, PrizePattern } from '@/types';
import { PATTERN_DEFINITIONS } from '@/lib/game-rules';

interface WinnerBadgeProps {
  winnerInfo: TicketWinnerInfo;
  variant?: 'compact' | 'full' | 'card';
  className?: string;
}

// Position icons
const positionIcons: Record<number, React.ComponentType<{ className?: string }>> = {
  1: Crown,
  2: Medal,
  3: Award,
};

// Position colors
const positionColors: Record<number, { bg: string; text: string; border: string }> = {
  1: {
    bg: 'from-amber-400 to-yellow-500',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-300 dark:border-amber-600',
  },
  2: {
    bg: 'from-gray-300 to-gray-400',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-300 dark:border-gray-500',
  },
  3: {
    bg: 'from-amber-600 to-amber-700',
    text: 'text-amber-800 dark:text-amber-400',
    border: 'border-amber-400 dark:border-amber-600',
  },
};

// Get ordinal suffix (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// Get pattern display name
function getPatternName(pattern: PrizePattern): string {
  return PATTERN_DEFINITIONS[pattern]?.name || pattern.replace('_', ' ');
}

/**
 * Compact badge for inline display
 */
function CompactBadge({ winnerInfo }: { winnerInfo: TicketWinnerInfo }) {
  const PositionIcon = positionIcons[winnerInfo.position] || Star;
  const colors = positionColors[winnerInfo.position] || positionColors[3];

  return (
    <Badge
      className={cn(
        'gap-1 px-2 py-1',
        'bg-gradient-to-r',
        colors.bg,
        'text-white border-0 shadow-sm'
      )}
    >
      <PositionIcon className="h-3 w-3" />
      <span className="font-bold">{getOrdinalSuffix(winnerInfo.position)}</span>
      <span className="hidden sm:inline">- {getPatternName(winnerInfo.pattern)}</span>
    </Badge>
  );
}

/**
 * Full badge with all details
 */
function FullBadge({ winnerInfo, className }: { winnerInfo: TicketWinnerInfo; className?: string }) {
  const PositionIcon = positionIcons[winnerInfo.position] || Star;
  const colors = positionColors[winnerInfo.position] || positionColors[3];
  const isTopThree = winnerInfo.position <= 3;

  return (
    <div className={cn(
      'inline-flex items-center gap-3 px-4 py-2 rounded-lg border',
      'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
      colors.border,
      className
    )}>
      {/* Position icon */}
      <div className={cn(
        'h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shrink-0',
        'bg-gradient-to-br',
        colors.bg
      )}>
        {isTopThree ? (
          <PositionIcon className="h-5 w-5" />
        ) : (
          <span>{winnerInfo.position}</span>
        )}
      </div>

      {/* Details */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={cn('font-bold', colors.text)}>
            {getOrdinalSuffix(winnerInfo.position)} Place
          </span>
          <Badge variant="secondary" className="text-xs">
            {getPatternName(winnerInfo.pattern)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {winnerInfo.gameName} • {winnerInfo.ruleName}
        </p>
      </div>

      {/* Prize amount */}
      <div className="text-right shrink-0">
        <p className="text-lg font-bold text-green-600 dark:text-green-400">
          ₹{winnerInfo.prizeAmount.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

/**
 * Card variant for prominent display
 */
function CardBadge({ winnerInfo, className }: { winnerInfo: TicketWinnerInfo; className?: string }) {
  const PositionIcon = positionIcons[winnerInfo.position] || Star;
  const colors = positionColors[winnerInfo.position] || positionColors[3];
  const isTopThree = winnerInfo.position <= 3;

  return (
    <Card className={cn(
      'overflow-hidden border-2',
      colors.border,
      className
    )}>
      <div className={cn(
        'h-2 w-full bg-gradient-to-r',
        colors.bg
      )} />
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Trophy icon with animation */}
          <div className={cn(
            'h-14 w-14 rounded-full flex items-center justify-center text-white font-bold shrink-0',
            'bg-gradient-to-br shadow-lg',
            colors.bg,
            isTopThree && 'ring-4 ring-amber-200 dark:ring-amber-800'
          )}>
            {isTopThree ? (
              <PositionIcon className="h-7 w-7" />
            ) : (
              <span className="text-xl">{winnerInfo.position}</span>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className={cn('font-bold text-lg', colors.text)}>
                {getOrdinalSuffix(winnerInfo.position)} Place Winner
              </span>
            </div>
            <p className="text-sm font-medium">
              {winnerInfo.ruleName} ({getPatternName(winnerInfo.pattern)})
            </p>
            <p className="text-xs text-muted-foreground truncate">
              Game: {winnerInfo.gameName}
            </p>
          </div>

          {/* Prize amount */}
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground">Prize Won</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ₹{winnerInfo.prizeAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Winner Badge Component
 * Displays winner position, game name, rule/pattern, and prize amount
 */
export function WinnerBadge({ winnerInfo, variant = 'compact', className }: WinnerBadgeProps) {
  switch (variant) {
    case 'compact':
      return <CompactBadge winnerInfo={winnerInfo} />;
    case 'full':
      return <FullBadge winnerInfo={winnerInfo} className={className} />;
    case 'card':
      return <CardBadge winnerInfo={winnerInfo} className={className} />;
    default:
      return <CompactBadge winnerInfo={winnerInfo} />;
  }
}

export default WinnerBadge;
