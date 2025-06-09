import * as Effect from 'effect/Effect';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

import { useStoreRuntime } from '@/hooks/use-store-runtime';
import { SettingsClient } from '@/services/common/settings-client';
import { LiveManagedRuntime } from '@/services/live-layer';
import { Project } from '@/types/project';

const KEY_CURRENT_PROJECT = 'current-project';
const KEY_RECENT_PROJECTS = 'recent-projects';

export interface ProjectsStore {
  currentProject: string;
  currentProjectPath: string;
  currentConfigPath: string;
  currentIidmPath: string;
  recentProjects: Project[];
  runtime: LiveManagedRuntime | null;

  // Actions for current project
  setCurrentProject: (project: string) => void;
  setCurrentProjectPath: (path: string) => void;
  setCurrentConfigPath: (path: string) => void;
  setCurrentIidmPath: (path: string) => void;

  // Actions for recent projects
  addRecentProject: (project: Omit<Project, 'lastAccessed'>) => void;
  removeRecentProject: (projectPath: string) => void;
  switchToProject: (project: Project) => void;
  clearRecentProjects: () => void;
  getRecentProjectsSorted: () => Project[];

  // Runtime management
  setRuntime: (runtime: LiveManagedRuntime) => void;
}

// Helpers localStorage (fallback)
const getStoredCurrentProject = () => {
  try {
    const stored = localStorage.getItem(KEY_CURRENT_PROJECT);
    return stored
      ? JSON.parse(stored)
      : {
          currentProject: '',
          currentProjectPath: '',
          currentConfigPath: '',
          currentIidmPath: '',
        };
  } catch {
    return {
      currentProject: '',
      currentProjectPath: '',
      currentConfigPath: '',
      currentIidmPath: '',
    };
  }
};

const getStoredRecentProjects = (): Project[] => {
  try {
    const stored = localStorage.getItem(KEY_RECENT_PROJECTS);
    if (!stored) return [];

    const projects = JSON.parse(stored);
    return projects.map((p: any) => ({
      ...p,
      lastAccessed: new Date(p.lastAccessed),
    }));
  } catch {
    return [];
  }
};

// Init localStorage
const initialCurrentProject = getStoredCurrentProject();
const initialRecentProjects = getStoredRecentProjects();

export const useProjectsStore = () =>
  useStoreRuntime<ProjectsStore>(useProjectsStoreInner);

const useProjectsStoreInner = create<ProjectsStore>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Init
      ...initialCurrentProject,
      recentProjects: initialRecentProjects,
      runtime: null,

      // Actions for recent project
      setCurrentProject: (project: string) => {
        set({ currentProject: project });
        // Fallback localStorage
        const currentState = get();
        localStorage.setItem(
          KEY_CURRENT_PROJECT,
          JSON.stringify({
            currentProject: project,
            currentProjectPath: currentState.currentProjectPath,
            currentConfigPath: currentState.currentConfigPath,
            currentIidmPath: currentState.currentIidmPath,
          }),
        );
      },

      setCurrentProjectPath: (path: string) => {
        set({ currentProjectPath: path });
        // Fallback localStorage
        const currentState = get();
        localStorage.setItem(
          KEY_CURRENT_PROJECT,
          JSON.stringify({
            currentProject: currentState.currentProject,
            currentProjectPath: path,
            currentConfigPath: currentState.currentConfigPath,
            currentIidmPath: currentState.currentIidmPath,
          }),
        );
      },

      setCurrentConfigPath: (path: string) => {
        set({ currentConfigPath: path });
        // Fallback localStorage
        const currentState = get();
        localStorage.setItem(
          KEY_CURRENT_PROJECT,
          JSON.stringify({
            currentProject: currentState.currentProject,
            currentProjectPath: currentState.currentProjectPath,
            currentConfigPath: path,
            currentIidmPath: currentState.currentIidmPath,
          }),
        );
      },

      setCurrentIidmPath: (path: string) => {
        set({ currentIidmPath: path });
        // Fallback localStorage
        const currentState = get();
        localStorage.setItem(
          KEY_CURRENT_PROJECT,
          JSON.stringify({
            currentProject: currentState.currentProject,
            currentProjectPath: currentState.currentProjectPath,
            currentConfigPath: currentState.currentConfigPath,
            currentIidmPath: path,
          }),
        );
      },

      // Actions for recent projects
      addRecentProject: (project: Omit<Project, 'lastAccessed'>) => {
        const state = get();
        const existingIndex = state.recentProjects.findIndex(
          (p) => p.path === project.path,
        );

        const newProject: Project = {
          ...project,
          lastAccessed: new Date(),
        };

        let updatedProjects: Project[];

        if (existingIndex >= 0) {
          updatedProjects = [...state.recentProjects];
          updatedProjects[existingIndex] = newProject;
        } else {
          updatedProjects = [newProject, ...state.recentProjects];
          if (updatedProjects.length > 10) {
            updatedProjects = updatedProjects.slice(0, 10);
          }
        }

        set({ recentProjects: updatedProjects });

        // Fallback localStorage
        localStorage.setItem(
          KEY_RECENT_PROJECTS,
          JSON.stringify(
            updatedProjects.map((p) => ({
              ...p,
              lastAccessed: p.lastAccessed.toISOString(),
            })),
          ),
        );
      },

      removeRecentProject: (projectPath: string) => {
        const state = get();
        const updatedProjects = state.recentProjects.filter(
          (p) => p.path !== projectPath,
        );
        set({ recentProjects: updatedProjects });

        // Fallback localStorage
        localStorage.setItem(
          KEY_RECENT_PROJECTS,
          JSON.stringify(
            updatedProjects.map((p) => ({
              ...p,
              lastAccessed: p.lastAccessed.toISOString(),
            })),
          ),
        );
      },

      switchToProject: (project: Project) => {
        set({
          currentProject: project.name,
          currentProjectPath: project.path,
          currentConfigPath: project.configPath || '',
          currentIidmPath: project.iidmPath || '',
        });

        // Update date access
        get().addRecentProject({
          name: project.name,
          path: project.path,
          configPath: project.configPath,
          iidmPath: project.iidmPath,
        });
      },

      clearRecentProjects: () => {
        set({ recentProjects: [] });
        localStorage.removeItem(KEY_RECENT_PROJECTS);
      },

      getRecentProjectsSorted: () => {
        const state = get();
        return [...state.recentProjects].sort(
          (a, b) =>
            new Date(b.lastAccessed).getTime() -
            new Date(a.lastAccessed).getTime(),
        );
      },

      setRuntime: (runtime) => {
        set({ runtime });
        syncWithRuntime(runtime);
      },
    })),
    { name: 'projects-store' },
  ),
);

