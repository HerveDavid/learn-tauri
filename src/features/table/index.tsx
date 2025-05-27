import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect } from 'react';

import { Button } from '@/components/ui/button';
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

const CHANNEL_ID = 'events-log';
const HANDLER_ID = 'event-handler';

export default function Component() {
  const events = useAtomValue(eventsAtom);
  const addEvent = useSetAtom(addEventAtom);

  const handleEvent = useCallback(
    (event: Event) => {
      addEvent(event);
    },
    [addEvent],
  );

  const { start, pause, connect, disconnect, isStarted } = useChannel<Event>({
    channelId: CHANNEL_ID,
    handlerId: HANDLER_ID,
    handler: handleEvent,
    autoConnect: false,
  });

  const startClick = useCallback(async () => {
    try {
      await connect();
      await start();

      console.log('Streaming started');
    } catch (error) {
      console.error('Erreur lors du démarrage:', error);
    }
  }, [connect, start]);

  const stopClick = useCallback(async () => {
    try {
      await pause();
      await disconnect();

      console.log('Streaming stopped');
    } catch (error) {
      console.error("Erreur lors de l'arrêt:", error);
    }
  }, [disconnect, pause]);

  return (
    <div className="bg-background">
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
