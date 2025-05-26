import { useCallback, useState } from "react";
import { Effect } from "effect";
import { useAtomValue, useSetAtom } from "jotai";
import { invoke, Channel } from "@tauri-apps/api/core";
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

const register = (id: string, channel: Channel<Event>) =>
  Effect.gen(function* () {
    return yield* Effect.tryPromise({
      try: () => invoke("register", { id, channel }),
      catch: console.error,
    });
  });

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

const CHANNEL_ID = "event-stream-1"; // ID du canal
const HANDLER_ID = "event-handler"; // ID du handler

export default function Component() {
  const [isStreaming, setIsStreaming] = useState(false);
  const events = useAtomValue(eventsAtom);
  const addEvent = useSetAtom(addEventAtom);

  // Handler pour les événements reçus
  const handleEvent = useCallback(
    (event: Event) => {
      console.log("Event received:", event);
      addEvent(event);
    },
    [addEvent]
  );

  // Utilisation du hook avec channelId et handler
  const { setChannel } = useChannel<Event>({
    channelId: CHANNEL_ID,
    handlerId: HANDLER_ID,
    handler: handleEvent,
  });

  const startClick = useCallback(async () => {
    try {
      setIsStreaming(true);

      // Créer un nouveau canal
      const newChannel = new Channel<Event>();

      // Enregistrer le canal dans le service (ceci va automatiquement
      // connecter le handler via le hook useChannel)
      setChannel(newChannel);

      // Enregistrer le canal côté backend
      await Effect.runPromise(register("1", newChannel));

      // Démarrer le streaming
      await Effect.runPromise(start("1"));

      console.log("Streaming started");
    } catch (error) {
      console.error("Erreur lors du démarrage:", error);
      setIsStreaming(false);
    }
  }, [setChannel]);

  const stopClick = useCallback(async () => {
    try {
      await Effect.runPromise(pause("1"));

      setIsStreaming(false);
      console.log("Streaming stopped");
    } catch (error) {
      console.error("Erreur lors de l'arrêt:", error);
    }
  }, []);

  return (
    <div className="bg-background">
      <div className="space-x-2 flex items-center p-2">
        <Button onClick={startClick} disabled={isStreaming}>
          Start
        </Button>
        <Button onClick={stopClick} variant="secondary" disabled={!isStreaming}>
          Stop
        </Button>
        <p>{isStreaming ? "🔴 Live" : "🟢 No Record"}</p>
        <p className="text-sm text-muted-foreground">Events: {events.length}</p>
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
                key={`${item.timestamp}-${index}`} // Clé plus robuste
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