// Sync with Effect
const syncWithRuntime = async (runtime: LiveManagedRuntime) => {
  // Load current project
  const loadCurrentProjectEffect = Effect.gen(function* () {
    const client = yield* SettingsClient;
    return yield* client.getSetting<typeof initialCurrentProject>(
      KEY_CURRENT_PROJECT,
    );
  });

  // Load recent projects
  const loadRecentProjectsEffect = Effect.gen(function* () {
    const client = yield* SettingsClient;
    const projects = yield* client.getSetting<any[]>(KEY_RECENT_PROJECTS);
    return (
      projects?.map((p: any) => ({
        ...p,
        lastAccessed: new Date(p.lastAccessed),
      })) || []
    );
  });

  try {
    // Load from DB
    const [savedCurrentProject, savedRecentProjects] = await Promise.all([
      runtime.runPromise(loadCurrentProjectEffect).catch(() => null),
      runtime.runPromise(loadRecentProjectsEffect).catch(() => []),
    ]);

    const currentState = useProjectsStoreInner.getState();

    // Sync current project
    if (
      savedCurrentProject &&
      (savedCurrentProject.currentProject !== currentState.currentProject ||
        savedCurrentProject.currentProjectPath !==
          currentState.currentProjectPath ||
        savedCurrentProject.currentConfigPath !==
          currentState.currentConfigPath ||
        savedCurrentProject.currentIidmPath !== currentState.currentIidmPath)
    ) {
      useProjectsStoreInner.setState(savedCurrentProject);
    }

    // Sync with recent projects
    if (
      savedRecentProjects &&
      savedRecentProjects.length !== currentState.recentProjects.length
    ) {
      useProjectsStoreInner.setState({ recentProjects: savedRecentProjects });
    }
  } catch (error) {
    console.warn('Failed to sync projects with database:', error);
  }
};

// Subscribe to DB
useProjectsStoreInner.subscribe(
  (state) => ({
    currentProject: {
      currentProject: state.currentProject,
      currentProjectPath: state.currentProjectPath,
      currentConfigPath: state.currentConfigPath,
      currentIidmPath: state.currentIidmPath,
    },
    recentProjects: state.recentProjects,
    runtime: state.runtime,
  }),
  async ({ currentProject, recentProjects, runtime }) => {
    if (!runtime) return;

    const saveCurrentProjectEffect = Effect.gen(function* () {
      const client = yield* SettingsClient;
      yield* client.setSetting(KEY_CURRENT_PROJECT, currentProject);
    });

    const saveRecentProjectsEffect = Effect.gen(function* () {
      const client = yield* SettingsClient;
      const serializedProjects = recentProjects.map((p) => ({
        ...p,
        lastAccessed: p.lastAccessed.toISOString(),
      }));
      yield* client.setSetting(KEY_RECENT_PROJECTS, serializedProjects);
    });

    try {
      await Promise.all([
        runtime.runPromise(saveCurrentProjectEffect),
        runtime.runPromise(saveRecentProjectsEffect),
      ]);
    } catch (error) {
      console.error('Failed to save projects to database:', error);
    }
  },
  { fireImmediately: false },
);
