import { useCallback } from "react";
import { Effect } from "effect";
import { useAtomValue, useSetAtom } from "jotai";
import { invoke } from "@tauri-apps/api/core";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { addEventAtom, eventsAtom } from "./primitive";
import { Event } from "../../shared/event";
import { Button } from "@/components/ui/button";
import { useChannel } from "@/lib/channel";

const start = (id: string) =>
  Effect.gen(function* () {
    return yield* Effect.tryPromise({
      try: () => invoke("start", { id }),
      catch: console.error,
    });
  });

const pause = (id: string) =>
  Effect.gen(function* () {
    return yield* Effect.tryPromise({
      try: () => invoke("pause", { id }),
      catch: console.error,
    });
  });

const CHANNEL_ID = "events-log";
const HANDLER_ID = "event-handler";

export default function Component() {
  const events = useAtomValue(eventsAtom);
  const addEvent = useSetAtom(addEventAtom);

  const handleEvent = useCallback(
    (event: Event) => {
      addEvent(event);
    },
    [addEvent]
  );

  const { connect, disconnect, isConnected } = useChannel<Event>({
    channelId: CHANNEL_ID,
    handlerId: HANDLER_ID,
    handler: handleEvent,
    autoConnect: false,
  });

  const startClick = useCallback(async () => {
    try {
      await connect();

      await Effect.runPromise(start(CHANNEL_ID));

      console.log("Streaming started");
    } catch (error) {
      console.error("Erreur lors du démarrage:", error);
    }
  }, [connect]);

  const stopClick = useCallback(async () => {
    try {
      await Effect.runPromise(pause(CHANNEL_ID));

      await disconnect();

      console.log("Streaming stopped");
    } catch (error) {
      console.error("Erreur lors de l'arrêt:", error);
    }
  }, [disconnect]);

  return (
    <div className="bg-background">
      <div className="space-x-2 flex items-center p-2">
        <Button onClick={startClick} disabled={isConnected}>
          Start
        </Button>
        <Button onClick={stopClick} variant="secondary" disabled={!isConnected}>
          Stop
        </Button>
        <p>{isConnected ? "🔴 Live" : "🟢 No Record"}</p>
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
