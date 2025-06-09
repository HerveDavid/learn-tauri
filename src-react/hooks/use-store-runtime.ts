import React from 'react';
import { LiveManagedRuntime } from '@/services/live-layer';
import { useRuntime } from '@/services/runtime/use-runtime';

export interface StoreRuntime {
  runtime: LiveManagedRuntime | null;
  setRuntime: (runtime: LiveManagedRuntime) => void;
}

export function useStoreRuntime<T extends StoreRuntime>(
    useStore: () => T
): T {
    const store = useStore();
    const runtime = useRuntime();

    React.useEffect(() => {
        if (runtime && !store.runtime) {
            store.setRuntime(runtime)
        }
    }, [runtime, store])

    return store
}
