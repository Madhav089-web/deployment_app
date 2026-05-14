"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Zap, Box, Layers } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex-1 bg-background flex flex-col items-center overflow-hidden">
      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center z-10">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold tracking-tight text-gradient">AI Fashion Designer</span>
        </div>
        <div className="flex space-x-4">
          <Link href="/login" className="px-4 py-2 rounded-full text-sm font-medium hover:bg-white/5 transition">
            Login
          </Link>
          <Link href="/signup" className="px-4 py-2 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary/90 transition shadow-[0_0_15px_rgba(139,92,246,0.5)]">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center relative z-10 py-20">
        {/* Background glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl space-y-6"
        >
          <div className="inline-flex items-center space-x-2 glass-panel px-4 py-2 rounded-full mb-4">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse"></span>

          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Design. Visualize. <br />
            <span className="text-gradient">Wear.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of fashion. Type a prompt, generate stunning 3D clothing designs in real-time, and bring your imagination to life.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold bg-white text-black hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Start Designing
            </Link>
            <Link href="#features" className="w-full sm:w-auto px-8 py-4 rounded-full text-base font-semibold glass-panel hover:bg-white/10 transition">
              Explore Features
            </Link>
          </div>
        </motion.div>

        {/* Features grid */}
        <div id="features" className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mt-32">
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-accent" />}
            title="Real-time Generation"
            description="Type a description and watch AI craft structured 3D designs instantly using Groq's lightning-fast models."
            delay={0.2}
          />
          <FeatureCard
            icon={<Box className="w-6 h-6 text-primary" />}
            title="Interactive 3D Viewer"
            description="Rotate, zoom, and inspect your custom clothing on dynamic parametric models rendered in React Three Fiber."
            delay={0.4}
          />
          <FeatureCard
            icon={<Layers className="w-6 h-6 text-pink-500" />}
            title="Iterative Editing"
            description="Don't like the sleeves? Just tell the AI to make them shorter. Edit naturally with conversational prompts."
            delay={0.6}
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel p-8 rounded-3xl text-left border border-white/5 hover:border-white/10 transition-colors"
    >
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
