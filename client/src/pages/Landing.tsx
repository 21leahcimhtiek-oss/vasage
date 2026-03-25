import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, GitBranch, Rocket, BarChart3, Lock, Globe, Code2 } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Rocket className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Vasage</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/marketplace">
              <Button variant="ghost" className="gap-2">
                Marketplace
              </Button>
            </a>
            <a href={getLoginUrl()}>
              <Button className="gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Deploy with <span className="gradient-text">Elegance</span>
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            A modern deployment platform that combines GitHub integration, intelligent build detection, and real-time deployment logs. Deploy your projects with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href={getLoginUrl()}>
              <Button size="lg" className="w-full sm:w-auto gap-2">
                Start Deploying
                <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground">Everything you need for seamless deployments</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <GitBranch className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">GitHub Integration</h3>
            <p className="text-sm text-muted-foreground">
              Connect your repositories and deploy automatically on every push
            </p>
          </Card>

          {/* Feature 2 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Smart Build Detection</h3>
            <p className="text-sm text-muted-foreground">
              Automatically detects your framework and applies optimal build settings
            </p>
          </Card>

          {/* Feature 3 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
              <Rocket className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold mb-2">Instant Deployments</h3>
            <p className="text-sm text-muted-foreground">
              Deploy your applications in seconds with our optimized pipeline
            </p>
          </Card>

          {/* Feature 4 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Real-time Logs</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your builds with live streaming logs and detailed insights
            </p>
          </Card>

          {/* Feature 5 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Custom Domains</h3>
            <p className="text-sm text-muted-foreground">
              Map custom domains to your deployments with automatic SSL certificates
            </p>
          </Card>

          {/* Feature 6 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold mb-2">Environment Variables</h3>
            <p className="text-sm text-muted-foreground">
              Securely manage environment variables for different deployment stages
            </p>
          </Card>

          {/* Feature 7 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4">
              <Code2 className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="font-semibold mb-2">Framework Support</h3>
            <p className="text-sm text-muted-foreground">
              Support for Next.js, React, Vue, Svelte, and many more frameworks
            </p>
          </Card>

          {/* Feature 8 */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center mb-4">
              <ArrowRight className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="font-semibold mb-2">Instant Rollbacks</h3>
            <p className="text-sm text-muted-foreground">
              Rollback to previous deployments with a single click
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border border-primary/20 p-12 text-center space-y-6">
          <h2 className="text-4xl font-bold">Ready to Deploy?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers using our platform to deploy their applications with confidence
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="gap-2">
              Start Free Today
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 py-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Vasage. Built with elegance and precision.</p>
        </div>
      </footer>
    </div>
  );
}
