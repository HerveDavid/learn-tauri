import { open as openDialog } from '@tauri-apps/plugin-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarSeparator,
} from '@/components/ui/menubar';
import {
  ChevronDown,
  Clock,
  X,
  FileIcon,
  Folder,
} from 'lucide-react';
import { useProjectsStore } from '@/features/projects';
import { Project } from '@/types/project';

export const ProjectWidget = () => {
  const {
    currentProject,
    currentProjectPath,
    currentConfigPath,
    currentIidmPath,
    setCurrentProject,
    setCurrentProjectPath,
    setCurrentConfigPath,
    setCurrentIidmPath,
    addRecentProject,
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

  // Sélection d'un fichier TOML comme projet
  const handleOpenProject = async () => {
    try {
      const selectedPath = await openDialog({
        directory: false,
        multiple: false,
        filters: [
          {
            name: 'Config',
            extensions: ['toml'],
          },
        ],
      });

      if (selectedPath) {
        const pathString = selectedPath.toString();
        const fileName =
          pathString.split('/').pop()?.replace('.toml', '') ||
          'Untitled Project';
        const projectDir = pathString.substring(0, pathString.lastIndexOf('/'));

        // Mettre à jour le projet actuel
        setCurrentProject(fileName);
        setCurrentProjectPath(projectDir);
        setCurrentConfigPath(pathString);

        // Ajouter aux projets récents
        addRecentProject({
          name: fileName,
          path: projectDir,
          configPath: pathString,
          iidmPath: currentIidmPath,
        });
      }
    } catch (err) {
      console.error('Error selecting file:', err);
    }
  };

  // Nouvelle fonction : sélectionner un dossier projet
  const handleOpenProjectDirectory = async () => {
    try {
      const selectedPath = await openDialog({
        directory: true,
        multiple: false,
      });

      if (selectedPath) {
        const pathString = selectedPath.toString();
        const projectName = pathString.split('/').pop() || 'Untitled Project';

        setCurrentProject(projectName);
        setCurrentProjectPath(pathString);

        // Ajouter aux projets récents
        addRecentProject({
          name: projectName,
          path: pathString,
          configPath: currentConfigPath,
          iidmPath: currentIidmPath,
        });
      }
    } catch (err) {
      console.error('Error selecting directory:', err);
    }
  };

  // Nouvelle fonction : sélectionner un fichier IIDM
  const handleSelectIIDMFile = async () => {
    try {
      const selectedPath = await openDialog({
        directory: false,
        multiple: false,
        filters: [
          {
            name: 'IIDM',
            extensions: ['xiidm', 'iidm'],
          },
        ],
      });

      if (selectedPath) {
        const pathString = selectedPath.toString();
        setCurrentIidmPath(pathString);

        // Mettre à jour le projet actuel si il existe
        if (currentProject && currentProjectPath) {
          addRecentProject({
            name: currentProject,
            path: currentProjectPath,
            configPath: currentConfigPath,
            iidmPath: pathString,
          });
        }
      }
    } catch (err) {
      console.error('Error selecting IIDM file:', err);
    }
  };

  const sortedRecentProjects = getRecentProjectsSorted();
  const displayName = currentProject || 'Aucun projet';
  const initials = getProjectInitials(currentProject);

  return (
    <MenubarMenu>
      <MenubarTrigger>
        <div className="flex items-center gap-x-2">
          <Avatar className="size-4">
            <AvatarFallback className="text-xs font-medium bg-green-400">
              {initials}
            </AvatarFallback>
          </Avatar>
          <p className="truncate max-w-32">{displayName}</p>
          <ChevronDown className="size-4" />
        </div>
      </MenubarTrigger>

      <MenubarContent className="w-80">
        {/* Projet actuel */}
        {currentProject && (
          <>
            <div className="px-2 py-1.5 text-xs text-muted-foreground">
              Projet actuel
            </div>
            <MenubarItem className="flex items-center gap-2">
              <Avatar className="size-6 bg-green-600">
                <AvatarFallback className="text-xs font-medium text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{currentProject}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {currentProjectPath}
                </div>
                {/* Fichiers associés */}
                <div className="flex gap-2 mt-1">
                  {currentConfigPath && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <FileIcon className="size-3" />
                      TOML
                    </div>
                  )}
                  {currentIidmPath && (
                    <div className="flex items-center gap-1 text-xs text-blue-600">
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

        {/* Actions d'ouverture */}
        <div className="px-2 py-1.5 text-xs text-muted-foreground">Ouvrir</div>

        <MenubarItem
          onClick={handleOpenProject}
          className="flex items-center gap-2"
        >
          <FileIcon className="size-4" />
          <span>Fichier TOML...</span>
        </MenubarItem>

        <MenubarItem
          onClick={handleOpenProjectDirectory}
          className="flex items-center gap-2"
        >
          <Folder className="size-4" />
          <span>Dossier projet...</span>
        </MenubarItem>

        <MenubarItem
          onClick={handleSelectIIDMFile}
          className="flex items-center gap-2"
        >
          <FileIcon className="size-4" />
          <span>Fichier IIDM...</span>
        </MenubarItem>

        {/* Projets récents */}
        {sortedRecentProjects.length > 0 && (
          <>
            <MenubarSeparator />
            <div className="px-2 py-1.5 text-xs text-muted-foreground flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="size-3" />
                Projets récents ({sortedRecentProjects.length})
              </div>
              {sortedRecentProjects.length > 0 && (
                <button
                  onClick={handleClearRecentProjects}
                  className="text-xs text-red-500 hover:text-red-700"
                  title="Effacer tous les projets récents"
                >
                  Effacer tout
                </button>
              )}
            </div>

            {sortedRecentProjects.slice(0, 8).map((project) => {
              const projectInitials = getProjectInitials(project.name);
              const isCurrentProject = project.path === currentProjectPath;

              return (
                <MenubarItem
                  key={project.path}
                  onClick={() =>
                    !isCurrentProject && handleSwitchProject(project)
                  }
                  className={`flex items-center gap-2 group ${
                    isCurrentProject
                      ? 'bg-green-50 cursor-default border-l-2 border-green-500'
                      : 'cursor-pointer hover:bg-gray-50'
                  }`}
                  disabled={isCurrentProject}
                >
                  <Avatar
                    className={`size-6 ${
                      isCurrentProject ? 'bg-green-600' : 'bg-gray-600'
                    }`}
                  >
                    <AvatarFallback className="text-xs font-medium text-white">
                      {projectInitials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-medium truncate ${
                        isCurrentProject ? 'text-green-900' : ''
                      }`}
                    >
                      {project.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {project.path}
                    </div>

                    {/* Fichiers et date */}
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex gap-1">
                        {project.configPath && (
                          <div className="text-xs text-green-600">TOML</div>
                        )}
                        {project.iidmPath && (
                          <div className="text-xs text-blue-600">IIDM</div>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(project.lastAccessed).toLocaleDateString(
                          'fr-FR',
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

                  {!isCurrentProject && (
                    <button
                      onClick={(e) => handleRemoveProject(project.path, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-500"
                      title="Supprimer de la liste"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </MenubarItem>
              );
            })}

            {sortedRecentProjects.length > 8 && (
              <MenubarItem
                className="text-center text-xs text-muted-foreground"
                disabled
              >
                +{sortedRecentProjects.length - 8} autres projets
              </MenubarItem>
            )}
          </>
        )}

        {!currentProject && sortedRecentProjects.length === 0 && (
          <MenubarItem disabled className="text-center text-muted-foreground">
            Aucun projet ouvert
          </MenubarItem>
        )}
      </MenubarContent>
    </MenubarMenu>
  );
};
