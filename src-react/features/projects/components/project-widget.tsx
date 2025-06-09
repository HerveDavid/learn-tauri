import { useState } from 'react';
import { ChevronDown, Clock, X, FileIcon, Plus } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSeparator,
} from '@/components/ui/menubar';
import { useProjectsStore } from '@/features/projects';
import { Project } from '@/types/project';
import { ProjectDialog } from './project-dialog';

export const ProjectWidget = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const {
    currentProject,
    currentProjectPath,
    currentConfigPath,
    currentIidmPath,
    switchToProject,
    removeRecentProject,
    clearRecentProjects,
    getRecentProjectsSorted,
  } = useProjectsStore();

  const getProjectInitials = (projectName: string): string => {
    if (!projectName) return 'P';
    const cleaned = projectName.replace(/[^a-zA-Z0-9]/g, '');
    return cleaned.slice(0, 3).toUpperCase() || 'P';
  };

  const handleSwitchProject = (project: Project) => {
    switchToProject(project);
  };

  const handleRemoveProject = (projectPath: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRecentProject(projectPath);
  };

  const handleClearRecentProjects = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearRecentProjects();
  };

  const sortedRecentProjects = getRecentProjectsSorted().filter(
    (project) => project.path !== currentProjectPath,
  );

  const displayName = currentProject || 'No Project';
  const initials = getProjectInitials(currentProject);

  return (
    <>
      <MenubarMenu>
        <MenubarTrigger>
          <div className="flex items-center gap-x-2">
            <Avatar className="size-4">
              <AvatarFallback className="text-xs font-medium bg-blue-600 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <p className="truncate max-w-32">{displayName}</p>
            <ChevronDown className="size-4" />
          </div>
        </MenubarTrigger>

        <MenubarContent className="w-80">
          {/* Current Project */}
          {currentProject && (
            <>
              <div className="px-2 py-1.5 text-xs text-muted-foreground">
                Current Project
              </div>
              <MenubarItem className="flex items-center gap-2">
                <Avatar className="size-6 bg-blue-600">
                  <AvatarFallback className="text-xs font-medium text-white bg-blue-600">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{currentProject}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {currentProjectPath}
                  </div>
                  {/* Associated Files */}
                  <div className="flex gap-2 mt-1">
                    {currentConfigPath && (
                      <div className="flex items-center gap-1 text-xs text-chart-2">
                        <FileIcon className="size-3" />
                        TOML
                      </div>
                    )}
                    {currentIidmPath && (
                      <div className="flex items-center gap-1 text-xs text-chart-4">
                        <FileIcon className="size-3" />
                        IIDM
                      </div>
                    )}
                  </div>
                </div>
              </MenubarItem>
              <MenubarSeparator />
            </>
          )}

          {/* Create New Project */}
          <div className="px-2 py-1.5 text-xs text-muted-foreground">
            Actions
          </div>

          <MenubarItem
            onClick={() => setShowCreateDialog(true)}
            className="flex items-center gap-2"
          >
            <Plus className="size-4" />
            <span>Create New Project...</span>
          </MenubarItem>

          {/* Recent Projects */}
          {sortedRecentProjects.length > 0 && (
            <>
              <MenubarSeparator />
              <div className="px-2 py-1.5 text-xs text-muted-foreground flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="size-3" />
                  Recent Projects ({sortedRecentProjects.length})
                </div>
                {sortedRecentProjects.length > 0 && (
                  <button
                    onClick={handleClearRecentProjects}
                    className="text-xs text-destructive/80 hover:text-destructive"
                    title="Clear all recent projects"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {sortedRecentProjects.slice(0, 8).map((project) => {
                const projectInitials = getProjectInitials(project.name);

                return (
                  <MenubarItem
                    key={project.path}
                    onClick={() => handleSwitchProject(project)}
                    className="flex items-center gap-2 group cursor-pointer hover:bg-sidebar-accent"
                  >
                    <Avatar className="size-6">
                      <AvatarFallback className="text-xs font-medium text-white bg-blue-500">
                        {projectInitials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate text-foreground">
                        {project.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {project.path}
                      </div>

                      {/* Files and Date */}
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex gap-1">
                          {project.configPath && (
                            <div className="text-xs text-chart-2">TOML</div>
                          )}
                          {project.iidmPath && (
                            <div className="text-xs text-chart-4">IIDM</div>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(project.lastAccessed).toLocaleDateString(
                            'en-US',
                            {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleRemoveProject(project.path, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500"
                      title="Remove from list"
                    >
                      <X className="size-3" />
                    </button>
                  </MenubarItem>
                );
              })}

              {sortedRecentProjects.length > 8 && (
                <MenubarItem
                  className="text-center text-xs text-muted-foreground"
                  disabled
                >
                  +{sortedRecentProjects.length - 8} other projects
                </MenubarItem>
              )}
            </>
          )}

          {!currentProject && sortedRecentProjects.length === 0 && (
            <MenubarItem disabled className="text-center text-muted-foreground">
              No project open
            </MenubarItem>
          )}
        </MenubarContent>
      </MenubarMenu>

      <ProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
};
