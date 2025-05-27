import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useChannel } from '@/hooks/use-channel';

import { Event } from '../../types/event';

import { addEventAtom, eventsAtom } from './primitive';
import { channels } from '@/config/channels';
import { Button } from '@/components/ui/button';

const HANDLER_ID = 'event-handler';

export default function EventsLog() {
  const events = useAtomValue(eventsAtom);
  const addEvent = useSetAtom(addEventAtom);

  const handleEvent = useCallback(
    (event: Event) => {
      addEvent(event);
    },
    [addEvent],
  );

  const { start, pause, connect, disconnect, isStarted } = useChannel<Event>({
    channelId: channels.log.events,
    handlerId: HANDLER_ID,
    handler: handleEvent,
    autoConnect: false,
  });

  const startClick = useCallback(async () => {
    await connect();
    await start();
  }, [connect, start]);

  const stopClick = useCallback(async () => {
    await pause();
    await disconnect();
  }, [pause, disconnect]);

  return (
    <div>
      <div className="space-x-2 flex items-center p-2">
        <Button onClick={startClick} disabled={isStarted}>
          Start
        </Button>
        <Button onClick={stopClick} variant="secondary" disabled={!isStarted}>
          Stop
        </Button>
        <p>{isStarted ? '🔴 Live' : '🟢 Standby'}</p>
      </div>
      <div className="[&>div]:max-h-96 border-t">
        <Table className="border-separate border-spacing-0 [&_td]:border-border [&_tfoot_td]:border-t [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none">
          <TableHeader className="sticky top-0 z-10 bg-background backdrop-blur-sm shadow">
            <TableRow className="hover:bg-transparent">
              <TableHead>Date</TableHead>
              <TableHead>Id</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
            {events.map((item, index) => (
              <TableRow
                key={`${item.timestamp}-${index}`}
                className="border-none odd:bg-muted/50 hover:bg-transparent odd:hover:bg-muted/50"
              >
                <TableCell className="font-medium">{item.timestamp}</TableCell>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
