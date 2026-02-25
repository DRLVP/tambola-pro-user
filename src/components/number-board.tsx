import { cn } from '@/lib/utils';

interface NumberBoardProps {
  calledNumbers: number[];
  lastCalledNumber?: number | null;
  className?: string;
}

export function NumberBoard({ calledNumbers, lastCalledNumber, className }: NumberBoardProps) {
  // Generate numbers 1-90
  const numbers = Array.from({ length: 90 }, (_, i) => i + 1);

  // Split into rows of 10
  const rows = [];
  for (let i = 0; i < 9; i++) {
    rows.push(numbers.slice(i * 10, (i + 1) * 10));
  }

  return (
    <div className={cn('', className)}>
      <div className="grid gap-1.5">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1.5">
            {row.map((number) => {
              const isCalled = calledNumbers.includes(number);
              const isLast = number === lastCalledNumber;

              return (
                <div
                  key={number}
                  className={cn(
                    'h-9 w-9 md:h-10 md:w-10 rounded-lg font-semibold text-sm md:text-base flex items-center justify-center transition-all duration-300',
                    isCalled
                      ? isLast
                        ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/50 scale-110 ring-2 ring-amber-300'
                        : 'bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-md shadow-violet-500/25'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {number}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-muted" />
          <span className="text-muted-foreground">Not Called</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-gradient-to-br from-violet-500 to-indigo-500" />
          <span className="text-muted-foreground">Called</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded bg-gradient-to-br from-amber-500 to-orange-500" />
          <span className="text-muted-foreground">Latest</span>
        </div>
      </div>
    </div>
  );
}

export default NumberBoard;
