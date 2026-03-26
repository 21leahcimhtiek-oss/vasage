"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import {
  Rocket, ArrowRight, GitBranch, Zap, ExternalLink, LogOut,
  Star, Search, SlidersHorizontal,
} from "lucide-react";
import { useState, useMemo } from "react";
import { getLoginUrl } from "@/const";

// ─── Types ────────────────────────────────────────────────────────────────────
interface EnvVar { key: string; description: string; required: boolean }
interface MarketplaceApp {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  subcategory?: string;
  tags: string[];
  emoji: string;
  githubUrl: string;
  githubOwner: string;
  githubRepo: string;
  framework: string;
  defaultBranch: string;
  buildCommand: string;
  installCommand: string;
  outputDirectory: string;
  featured?: boolean;
  envVars?: EnvVar[];
}

const OWNER = "21leahcimhtiek-oss";

// ─── App Catalogue ─────────────────────────────────────────────────────────────
const APPS: MarketplaceApp[] = [
  // ── FEATURED ──────────────────────────────────────────────────────────────
  {
    id: "brand-swarm",
    name: "Brand Swarm",
    tagline: "6-agent Marketing & Brand Guru AI swarm",
    description: "Multi-agent AI system for brand strategy, positioning, messaging, go-to-market, and offer design. Parallel GPT-4o agents with real-time streaming and synthesis.",
    category: "AI Tools", subcategory: "Marketing",
    tags: ["AI", "Marketing", "Multi-Agent", "GPT-4o", "Branding"],
    emoji: "🧠", featured: true,
    githubUrl: `https://github.com/${OWNER}/brand-swarm`,
    githubOwner: OWNER, githubRepo: "brand-swarm",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key (GPT-4o)", required: true }],
  },

  {
    id: "aurora-marketing-os",
    name: "Aurora Marketing OS",
    tagline: "5-agent AI Marketing Command Center",
    description: "Full marketing OS with 5 specialist AI agents: Productization (repo → product), CMO Strategy (GTM + brand assets), Stripe Automation (pricing architecture), Distribution (channel strategy + launch plan), and Analytics (KPI framework). 65+ repos pre-loaded. GPT-4o streaming.",
    category: "AI Tools", subcategory: "Marketing",
    tags: ["AI", "Marketing", "Multi-Agent", "GPT-4o", "Stripe", "Analytics"],
    emoji: "🌌", featured: true,
    githubUrl: `https://github.com/${OWNER}/aurora-marketing-os`,
    githubOwner: OWNER, githubRepo: "aurora-marketing-os",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key (GPT-4o)", required: true }],
  },

  // ── SAAS TOOLS ─────────────────────────────────────────────────────────────
  {
    id: "invoiceai",
    name: "InvoiceAI",
    tagline: "AI-powered invoice generator SaaS",
    description: "Generate, send, and manage professional invoices using AI. Includes Stripe billing, client management, and PDF export.",
    category: "SaaS Tools", subcategory: "Finance",
    tags: ["AI", "Invoicing", "Stripe", "Next.js"],
    emoji: "🧾", featured: true,
    githubUrl: `https://github.com/${OWNER}/invoiceai`,
    githubOwner: OWNER, githubRepo: "invoiceai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [
      { key: "OPENAI_API_KEY", description: "OpenAI API key", required: true },
      { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true },
      { key: "STRIPE_WEBHOOK_SECRET", description: "Stripe webhook secret", required: true },
    ],
  },
  {
    id: "contractai",
    name: "ContractAI",
    tagline: "AI contract builder and e-sign SaaS",
    description: "Draft, review, and e-sign contracts with AI. Includes template library, clause suggestions, and Stripe-gated access.",
    category: "SaaS Tools", subcategory: "Legal",
    tags: ["AI", "Contracts", "Legal", "E-Sign", "Stripe"],
    emoji: "📄",
    githubUrl: `https://github.com/${OWNER}/contractai`,
    githubOwner: OWNER, githubRepo: "contractai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [
      { key: "OPENAI_API_KEY", description: "OpenAI API key", required: true },
      { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true },
    ],
  },
  {
    id: "contentai",
    name: "ContentAI",
    tagline: "AI content marketing platform",
    description: "Generate blog posts, social copy, ad scripts, and email campaigns at scale. Full content calendar and Stripe subscription.",
    category: "SaaS Tools", subcategory: "Marketing",
    tags: ["AI", "Content", "Marketing", "Stripe", "Next.js"],
    emoji: "✍️",
    githubUrl: `https://github.com/${OWNER}/contentai`,
    githubOwner: OWNER, githubRepo: "contentai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }, { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true }],
  },
  {
    id: "emailai",
    name: "EmailAI",
    tagline: "AI-powered email marketing SaaS",
    description: "Write, sequence, and optimize email campaigns with AI. Includes deliverability tools and Stripe billing.",
    category: "SaaS Tools", subcategory: "Marketing",
    tags: ["AI", "Email", "Marketing", "Stripe"],
    emoji: "📧",
    githubUrl: `https://github.com/${OWNER}/emailai`,
    githubOwner: OWNER, githubRepo: "emailai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }, { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true }],
  },
  {
    id: "seoai",
    name: "SEOAI",
    tagline: "AI-powered SEO optimization SaaS",
    description: "Keyword research, content briefs, meta optimization, and technical SEO audits powered by AI.",
    category: "SaaS Tools", subcategory: "SEO",
    tags: ["AI", "SEO", "Content", "Stripe"],
    emoji: "🔍",
    githubUrl: `https://github.com/${OWNER}/seoai`,
    githubOwner: OWNER, githubRepo: "seoai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }, { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true }],
  },
  {
    id: "chatbotai",
    name: "ChatbotAI",
    tagline: "AI chatbot builder SaaS",
    description: "Build and embed custom AI chatbots for any website. Train on your own data, white-label, and monetize with Stripe.",
    category: "SaaS Tools", subcategory: "Customer Success",
    tags: ["AI", "Chatbot", "Embed", "Stripe"],
    emoji: "💬",
    githubUrl: `https://github.com/${OWNER}/chatbotai`,
    githubOwner: OWNER, githubRepo: "chatbotai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }, { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true }],
  },
  {
    id: "onboardai",
    name: "OnboardAI",
    tagline: "AI-powered user onboarding SaaS",
    description: "Personalize user onboarding flows with AI. Reduce churn, increase activation, and automate in-app guidance.",
    category: "SaaS Tools", subcategory: "Growth",
    tags: ["AI", "Onboarding", "SaaS", "Stripe"],
    emoji: "🚀",
    githubUrl: `https://github.com/${OWNER}/onboardai`,
    githubOwner: OWNER, githubRepo: "onboardai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }, { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true }],
  },
  {
    id: "analyticsai",
    name: "AnalyticsAI",
    tagline: "AI-powered analytics SaaS",
    description: "Natural language analytics — ask questions about your data, get instant visualizations, and AI-generated insights.",
    category: "SaaS Tools", subcategory: "Analytics",
    tags: ["AI", "Analytics", "Data", "Stripe"],
    emoji: "📊",
    githubUrl: `https://github.com/${OWNER}/analyticsai`,
    githubOwner: OWNER, githubRepo: "analyticsai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }, { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true }],
  },
  {
    id: "socialproofai",
    name: "SocialProofAI",
    tagline: "AI social proof and testimonial SaaS",
    description: "Collect, curate, and display AI-optimized testimonials, reviews, and social proof widgets that convert.",
    category: "SaaS Tools", subcategory: "Marketing",
    tags: ["AI", "Social Proof", "Conversion", "Stripe"],
    emoji: "⭐",
    githubUrl: `https://github.com/${OWNER}/socialproofai`,
    githubOwner: OWNER, githubRepo: "socialproofai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }, { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true }],
  },
  {
    id: "landingpageai",
    name: "LandingPageAI",
    tagline: "AI landing page builder SaaS",
    description: "Generate high-converting landing pages from a prompt. A/B testing, Stripe billing, and export-ready HTML.",
    category: "SaaS Tools", subcategory: "Marketing",
    tags: ["AI", "Landing Pages", "Builder", "Stripe"],
    emoji: "🎯",
    githubUrl: `https://github.com/${OWNER}/landingpageai`,
    githubOwner: OWNER, githubRepo: "landingpageai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }, { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true }],
  },
  {
    id: "pricingai",
    name: "PricingAI",
    tagline: "AI-powered pricing optimization SaaS",
    description: "Optimize pricing strategy with AI. Competitive analysis, price elasticity modeling, and Stripe-integrated billing experiments.",
    category: "SaaS Tools", subcategory: "Revenue",
    tags: ["AI", "Pricing", "Revenue", "Stripe"],
    emoji: "💰",
    githubUrl: `https://github.com/${OWNER}/pricingai`,
    githubOwner: OWNER, githubRepo: "pricingai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }, { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true }],
  },
  {
    id: "supportai",
    name: "SupportAI",
    tagline: "AI customer support SaaS",
    description: "Automate tier-1 support with AI. Ticket triage, auto-responses, knowledge base generation, and Stripe-gated plans.",
    category: "SaaS Tools", subcategory: "Customer Success",
    tags: ["AI", "Support", "Helpdesk", "Stripe"],
    emoji: "🎧",
    githubUrl: `https://github.com/${OWNER}/supportai`,
    githubOwner: OWNER, githubRepo: "supportai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }, { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true }],
  },
  {
    id: "documentai",
    name: "DocumentAI",
    tagline: "AI document processing SaaS",
    description: "Extract, summarize, and query any document with AI. PDF parsing, contract analysis, and Stripe-gated usage.",
    category: "SaaS Tools", subcategory: "Productivity",
    tags: ["AI", "Documents", "PDF", "Stripe"],
    emoji: "📋",
    githubUrl: `https://github.com/${OWNER}/documentai`,
    githubOwner: OWNER, githubRepo: "documentai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }, { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true }],
  },
  {
    id: "leadgenai",
    name: "LeadGenAI",
    tagline: "AI lead generation SaaS",
    description: "Find, qualify, and enrich leads with AI. Outreach copywriting, scoring, and CRM-ready export with Stripe billing.",
    category: "SaaS Tools", subcategory: "Sales",
    tags: ["AI", "Lead Gen", "Sales", "Stripe"],
    emoji: "🎣",
    githubUrl: `https://github.com/${OWNER}/leadgenai`,
    githubOwner: OWNER, githubRepo: "leadgenai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }, { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true }],
  },
  {
    id: "taskflowai",
    name: "TaskFlowAI",
    tagline: "AI task and project management SaaS",
    description: "AI-powered project management that auto-prioritizes, estimates, and delegates tasks. Stripe subscription included.",
    category: "SaaS Tools", subcategory: "Productivity",
    tags: ["AI", "Tasks", "Project Management", "Stripe"],
    emoji: "✅",
    githubUrl: `https://github.com/${OWNER}/taskflowai`,
    githubOwner: OWNER, githubRepo: "taskflowai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }, { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true }],
  },
  {
    id: "promptvault-pro",
    name: "PromptVault Pro",
    tagline: "AI prompt manager SaaS",
    description: "Store, organize, version, and share AI prompts. Team collaboration, Supabase backend, OpenRouter integration, Stripe billing.",
    category: "SaaS Tools", subcategory: "AI Productivity",
    tags: ["AI", "Prompts", "Supabase", "Stripe", "OpenRouter"],
    emoji: "🔐",
    githubUrl: `https://github.com/${OWNER}/promptvault-pro`,
    githubOwner: OWNER, githubRepo: "promptvault-pro",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [
      { key: "NEXT_PUBLIC_SUPABASE_URL", description: "Supabase project URL", required: true },
      { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", description: "Supabase anon key", required: true },
      { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true },
      { key: "OPENROUTER_API_KEY", description: "OpenRouter API key", required: false },
    ],
  },
  {
    id: "gitdigest",
    name: "GitDigest",
    tagline: "AI GitHub repository digest SaaS",
    description: "Daily and weekly AI summaries of commits, PRs, issues, and contributor activity for any GitHub repo.",
    category: "SaaS Tools", subcategory: "Developer Tools",
    tags: ["AI", "GitHub", "DevTools", "Stripe"],
    emoji: "📦",
    githubUrl: `https://github.com/${OWNER}/gitdigest`,
    githubOwner: OWNER, githubRepo: "gitdigest",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [
      { key: "OPENAI_API_KEY", description: "OpenAI API key", required: true },
      { key: "GITHUB_TOKEN", description: "GitHub personal access token", required: true },
      { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true },
    ],
  },
  {
    id: "roastmycode",
    name: "RoastMyCode",
    tagline: "AI code review SaaS",
    description: "Paste your code and get brutal, honest AI code reviews. Supabase auth, CodeMirror editor, OpenRouter LLMs, Stripe billing.",
    category: "SaaS Tools", subcategory: "Developer Tools",
    tags: ["AI", "Code Review", "DevTools", "Supabase", "Stripe"],
    emoji: "🔥",
    githubUrl: `https://github.com/${OWNER}/roastmycode`,
    githubOwner: OWNER, githubRepo: "roastmycode",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [
      { key: "NEXT_PUBLIC_SUPABASE_URL", description: "Supabase project URL", required: true },
      { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", description: "Supabase anon key", required: true },
      { key: "OPENROUTER_API_KEY", description: "OpenRouter API key", required: true },
      { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true },
    ],
  },
  {
    id: "invoiceforge",
    name: "InvoiceForge",
    tagline: "AI invoice generation and client billing SaaS",
    description: "Full-featured invoice and billing platform with AI-generated line items, client portal, and automated payment reminders.",
    category: "SaaS Tools", subcategory: "Finance",
    tags: ["AI", "Invoicing", "Billing", "Stripe"],
    emoji: "🔨",
    githubUrl: `https://github.com/${OWNER}/invoiceforge`,
    githubOwner: OWNER, githubRepo: "invoiceforge",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }, { key: "STRIPE_SECRET_KEY", description: "Stripe secret key", required: true }],
  },

  // ── CONSUMER AI APPS ───────────────────────────────────────────────────────
  {
    id: "app205-habit-ai",
    name: "HabitAI",
    tagline: "AI-powered habit tracking and productivity app",
    description: "Build habits that stick with AI coaching, streak tracking, behavioral insights, and personalized daily plans.",
    category: "Consumer Apps", subcategory: "Productivity",
    tags: ["AI", "Habits", "Productivity", "Next.js"],
    emoji: "🔁",
    githubUrl: `https://github.com/${OWNER}/app205-habit-ai`,
    githubOwner: OWNER, githubRepo: "app205-habit-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "app206-fitness-ai",
    name: "FitnessAI",
    tagline: "AI-powered fitness and workout tracking app",
    description: "Personalized workout plans, progress tracking, and real-time AI coaching for any fitness goal.",
    category: "Consumer Apps", subcategory: "Health & Fitness",
    tags: ["AI", "Fitness", "Workouts", "Health"],
    emoji: "💪",
    githubUrl: `https://github.com/${OWNER}/app206-fitness-ai`,
    githubOwner: OWNER, githubRepo: "app206-fitness-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "app207-recipe-ai",
    name: "RecipeAI",
    tagline: "AI-powered recipe discovery and cooking assistant",
    description: "Generate recipes from ingredients you have, get step-by-step AI cooking guidance, and build personalized meal plans.",
    category: "Consumer Apps", subcategory: "Food & Cooking",
    tags: ["AI", "Recipes", "Cooking", "Food"],
    emoji: "🍳",
    githubUrl: `https://github.com/${OWNER}/app207-recipe-ai`,
    githubOwner: OWNER, githubRepo: "app207-recipe-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "app208-meditation-ai",
    name: "MindfulAI",
    tagline: "AI-powered meditation and mindfulness app",
    description: "Personalized guided meditations, breathing exercises, and stress tracking powered by AI.",
    category: "Consumer Apps", subcategory: "Mental Wellness",
    tags: ["AI", "Meditation", "Mindfulness", "Wellness"],
    emoji: "🧘",
    githubUrl: `https://github.com/${OWNER}/app208-meditation-ai`,
    githubOwner: OWNER, githubRepo: "app208-meditation-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "app209-language-ai",
    name: "LinguaAI",
    tagline: "AI-powered language learning assistant",
    description: "Learn any language with AI conversation practice, grammar correction, vocabulary building, and cultural context.",
    category: "Consumer Apps", subcategory: "Education",
    tags: ["AI", "Language Learning", "Education"],
    emoji: "🌍",
    githubUrl: `https://github.com/${OWNER}/app209-language-ai`,
    githubOwner: OWNER, githubRepo: "app209-language-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "app210-pet-ai",
    name: "PetCareAI",
    tagline: "AI-powered pet care and health tracking assistant",
    description: "Track your pet's health, get AI vet advice, nutrition recommendations, and behavior analysis.",
    category: "Consumer Apps", subcategory: "Pets",
    tags: ["AI", "Pets", "Health", "Tracking"],
    emoji: "🐾",
    githubUrl: `https://github.com/${OWNER}/app210-pet-ai`,
    githubOwner: OWNER, githubRepo: "app210-pet-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "app211-sleep-ai",
    name: "SleepAI",
    tagline: "AI-powered sleep tracking and optimization app",
    description: "Optimize your sleep with AI analysis, personalized sleep schedules, and evidence-based improvement plans.",
    category: "Consumer Apps", subcategory: "Health & Fitness",
    tags: ["AI", "Sleep", "Health", "Wellness"],
    emoji: "😴",
    githubUrl: `https://github.com/${OWNER}/app211-sleep-ai`,
    githubOwner: OWNER, githubRepo: "app211-sleep-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "app212-travel-ai",
    name: "TravelAI",
    tagline: "AI-powered travel planning and discovery assistant",
    description: "Plan complete trips with AI — itineraries, hidden gems, budget optimization, and real-time travel advice.",
    category: "Consumer Apps", subcategory: "Travel",
    tags: ["AI", "Travel", "Planning", "Itinerary"],
    emoji: "✈️",
    githubUrl: `https://github.com/${OWNER}/app212-travel-ai`,
    githubOwner: OWNER, githubRepo: "app212-travel-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "app213-dating-ai",
    name: "DateAI",
    tagline: "AI-powered dating and relationship assistant",
    description: "AI dating coach for profile optimization, conversation starters, date planning, and relationship advice.",
    category: "Consumer Apps", subcategory: "Relationships",
    tags: ["AI", "Dating", "Relationships", "Coaching"],
    emoji: "💘",
    githubUrl: `https://github.com/${OWNER}/app213-dating-ai`,
    githubOwner: OWNER, githubRepo: "app213-dating-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "app214-music-ai",
    name: "MusicAI",
    tagline: "AI-powered music discovery and playlist assistant",
    description: "Discover music with AI mood matching, generate custom playlists, and get artist deep-dives.",
    category: "Consumer Apps", subcategory: "Entertainment",
    tags: ["AI", "Music", "Playlists", "Discovery"],
    emoji: "🎵",
    githubUrl: `https://github.com/${OWNER}/app214-music-ai`,
    githubOwner: OWNER, githubRepo: "app214-music-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "app215-books-ai",
    name: "BooksAI",
    tagline: "AI-powered book discovery and reading assistant",
    description: "Find your next favorite book with AI, get instant summaries, and track your reading progress.",
    category: "Consumer Apps", subcategory: "Education",
    tags: ["AI", "Books", "Reading", "Discovery"],
    emoji: "📚",
    githubUrl: `https://github.com/${OWNER}/app215-books-ai`,
    githubOwner: OWNER, githubRepo: "app215-books-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "app216-career-ai",
    name: "CareerAI",
    tagline: "AI-powered career development assistant",
    description: "Career path planning, skill gap analysis, job search strategy, and AI-powered professional development.",
    category: "Consumer Apps", subcategory: "Career",
    tags: ["AI", "Career", "Jobs", "Development"],
    emoji: "💼",
    githubUrl: `https://github.com/${OWNER}/app216-career-ai`,
    githubOwner: OWNER, githubRepo: "app216-career-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "app217-interview-ai",
    name: "InterviewAI",
    tagline: "AI-powered interview preparation assistant",
    description: "Practice interviews with AI, get real-time feedback, generate company-specific prep, and master behavioral questions.",
    category: "Consumer Apps", subcategory: "Career",
    tags: ["AI", "Interviews", "Career", "Coaching"],
    emoji: "🎤",
    githubUrl: `https://github.com/${OWNER}/app217-interview-ai`,
    githubOwner: OWNER, githubRepo: "app217-interview-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "app218-resume-ai",
    name: "ResumeAI",
    tagline: "AI-powered resume builder and optimizer",
    description: "Build ATS-optimized resumes with AI, tailor for specific job descriptions, and get instant improvement suggestions.",
    category: "Consumer Apps", subcategory: "Career",
    tags: ["AI", "Resume", "Career", "ATS"],
    emoji: "📝",
    githubUrl: `https://github.com/${OWNER}/app218-resume-ai`,
    githubOwner: OWNER, githubRepo: "app218-resume-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "app219-salary-ai",
    name: "SalaryAI",
    tagline: "AI-powered salary negotiation assistant",
    description: "Research market compensation, practice salary negotiations with AI, and maximize your offer.",
    category: "Consumer Apps", subcategory: "Career",
    tags: ["AI", "Salary", "Negotiation", "Career"],
    emoji: "💵",
    githubUrl: `https://github.com/${OWNER}/app219-salary-ai`,
    githubOwner: OWNER, githubRepo: "app219-salary-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "app220-linkedin-ai",
    name: "LinkedInAI",
    tagline: "AI-powered LinkedIn profile optimizer",
    description: "Optimize your LinkedIn profile with AI, generate connection messages, and grow your professional network.",
    category: "Consumer Apps", subcategory: "Career",
    tags: ["AI", "LinkedIn", "Networking", "Career"],
    emoji: "🔗",
    githubUrl: `https://github.com/${OWNER}/app220-linkedin-ai`,
    githubOwner: OWNER, githubRepo: "app220-linkedin-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },

  // ── VERTICALS ──────────────────────────────────────────────────────────────
  {
    id: "carfix-id",
    name: "CarFix ID",
    tagline: "Multimodal AI vehicle diagnostics platform",
    description: "AI-powered consumer platform for vehicle diagnostics, repair explanations, and cost estimates. Multimodal — photo + text. First step in a 12-vertical automotive repair system.",
    category: "Verticals", subcategory: "Automotive",
    tags: ["AI", "Automotive", "Diagnostics", "Multimodal"],
    emoji: "🚗", featured: true,
    githubUrl: `https://github.com/${OWNER}/carfix-id`,
    githubOwner: OWNER, githubRepo: "carfix-id",
    framework: "vite", defaultBranch: "main",
    buildCommand: "vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    installCommand: "npm install", outputDirectory: "dist",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "retail-ai",
    name: "RetailAI",
    tagline: "AI operations platform for retail",
    description: "AI tools for retail — inventory forecasting, customer segmentation, personalized promotions, and demand planning.",
    category: "Verticals", subcategory: "Retail",
    tags: ["AI", "Retail", "Inventory", "Commerce"],
    emoji: "🛒",
    githubUrl: `https://github.com/${OWNER}/retail-ai`,
    githubOwner: OWNER, githubRepo: "retail-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "hrtech-ai",
    name: "HRTechAI",
    tagline: "AI HR and talent management platform",
    description: "AI-powered HR platform — resume screening, candidate scoring, onboarding automation, and employee retention analytics.",
    category: "Verticals", subcategory: "HR",
    tags: ["AI", "HR", "Talent", "Recruiting"],
    emoji: "👥",
    githubUrl: `https://github.com/${OWNER}/hrtech-ai`,
    githubOwner: OWNER, githubRepo: "hrtech-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "supply-chain-ai",
    name: "SupplyChainAI",
    tagline: "AI supply chain optimization platform",
    description: "Predict disruptions, optimize logistics, and automate procurement decisions with AI across your supply chain.",
    category: "Verticals", subcategory: "Logistics",
    tags: ["AI", "Supply Chain", "Logistics", "Operations"],
    emoji: "🚚",
    githubUrl: `https://github.com/${OWNER}/supply-chain-ai`,
    githubOwner: OWNER, githubRepo: "supply-chain-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "energy-ai",
    name: "EnergyAI",
    tagline: "AI energy management platform",
    description: "Optimize energy consumption, predict usage patterns, and reduce costs with AI for commercial and industrial facilities.",
    category: "Verticals", subcategory: "Energy",
    tags: ["AI", "Energy", "Sustainability", "Operations"],
    emoji: "⚡",
    githubUrl: `https://github.com/${OWNER}/energy-ai`,
    githubOwner: OWNER, githubRepo: "energy-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "healthcare-ops-ai",
    name: "HealthcareOpsAI",
    tagline: "AI healthcare operations platform",
    description: "Streamline clinical workflows, patient scheduling, billing automation, and compliance monitoring with AI.",
    category: "Verticals", subcategory: "Healthcare",
    tags: ["AI", "Healthcare", "Clinical", "Operations"],
    emoji: "🏥",
    githubUrl: `https://github.com/${OWNER}/healthcare-ops-ai`,
    githubOwner: OWNER, githubRepo: "healthcare-ops-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "legal-ai-ai",
    name: "LegalAI",
    tagline: "AI legal research and document platform",
    description: "AI-powered legal research, case summarization, contract review, and document drafting for law firms and legal teams.",
    category: "Verticals", subcategory: "Legal",
    tags: ["AI", "Legal", "Research", "Contracts"],
    emoji: "⚖️",
    githubUrl: `https://github.com/${OWNER}/legal-ai-ai`,
    githubOwner: OWNER, githubRepo: "legal-ai-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "mental-health-ai",
    name: "MentalHealthAI",
    tagline: "AI mental health support platform",
    description: "AI-powered mental health tools — CBT exercises, mood tracking, crisis detection, and therapist matching.",
    category: "Verticals", subcategory: "Mental Health",
    tags: ["AI", "Mental Health", "Wellness", "CBT"],
    emoji: "🧠",
    githubUrl: `https://github.com/${OWNER}/mental-health-ai`,
    githubOwner: OWNER, githubRepo: "mental-health-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "education-ai",
    name: "EducationAI",
    tagline: "AI-powered education platform",
    description: "Personalized learning paths, AI tutoring, automated grading, and curriculum generation for educators and students.",
    category: "Verticals", subcategory: "Education",
    tags: ["AI", "Education", "EdTech", "Learning"],
    emoji: "🎓",
    githubUrl: `https://github.com/${OWNER}/education-ai`,
    githubOwner: OWNER, githubRepo: "education-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "agriculture-ai",
    name: "AgricultureAI",
    tagline: "AI precision agriculture platform",
    description: "Crop yield prediction, pest detection, soil analysis, and smart irrigation management powered by AI.",
    category: "Verticals", subcategory: "Agriculture",
    tags: ["AI", "Agriculture", "Farming", "Precision"],
    emoji: "🌾",
    githubUrl: `https://github.com/${OWNER}/agriculture-ai`,
    githubOwner: OWNER, githubRepo: "agriculture-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "real-estate-ai",
    name: "RealEstateAI",
    tagline: "AI real estate investment platform",
    description: "Property valuation, market analysis, investment scoring, and AI-generated property reports for investors and agents.",
    category: "Verticals", subcategory: "Real Estate",
    tags: ["AI", "Real Estate", "Investment", "Property"],
    emoji: "🏠",
    githubUrl: `https://github.com/${OWNER}/real-estate-ai`,
    githubOwner: OWNER, githubRepo: "real-estate-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "insurance-ai",
    name: "InsuranceAI",
    tagline: "AI insurance underwriting platform",
    description: "Automate underwriting, claims processing, fraud detection, and risk scoring with AI for insurance operations.",
    category: "Verticals", subcategory: "Insurance",
    tags: ["AI", "Insurance", "Underwriting", "Risk"],
    emoji: "🛡️",
    githubUrl: `https://github.com/${OWNER}/insurance-ai`,
    githubOwner: OWNER, githubRepo: "insurance-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "manufacturing-ai",
    name: "ManufacturingAI",
    tagline: "AI manufacturing operations platform",
    description: "Predictive maintenance, quality control, production optimization, and defect detection for manufacturing.",
    category: "Verticals", subcategory: "Manufacturing",
    tags: ["AI", "Manufacturing", "IoT", "Operations"],
    emoji: "🏭",
    githubUrl: `https://github.com/${OWNER}/manufacturing-ai`,
    githubOwner: OWNER, githubRepo: "manufacturing-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "fleet-management-ai",
    name: "FleetAI",
    tagline: "AI fleet management platform",
    description: "Route optimization, predictive maintenance, driver behavior analysis, and fuel efficiency for fleet operators.",
    category: "Verticals", subcategory: "Transportation",
    tags: ["AI", "Fleet", "Logistics", "Transportation"],
    emoji: "🚐",
    githubUrl: `https://github.com/${OWNER}/fleet-management-ai`,
    githubOwner: OWNER, githubRepo: "fleet-management-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "content-marketing-ai",
    name: "ContentMarketingAI",
    tagline: "AI content marketing vertical platform",
    description: "Full-stack AI content marketing — strategy, production, distribution, and performance analysis in one platform.",
    category: "Verticals", subcategory: "Marketing",
    tags: ["AI", "Content Marketing", "Strategy", "Analytics"],
    emoji: "📣",
    githubUrl: `https://github.com/${OWNER}/content-marketing-ai`,
    githubOwner: OWNER, githubRepo: "content-marketing-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "social-media-ai",
    name: "SocialMediaAI",
    tagline: "AI social media management platform",
    description: "Schedule, generate, and optimize social content with AI. Sentiment analysis, trend detection, and engagement automation.",
    category: "Verticals", subcategory: "Marketing",
    tags: ["AI", "Social Media", "Scheduling", "Automation"],
    emoji: "📱",
    githubUrl: `https://github.com/${OWNER}/social-media-ai`,
    githubOwner: OWNER, githubRepo: "social-media-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "personal-finance-ai",
    name: "PersonalFinanceAI",
    tagline: "AI personal finance management platform",
    description: "Budget optimization, investment recommendations, debt payoff strategies, and financial goal tracking with AI.",
    category: "Verticals", subcategory: "Finance",
    tags: ["AI", "Finance", "Budgeting", "Investing"],
    emoji: "💳",
    githubUrl: `https://github.com/${OWNER}/personal-finance-ai`,
    githubOwner: OWNER, githubRepo: "personal-finance-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "talent-intelligence-ai",
    name: "TalentIntelligenceAI",
    tagline: "AI talent intelligence platform",
    description: "Market talent mapping, compensation benchmarking, skills intelligence, and workforce planning for HR leaders.",
    category: "Verticals", subcategory: "HR",
    tags: ["AI", "Talent", "HR", "Workforce"],
    emoji: "🧩",
    githubUrl: `https://github.com/${OWNER}/talent-intelligence-ai`,
    githubOwner: OWNER, githubRepo: "talent-intelligence-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "inventory-management-ai",
    name: "InventoryAI",
    tagline: "AI inventory management platform",
    description: "Demand forecasting, reorder automation, dead stock reduction, and supplier optimization powered by AI.",
    category: "Verticals", subcategory: "Operations",
    tags: ["AI", "Inventory", "Supply Chain", "Operations"],
    emoji: "📦",
    githubUrl: `https://github.com/${OWNER}/inventory-management-ai`,
    githubOwner: OWNER, githubRepo: "inventory-management-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "cybersecurity-ai",
    name: "CybersecurityAI",
    tagline: "AI cybersecurity threat intelligence platform",
    description: "Threat detection, vulnerability scanning, incident response automation, and security posture management with AI.",
    category: "Verticals", subcategory: "Security",
    tags: ["AI", "Cybersecurity", "Threat Detection", "Security"],
    emoji: "🔒",
    githubUrl: `https://github.com/${OWNER}/cybersecurity-ai`,
    githubOwner: OWNER, githubRepo: "cybersecurity-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
  {
    id: "event-management-ai",
    name: "EventManagementAI",
    tagline: "AI event planning and management platform",
    description: "End-to-end AI event management — planning, attendee experience, logistics coordination, and post-event analytics.",
    category: "Verticals", subcategory: "Events",
    tags: ["AI", "Events", "Planning", "Management"],
    emoji: "🎪",
    githubUrl: `https://github.com/${OWNER}/event-management-ai`,
    githubOwner: OWNER, githubRepo: "event-management-ai",
    framework: "nextjs", defaultBranch: "main",
    buildCommand: "npm run build", installCommand: "npm install", outputDirectory: ".next",
    envVars: [{ key: "OPENAI_API_KEY", description: "OpenAI API key", required: true }],
  },
];

const CATEGORIES = ["All", "AI Tools", "SaaS Tools", "Consumer Apps", "Verticals"];

// ─── Deploy Modal ──────────────────────────────────────────────────────────────
function DeployModal({ app, onClose }: { app: MarketplaceApp; onClose: () => void }) {
  const { isAuthenticated } = useAuth();
  const createProject = trpc.projects.create.useMutation();
  const [envValues, setEnvValues] = useState<Record<string, string>>({});
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const handleDeploy = async () => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
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
    } catch (err) { console.error(err); }
    finally { setDeploying(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {deployed ? (
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto text-3xl">{app.emoji}</div>
            <h3 className="text-xl font-bold">Project Created!</h3>
            <p className="text-muted-foreground text-sm">{app.name} has been added to your projects. Configure env vars and trigger your first deployment from the dashboard.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>Close</Button>
              <Button className="flex-1 gap-2" onClick={() => (window.location.href = "/")}>
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{app.emoji}</span>
                <div>
                  <h3 className="text-xl font-bold">{app.name}</h3>
                  <p className="text-sm text-muted-foreground">{app.tagline}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">×</button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GitBranch className="w-4 h-4" />
              <a href={app.githubUrl} target="_blank" rel="noreferrer" className="hover:text-foreground flex items-center gap-1">
                {app.githubOwner}/{app.githubRepo} <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {app.envVars && app.envVars.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium">Environment Variables</p>
                {app.envVars.map((ev) => (
                  <div key={ev.key}>
                    <label className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <code className="font-mono">{ev.key}</code>
                      {ev.required && <span className="text-red-500">*</span>}
                      <span className="ml-1">{ev.description}</span>
                    </label>
                    <input
                      type="password"
                      placeholder={`Enter ${ev.key}`}
                      value={envValues[ev.key] || ""}
                      onChange={(e) => setEnvValues(p => ({ ...p, [ev.key]: e.target.value }))}
                      className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground grid grid-cols-2 gap-1">
              <span><span className="font-medium text-foreground">Framework:</span> {app.framework}</span>
              <span><span className="font-medium text-foreground">Branch:</span> {app.defaultBranch}</span>
              <span className="col-span-2"><span className="font-medium text-foreground">Build:</span> {app.buildCommand}</span>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
              <Button className="flex-1 gap-2" onClick={handleDeploy} disabled={deploying}>
                {deploying ? (
                  <><span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Deploying...</>
                ) : (
                  <><Rocket className="w-4 h-4" />Deploy to Vasage</>
                )}
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

// ─── App Card ─────────────────────────────────────────────────────────────────
function AppCard({ app, onDeploy }: { app: MarketplaceApp; onDeploy: (a: MarketplaceApp) => void }) {
  return (
    <Card className="p-5 hover:shadow-lg transition-all hover:-translate-y-0.5 flex flex-col gap-3 relative">
      {app.featured && (
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="gap-1 text-xs">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />Featured
          </Badge>
        </div>
      )}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-xl shrink-0">{app.emoji}</div>
        <div>
          <h3 className="font-bold text-sm leading-tight">{app.name}</h3>
          <p className="text-xs text-muted-foreground">{app.subcategory || app.category}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3">{app.description}</p>
      <div className="flex flex-wrap gap-1">
        {app.tags.slice(0, 4).map(t => (
          <Badge key={t} variant="outline" className="text-xs px-1.5 py-0">{t}</Badge>
        ))}
      </div>
      <div className="flex gap-2 pt-1">
        <Button variant="outline" size="sm" className="gap-1 text-xs" asChild>
          <a href={app.githubUrl} target="_blank" rel="noreferrer">
            <GitBranch className="w-3 h-3" />Source
          </a>
        </Button>
        <Button size="sm" className="flex-1 gap-1 text-xs" onClick={() => onDeploy(app)}>
          <Rocket className="w-3 h-3" />Deploy
        </Button>
      </div>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Marketplace() {
  const { isAuthenticated, logout } = useAuth();
  const [selectedApp, setSelectedApp] = useState<MarketplaceApp | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return APPS.filter(a => {
      const matchCat = activeCategory === "All" || a.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = !q || a.name.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q)) || a.description.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [activeCategory, search]);

  const featured = filtered.filter(a => a.featured);
  const rest = filtered.filter(a => !a.featured);

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
            <span className="text-sm font-medium">Marketplace</span>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Button variant="outline" size="sm" asChild><a href="/">Dashboard</a></Button>
                <Button variant="ghost" size="icon" onClick={logout}><LogOut className="w-4 h-4" /></Button>
              </>
            ) : (
              <a href={getLoginUrl()}><Button size="sm" className="gap-2">Sign In <ArrowRight className="w-4 h-4" /></Button></a>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-12 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
          <Zap className="w-3.5 h-3.5" />{APPS.length} production-ready apps
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">App Marketplace</h1>
        <p className="text-lg text-muted-foreground max-w-lg mx-auto">
          One-click deploy AI SaaS tools, consumer apps, and vertical platforms to Vasage.
        </p>
      </section>

      {/* Filters */}
      <section className="container pb-6">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* Category tabs */}
          <div className="flex gap-1 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
                <span className="ml-1.5 text-xs opacity-60">
                  {cat === "All" ? APPS.length : APPS.filter(a => a.category === cat).length}
                </span>
              </button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search apps..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 w-48"
            />
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="container pb-8">
          <h2 className="text-base font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />Featured
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map(app => <AppCard key={app.id} app={app} onDeploy={setSelectedApp} />)}
          </div>
        </section>
      )}

      {/* All Apps */}
      {rest.length > 0 && (
        <section className="container pb-20">
          <h2 className="text-base font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            {activeCategory === "All" ? "All Apps" : activeCategory}
            <span className="text-xs">({rest.length})</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rest.map(app => <AppCard key={app.id} app={app} onDeploy={setSelectedApp} />)}
          </div>
        </section>
      )}

      {filtered.length === 0 && (
        <div className="container pb-20 text-center text-muted-foreground py-16">
          No apps found for "{search}"
        </div>
      )}

      {selectedApp && <DeployModal app={selectedApp} onClose={() => setSelectedApp(null)} />}
    </div>
  );
}