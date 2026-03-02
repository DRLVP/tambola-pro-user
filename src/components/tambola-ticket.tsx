import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { Ticket } from '@/types';

interface TambolaTicketProps {
  ticket: Ticket;
  className?: string;
  /** Show "Booked by username" badge + status flag (for public game view) */
  showOwner?: boolean;
}

export function TambolaTicket({ ticket, className, showOwner = false }: TambolaTicketProps) {
  const { numbers, markedNumbers } = ticket;

  // Guard: ensure numbers is a valid 3×9 matrix
  if (!numbers || numbers.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
        Ticket numbers not available.
      </div>
    );
  }

  // Status config for the badge
  const statusConfig: Record<string, { label: string; color: string }> = {
    available: { label: 'Available', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300' },
    pending: { label: 'Temporary', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
    confirmed: { label: 'Confirmed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    active: { label: 'Confirmed', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' },
    won: { label: 'Winner 🏆', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 font-bold' },
    lost: { label: 'No Win', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' },
  };

  const statusCfg = statusConfig[ticket.status] || { label: ticket.status, color: '' };
  const isBooked = ticket.userName && ticket.status !== 'available';

  return (
    <div
      className={cn(
        'rounded-2xl border-2 shadow-lg',
        ticket.status === 'won'
          ? 'border-emerald-400 dark:border-emerald-600 shadow-emerald-500/20'
          : 'border-violet-300 dark:border-violet-700 shadow-violet-500/10',
        'bg-gradient-to-br from-white to-violet-50 dark:from-zinc-900 dark:to-violet-950',
        'p-3 sm:p-4 w-full',
        className
      )}
    >
      {/* Ticket header strip — with ticket number + owner badge */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg px-3 py-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-white text-xs font-bold tracking-widest uppercase">
            {ticket.ticketNumber != null ? `Ticket #${ticket.ticketNumber}` : 'Tambola Ticket'}
          </span>
          {showOwner && (
            <Badge className={cn('text-[10px] px-2 py-0.5', statusCfg.color)}>
              {statusCfg.label}
            </Badge>
          )}
        </div>

        {/* Booked by username */}
        {showOwner && isBooked && (
          <div className="mt-1 flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center text-[8px] font-bold text-white">
              {ticket.userName!.charAt(0).toUpperCase()}
            </div>
            <span className="text-white/90 text-[11px] font-medium">
              Booked by <strong>{ticket.userName}</strong>
            </span>
            {ticket.status === 'pending' && (
              <span className="text-amber-200 text-[9px] italic ml-auto">(Temporary)</span>
            )}
            {(ticket.status === 'confirmed' || ticket.status === 'active') && (
              <span className="text-green-200 text-[9px] font-semibold ml-auto">✓ Confirmed</span>
            )}
          </div>
        )}

        {/* Available ticket — no user */}
        {showOwner && !isBooked && ticket.status === 'available' && (
          <div className="mt-1">
            <span className="text-white/60 text-[11px] italic">Not yet booked</span>
          </div>
        )}
      </div>

      {/* Grid: 9 columns, 3 rows */}
      <div className="grid grid-cols-9 gap-0.5 sm:gap-1">
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
                  'text-[11px] sm:text-xs md:text-sm font-bold select-none transition-all duration-200',
                  isEmpty
                    ? 'bg-muted/30 dark:bg-zinc-800/40'
                    : isMarked
                      ? // Daubed / marked number
                      'bg-violet-500 text-white shadow-md shadow-violet-400/40 ring-2 ring-violet-300 dark:ring-violet-600 scale-105 animate-bounce-in'
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
