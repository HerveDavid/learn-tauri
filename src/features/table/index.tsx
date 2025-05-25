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

const start = (id: string, handler: (event: Event) => void) =>
  Effect.gen(function* () {
    return yield* Effect.tryPromise({
      try: () => {
        const channel = new Channel<Event>();
        channel.onmessage = handler;
        return invoke("start", { id, channel });
      },
      catch: console.error,
    });
  });

const stop = (id: string) =>
  Effect.gen(function* () {
    return yield* Effect.tryPromise({
      try: () => invoke("stop", { id }),
      catch: console.error,
    });
  });

const ID = "1";

export default function Component() {
  const [isStreaming, setIsStreaming] = useState(false);

  const events = useAtomValue(eventsAtom);
  const addEvent = useSetAtom(addEventAtom);

  const startClick = useCallback(async () => {
    try {
      setIsStreaming(true);
      await Effect.runPromise(start(ID, addEvent));
      console.log("started");
    } catch (error) {
      console.error("Erreur lors du démarrage:", error);
      setIsStreaming(false);
    }
  }, []);

  const stopClick = useCallback(async () => {
    try {
      await Effect.runPromise(stop(ID));
      setIsStreaming(false);
      console.log("stopped");
    } catch (error) {
      console.error("Erreur lors de l'arrêt:", error);
    }
  }, []);

  return (
    <div className="bg-background">
      <div className="space-x-2 flex items-center p-2">
        <Button onClick={startClick}>Start</Button>
        <Button onClick={stopClick} variant="secondary">
          Stop
        </Button>
        <p>{(isStreaming && "🔴 Live") || "🟢 No Record"}</p>
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
          <TableBody>
            {events.map((item) => (
              <TableRow key={item.timestamp}>
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
