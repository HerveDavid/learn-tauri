import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import * as Effect from 'effect/Effect';
import { SettingsClient } from '@/services/common/settings-client';
import { LiveManagedRuntime } from '@/services/live-layer';

const KEY_THEME_SETTING = 'theme-preference';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  runtime: LiveManagedRuntime | null;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setRuntime: (runtime: LiveManagedRuntime) => void;
}

const getSystemTheme = (): 'light' | 'dark' => 
  window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

const applyTheme = (theme: Theme): 'light' | 'dark' => {
  const actualTheme = theme === 'system' ? getSystemTheme() : theme;
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(actualTheme);
  return actualTheme;
};

const getStoredTheme = (): Theme => {
  try {
    return (localStorage.getItem(KEY_THEME_SETTING) as Theme) || 'system';
  } catch {
    return 'system';
  }
};

const initialTheme = getStoredTheme();
const initialActualTheme = applyTheme(initialTheme);

export const useThemeStore = create<ThemeStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      theme: initialTheme,
      actualTheme: initialActualTheme,
      runtime: null,
      
      setTheme: (theme: Theme) => {
        const actualTheme = applyTheme(theme);
        set({ theme, actualTheme });
        
        try {
          localStorage.setItem(KEY_THEME_SETTING, theme);
        } catch {}
      },
      
      toggleTheme: () => {
        const { theme } = get();
        const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
        get().setTheme(next);
      },
      
      setRuntime: (runtime) => {
        set({ runtime });
        syncWithRuntime(runtime);
      },
    })),
    { name: 'theme-store' },
  ),
);

const syncWithRuntime = async (runtime: LiveManagedRuntime) => {
  try {
    const effect = Effect.gen(function* () {
      const client = yield* SettingsClient;
      return yield* client.getSetting<Theme>(KEY_THEME_SETTING);
    });
    
    const savedTheme = await runtime.runPromise(effect);
    if (savedTheme && savedTheme !== useThemeStore.getState().theme) {
      useThemeStore.getState().setTheme(savedTheme);
    }
  } catch {}
};

window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const { theme } = useThemeStore.getState();
  if (theme === 'system') {
    useThemeStore.getState().setTheme('system');
  }
});

useThemeStore.subscribe(
  (state) => ({ theme: state.theme, runtime: state.runtime }),
  async ({ theme, runtime }) => {
    if (!runtime) return;
    
    try {
      const effect = Effect.gen(function* () {
        const client = yield* SettingsClient;
        yield* client.setSetting(KEY_THEME_SETTING, theme);
      });
      await runtime.runPromise(effect);
    } catch {}
  },
  { fireImmediately: false }
);