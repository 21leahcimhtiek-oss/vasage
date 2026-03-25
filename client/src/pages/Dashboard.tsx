import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Plus, GitBranch, Rocket, Settings, LogOut, Store } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [showNewProject, setShowNewProject] = useState(false);

  // Fetch projects
  const { data: projects, isLoading: projectsLoading } = trpc.projects.list.useQuery();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Vasage</h1>
              <p className="text-sm text-muted-foreground">Deployment Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/marketplace">
              <Button variant="outline" size="sm" className="gap-2">
                <Store className="w-4 h-4" />
                Marketplace
              </Button>
            </a>
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(" ")[0]}!</h2>
              <p className="text-muted-foreground">Manage your projects and deployments</p>
            </div>
            <Button
              onClick={() => setShowNewProject(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold mb-6">Your Projects</h3>

            {projectsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <GitBranch className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{project.name}</h4>
                          <p className="text-xs text-muted-foreground">{project.githubOwner}/{project.githubRepoName}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>

                    {project.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                    )}

                    <div className="flex items-center gap-2 mb-4">
                      {project.framework && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {project.framework}
                        </span>
                      )}
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        {project.defaultBranch}
                      </span>
                    </div>

                    <Button className="w-full gap-2" variant="outline">
                      <Rocket className="w-4 h-4" />
                      View Deployments
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4">
                  <GitBranch className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="font-semibold mb-2">No projects yet</h4>
                <p className="text-muted-foreground mb-6">
                  Create your first project by connecting a GitHub repository
                </p>
                <Button onClick={() => setShowNewProject(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create Project
                </Button>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* New Project Modal (Placeholder) */}
      {showNewProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Create New Project</h3>
            <p className="text-muted-foreground mb-6">
              Connect your GitHub repository to start deploying
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowNewProject(false)}>
                Cancel
              </Button>
              <Button className="flex-1">
                Connect GitHub
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
