"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useDesignStore } from "@/store/useDesignStore";
import ThreeDViewer from "@/components/ThreeDViewer";
import { toast } from "sonner";
import { Sparkles, Send, Scissors, ShoppingBag, LogOut, Loader2, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const { 
    currentPrompt, setCurrentPrompt, 
    isGenerating, setIsGenerating, 
    currentDesign, setCurrentDesign, 
    addToHistory, history, resetDesign 
  } = useDesignStore();

  const [promptInput, setPromptInput] = useState("");
  const [editInput, setEditInput] = useState("");
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsGenerating(true);
    setCurrentPrompt(promptInput);

    try {
      const res = await fetch("/api/generate-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptInput }),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      setCurrentDesign(data.design);
      addToHistory(promptInput, data.design);
      setPromptInput("");
      toast.success("Design generated successfully!");
    } catch (error) {
      toast.error("Failed to generate design");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editInput.trim() || !currentDesign) return;

    setIsGenerating(true);
    
    // Combine current state with edit prompt
    const combinedPrompt = `Current design: ${JSON.stringify(currentDesign)}. User wants to change: ${editInput}. Keep everything else the same, just apply the changes requested.`;

    try {
      const res = await fetch("/api/generate-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: combinedPrompt }),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      setCurrentDesign(data.design);
      addToHistory(editInput, data.design);
      setEditInput("");
      toast.success("Design updated successfully!");
    } catch (error) {
      toast.error("Failed to update design");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOrder = async () => {
    if (!currentDesign) return;
    setIsOrdering(true);

    try {
      const res = await fetch("/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          design_prompt: currentPrompt,
          generated_json: currentDesign,
          size,
          quantity,
          total_price: 150.00 * quantity, // Mock price
        }),
      });

      if (!res.ok) throw new Error("Failed to place order");

      toast.success("Order placed! Your custom design has been sent for manufacturing.");
    } catch (error) {
      toast.error("Failed to place order");
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    <div className="flex-1 bg-background flex flex-col h-screen overflow-hidden">
      {/* Dashboard Header */}
      <header className="h-16 glass-panel border-b border-white/5 flex items-center justify-between px-6 z-20">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-bold text-gradient">AI Fashion Designer</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground hidden md:inline-block">
            {session?.user?.email}
          </span>
          <button 
            onClick={() => signOut()}
            className="p-2 rounded-full hover:bg-white/10 transition text-muted-foreground hover:text-white"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Panel - Controls */}
        <div className="w-full lg:w-[400px] h-full overflow-y-auto border-r border-white/5 p-6 flex flex-col space-y-6 z-10 glass-panel">
          
          {/* Create Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Create
            </h2>
            <form onSubmit={handleGenerate} className="space-y-3">
              <textarea 
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Describe your fashion design... (e.g. Black oversized hoodie with neon blue accents)"
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-24"
              />
              <button 
                type="submit"
                disabled={isGenerating || !promptInput.trim()}
                className="w-full bg-primary text-white text-sm font-medium py-2.5 rounded-xl hover:bg-primary/90 transition shadow-[0_0_15px_rgba(139,92,246,0.2)] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Generate AI Design
              </button>
            </form>
          </section>

          {/* Edit Section */}
          <AnimatePresence>
            {currentDesign && (
              <motion.section 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-4 border-t border-white/10"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Scissors className="w-4 h-4 text-accent" /> Edit
                  </h2>
                  <button onClick={resetDesign} className="text-xs text-muted-foreground hover:text-white flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Reset
                  </button>
                </div>
                <form onSubmit={handleEdit} className="space-y-3">
                  <input 
                    type="text"
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    placeholder="Tell AI what to change... (e.g. Make sleeves shorter)"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                  />
                  <button 
                    type="submit"
                    disabled={isGenerating || !editInput.trim()}
                    className="w-full glass-panel text-white text-sm font-medium py-2.5 rounded-xl hover:bg-white/10 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Update Design
                  </button>
                </form>
              </motion.section>
            )}
          </AnimatePresence>

          {/* Order Section */}
          <AnimatePresence>
            {currentDesign && (
              <motion.section 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 pt-4 border-t border-white/10 flex-1 flex flex-col justify-end pb-4"
              >
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-green-400" /> Place Order
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Size</label>
                    <select 
                      value={size} 
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
                    >
                      {['XS', 'S', 'M', 'L', 'XL'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Quantity</label>
                    <input 
                      type="number" 
                      min="1" max="10"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-400"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Total Price:</span>
                  <span className="text-xl font-bold">${(150 * quantity).toFixed(2)}</span>
                </div>

                <button 
                  onClick={handleOrder}
                  disabled={isOrdering}
                  className="w-full bg-green-500/20 text-green-400 border border-green-500/50 text-sm font-medium py-3 rounded-xl hover:bg-green-500/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isOrdering ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
                  Place Order
                </button>
              </motion.section>
            )}
          </AnimatePresence>

        </div>

        {/* Right Panel - 3D Viewer */}
        <div className="flex-1 h-full p-6 relative">
          <ThreeDViewer />
          
          {/* Loading Overlay */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-6 bg-black/60 backdrop-blur-sm rounded-3xl z-20 flex flex-col items-center justify-center space-y-4"
              >
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/30 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                </div>
                <div className="text-lg font-medium text-gradient animate-pulse">
                  Generating AI Fashion Design...
                </div>
                <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
