// import { useState, useMemo, useCallback, useEffect, useRef, memo } from "react";
// import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
// import { invoke, Channel } from "@tauri-apps/api/core";
// import { Effect } from "effect";
// import UplotReact from 'uplot-react';
// import 'uplot/dist/uPlot.min.css';

// interface Event {
//   id: string;
//   value: number;
//   timestamp: string;
// }

// export const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: Infinity,
//       gcTime: Infinity,
//       refetchOnWindowFocus: false,
//       refetchOnMount: false,
//       refetchOnReconnect: false,
//     },
//   },
// });

// const MAX_EVENTS = 100;
// const BATCH_DELAY = 8;
// const ID = "1";
// const QUERY_KEY = ['events', ID];

// const start = (id: string, handler: (event: Event) => void) => Effect.gen(function*() {
//   return yield* Effect.tryPromise({
//     try: () => {
//       const channel = new Channel<Event>();
//       channel.onmessage = handler;
//       return invoke('start', { id, channel });
//     },
//     catch: console.error,
//   });
// });

// const stop = (id: string) => Effect.gen(function*() {
//   return yield* Effect.tryPromise({
//     try: () => invoke('stop', { id }),
//     catch: console.error,
//   });
// });

// const MemoizedChart = memo(({ options, data }: { options: any; data: any }) => (
//   <UplotReact
//     options={options}
//     data={data}
//     onCreate={(chart) => console.log("Chart created", chart)}
//     onDelete={(chart) => console.log("Chart deleted", chart)}
//   />
// ));

// export default function Chart() {
//   const [isStreaming, setIsStreaming] = useState(false);
//   const queryClient = useQueryClient();
//   const pendingEvents = useRef<Event[]>([]);
//   const flushTimeout = useRef<ReturnType<typeof setTimeout>>();

//   const { data: events = [] } = useQuery({
//     queryKey: QUERY_KEY,
//     queryFn: () => [],
//     initialData: [],
//   });

//   const flushEvents = useCallback(() => {
//     if (!pendingEvents.current.length) return;

//     const eventsToAdd = [...pendingEvents.current];
//     pendingEvents.current.length = 0;

//     queryClient.setQueryData(QUERY_KEY, (oldEvents: Event[] = []) => {
//       const updated = [...oldEvents, ...eventsToAdd];
//       return updated.length > MAX_EVENTS ? updated.slice(-MAX_EVENTS) : updated;
//     });
//   }, [queryClient]);

//   const updateEvents = useCallback((newEvent: Event) => {
//     pendingEvents.current.push(newEvent);

//     if (!flushTimeout.current) {
//       flushTimeout.current = setTimeout(() => {
//         flushTimeout.current = undefined;
//         flushEvents();
//       }, BATCH_DELAY);
//     }
//   }, [flushEvents]);

//   const plotData = useMemo(() => {
//     if (!events.length) return [[], []];

//     const len = events.length;
//     const timestamps = new Array(len);
//     const values = new Array(len);

//     for (let i = 0; i < len; i++) {
//       timestamps[i] = new Date(events[i].timestamp).getTime() / 1000;
//       values[i] = events[i].value;
//     }

//     return [timestamps, values];
//   }, [events]);

//   const options = useMemo(() => ({
//     width: 600,
//     height: 400,
//     scales: {
//       x: { time: true },
//       y: { range: (u: any, dataMin: number, dataMax: number) => [dataMin * 0.9, dataMax * 1.1] },
//     },
//     axes: [
//       {
//         label: "Time",
//         values: (u: any, vals: number[]) => vals.map(v =>
//           new Date(v * 1000).toLocaleTimeString('fr-FR', {
//             hour: '2-digit',
//             minute: '2-digit',
//             second: '2-digit'
//           })
//         ),
//         space: 80,
//         size: 50,
//       },
//       { label: "Value", size: 60 }
//     ],
//     series: [
//       { label: "Time" },
//       {
//         label: "Value",
//         stroke: 'blue',
//         width: 1,
//         points: { show: false },
//       },
//     ],
//   }), []);

//   const startClick = useCallback(async () => {
//     try {
//       setIsStreaming(true);
//       await Effect.runPromise(start(ID, updateEvents));
//       console.log("started");
//     } catch (error) {
//       console.error("Erreur lors du démarrage:", error);
//       setIsStreaming(false);
//     }
//   }, [updateEvents]);

//   const stopClick = useCallback(async () => {
//     try {
//       if (flushTimeout.current) {
//         clearTimeout(flushTimeout.current);
//         flushEvents();
//       }

//       await Effect.runPromise(stop(ID));
//       setIsStreaming(false);
//       console.log("stopped");
//     } catch (error) {
//       console.error("Erreur lors de l'arrêt:", error);
//     }
//   }, [flushEvents]);

//   useEffect(() => {
//     return () => {
//       if (flushTimeout.current) {
//         clearTimeout(flushTimeout.current);
//       }
//       if (isStreaming) {
//         Effect.runPromise(stop(ID)).catch(console.error);
//       }
//     };
//   }, [isStreaming]);

//   return (
//     <div>
//       <div>
//         <button onClick={startClick} disabled={isStreaming}>Start</button>
//         <button onClick={stopClick} disabled={!isStreaming}>Stop</button>
//       </div>
//       <div>
//         <MemoizedChart options={options} data={plotData} />
//       </div>
//     </div>
//   );
// }
