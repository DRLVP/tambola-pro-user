import { cn } from '@/lib/utils';
import type { Ticket } from '@/types';

interface TambolaTicketProps {
  ticket: Ticket;
  className?: string;
}

export function TambolaTicket({ ticket, className }: TambolaTicketProps) {
  const { numbers, markedNumbers } = ticket;

  // Guard: ensure numbers is a valid 3×9 matrix
  if (!numbers || numbers.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
        Ticket numbers not available.
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-2xl border-2 border-violet-300 dark:border-violet-700 shadow-lg shadow-violet-500/10',
        'bg-gradient-to-br from-white to-violet-50 dark:from-zinc-900 dark:to-violet-950',
        'p-3 sm:p-4 w-full',
        className
      )}
    >
      {/* Ticket header strip */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg px-3 py-1.5 mb-3 text-center">
        <span className="text-white text-xs font-bold tracking-widest uppercase">Tambola Ticket</span>
      </div>

      {/* Grid: 9 columns, 3 rows */}
      <div className="grid grid-cols-9 gap-1">
        {numbers.map((row, rowIndex) =>
          row.map((num, colIndex) => {
            const isEmpty = num === 0;
            const isMarked = !isEmpty && markedNumbers.includes(num);

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={cn(
                  // Base: square cells
                  'aspect-square flex items-center justify-center rounded-md',
                  'text-xs sm:text-sm font-bold select-none transition-all duration-150',
                  isEmpty
                    ? 'bg-muted/30 dark:bg-zinc-800/40'
                    : isMarked
                      ? // Daubed / marked number
                      'bg-violet-500 text-white shadow-md shadow-violet-400/40 ring-2 ring-violet-300 dark:ring-violet-600 scale-105'
                      : // Normal number cell
                      'bg-white dark:bg-zinc-800 text-foreground border border-violet-200 dark:border-violet-800 shadow-sm'
                )}
              >
                {isEmpty ? '' : num}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom strip */}
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-violet-500" />
          Marked
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-white dark:bg-zinc-800 border border-violet-200 dark:border-violet-800" />
          Number
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-sm bg-muted/30 dark:bg-zinc-800/40" />
          Empty
        </span>
      </div>
    </div>
  );
}

export default TambolaTicket;
