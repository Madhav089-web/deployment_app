import { create } from 'zustand';

export interface DesignParameters {
  type: 'hoodie' | 'tshirt' | 'jacket' | 'dress';
  color: string;
  pattern: string;
  fit: 'regular' | 'oversized' | 'slim';
  sleeve_length: 'short' | 'long' | 'none';
  fabric: 'cotton' | 'denim' | 'silk' | 'leather';
  confidence_score?: number;
}

interface DesignHistory {
  id: string;
  prompt: string;
  design: DesignParameters;
  timestamp: number;
}

interface DesignState {
  currentPrompt: string;
  isGenerating: boolean;
  currentDesign: DesignParameters | null;
  history: DesignHistory[];
  
  setCurrentPrompt: (prompt: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setCurrentDesign: (design: DesignParameters) => void;
  addToHistory: (prompt: string, design: DesignParameters) => void;
  resetDesign: () => void;
}

export const useDesignStore = create<DesignState>((set) => ({
  currentPrompt: '',
  isGenerating: false,
  currentDesign: null,
  history: [],
  
  setCurrentPrompt: (prompt) => set({ currentPrompt: prompt }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setCurrentDesign: (design) => set({ currentDesign: design }),
  addToHistory: (prompt, design) => set((state) => ({
    history: [
      { id: Math.random().toString(36).substring(7), prompt, design, timestamp: Date.now() },
      ...state.history,
    ]
  })),
  resetDesign: () => set({ currentDesign: null, currentPrompt: '' }),
}));
