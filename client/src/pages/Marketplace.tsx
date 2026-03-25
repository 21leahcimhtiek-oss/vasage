import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  Rocket,
  ArrowRight,
  Bot,
  Star,
  GitBranch,
  Zap,
  ExternalLink,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { getLoginUrl } from "@/const";

interface MarketplaceApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  tags: string[];
  githubUrl: string;
  githubOwner: string;
  githubRepo: string;
  framework: string;
  defaultBranch: string;
  buildCommand: string;
  installCommand: string;
  outputDirectory: string;
  stars: number;
  agents?: string[];
  featured?: boolean;
  envVars?: { key: string; description: string; required: boolean }[];
}

const MARKETPLACE_APPS: MarketplaceApp[] = [
  {
    id: "brand-swarm",
    name: "Brand Swarm",
    tagline: "6-agent Marketing & Brand Guru AI system",
    description:
      "A multi-agent AI swarm for brand strategy, positioning, messaging, go-to-market, and offer design. Powered by OpenAI GPT-4o with parallel agent execution and real-time streaming.",
    category: "AI / Marketing",
    tags: ["AI", "Marketing", "Branding", "GPT-4o", "Multi-Agent"],
    githubUrl: "https://github.com/21leahcimhtiek-oss/brand-swarm",
    githubOwner: "21leahcimhtiek-oss",
    githubRepo: "brand-swarm",
    framework: "nextjs",
    defaultBranch: "main",
    buildCommand: "npm run build",
    installCommand: "npm install",
    outputDirectory: ".next",
    stars: 0,
    featured: true,
    agents: [
      "🧠 Orchestrator",
      "🎯 Brand Strategist",
      "🔍 Audience & Insights",
      "✍️ Messaging & Copy",
      "🚀 Campaign & GTM",
      "💎 Offer & Positioning",
    ],
    envVars: [
      {
        key: "OPENAI_API_KEY",
        description: "Your OpenAI API key (GPT-4o access required)",
        required: true,
      },
    ],
  },
];

function DeployModal({
  app,
  onClose,
}: {
  app: MarketplaceApp;
  onClose: () => void;
}) {
  const { isAuthenticated } = useAuth();
  const createProject = trpc.projects.create.useMutation();
  const [envValues, setEnvValues] = useState<Record<string, string>>({});
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const handleDeploy = async () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }
    setDeploying(true);
    try {
      await createProject.mutateAsync({
        name: app.name,
        description: app.description,
        githubRepoUrl: app.githubUrl,
        githubRepoName: app.githubRepo,
        githubOwner: app.githubOwner,
        defaultBranch: app.defaultBranch,
        framework: app.framework,
        buildCommand: app.buildCommand,
        installCommand: app.installCommand,
        outputDirectory: app.outputDirectory,
        rootDirectory: ".",
      });
      setDeployed(true);
    } catch (err) {
      console.error(err);
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg p-6 space-y-5">
        {deployed ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
              <Rocket className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold">Project Created!</h3>
            <p className="text-muted-foreground text-sm">
              {app.name} has been added to your projects. Head to your dashboard
              to configure env vars and trigger your first deployment.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Close
              </Button>
              <Button className="flex-1 gap-2" onClick={() => (window.location.href = "/")}>
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold">{app.name}</h3>
                <p className="text-sm text-muted-foreground">{app.tagline}</p>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GitBranch className="w-4 h-4" />
              <a
                href={app.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground flex items-center gap-1"
              >
                {app.githubOwner}/{app.githubRepo}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {app.envVars && app.envVars.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Required Environment Variables</p>
                {app.envVars.map((ev) => (
                  <div key={ev.key}>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      {ev.key}
                      {ev.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                      <span className="ml-2 font-normal">{ev.description}</span>
                    </label>
                    <input
                      type="password"
                      placeholder={`Enter ${ev.key}`}
                      value={envValues[ev.key] || ""}
                      onChange={(e) =>
                        setEnvValues((prev) => ({
                          ...prev,
                          [ev.key]: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
              <p>
                <span className="font-medium text-foreground">Framework:</span>{" "}
                {app.framework}
              </p>
              <p>
                <span className="font-medium text-foreground">Build:</span>{" "}
                {app.buildCommand}
              </p>
              <p>
                <span className="font-medium text-foreground">Branch:</span>{" "}
                {app.defaultBranch}
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handleDeploy}
                disabled={deploying}
              >
                {deploying ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    Deploy to Vasage
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

function AppCard({
  app,
  onDeploy,
}: {
  app: MarketplaceApp;
  onDeploy: (app: MarketplaceApp) => void;
}) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-0.5 flex flex-col gap-4 relative">
      {app.featured && (
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="gap-1 text-xs">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            Featured
          </Badge>
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl">
          🧠
        </div>
        <div>
          <h3 className="font-bold text-base">{app.name}</h3>
          <p className="text-xs text-muted-foreground">{app.category}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed flex-1">
        {app.description}
      </p>

      {app.agents && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">Agents</p>
          <div className="flex flex-wrap gap-1.5">
            {app.agents.map((a) => (
              <span
                key={a}
                className="text-xs px-2 py-0.5 rounded-full bg-primary/8 border border-primary/15 text-primary"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {app.tags.map((t) => (
          <Badge key={t} variant="outline" className="text-xs">
            {t}
          </Badge>
        ))}
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          asChild
        >
          <a href={app.githubUrl} target="_blank" rel="noreferrer">
            <GitBranch className="w-3.5 h-3.5" />
            Source
          </a>
        </Button>
        <Button
          size="sm"
          className="flex-1 gap-1.5"
          onClick={() => onDeploy(app)}
        >
          <Rocket className="w-3.5 h-3.5" />
          Deploy
        </Button>
      </div>
    </Card>
  );
}

export default function Marketplace() {
  const { user, isAuthenticated, logout } = useAuth();
  const [selectedApp, setSelectedApp] = useState<MarketplaceApp | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Vasage</span>
            </a>
            <span className="text-muted-foreground/40 text-lg">/</span>
            <span className="text-sm font-medium text-muted-foreground">Marketplace</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <a href="/">Dashboard</a>
                </Button>
                <Button variant="ghost" size="icon" onClick={logout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="sm" className="gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-16 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-2">
          <Zap className="w-3.5 h-3.5" />
          One-click deploy
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          App Marketplace
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Deploy production-ready AI apps to Vasage in one click. Fork, configure, and launch.
        </p>
      </section>

      {/* Apps Grid */}
      <section className="container pb-20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Featured Apps</h2>
            <p className="text-sm text-muted-foreground">{MARKETPLACE_APPS.length} app{MARKETPLACE_APPS.length !== 1 ? "s" : ""} available</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MARKETPLACE_APPS.map((app) => (
            <AppCard key={app.id} app={app} onDeploy={setSelectedApp} />
          ))}
        </div>
      </section>

      {/* Deploy Modal */}
      {selectedApp && (
        <DeployModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
    </div>
  );
}