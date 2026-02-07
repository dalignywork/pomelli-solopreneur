/**
 * Zustand store pour le wizard 3 étapes.
 * Gère l'état du flow Brand → Generate → Export.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BrandDNA, GeneratedVariation, CarouselResponse } from "@/types";

interface WizardState {
  // Step 1: Brand DNA
  currentStep: 1 | 2 | 3;
  brandDNA: BrandDNA | null;
  logoFile: File | null;
  websiteUrl: string;

  // Step 2: Generation
  topic: string;
  contentType: "post" | "carousel";
  generatedVariations: GeneratedVariation[];
  generatedCarousel: CarouselResponse | null;
  selectedVariation: number; // Index de la variation sélectionnée

  // Step 3: Export
  figmaJson: Record<string, any> | null;

  // Actions
  setStep: (step: 1 | 2 | 3) => void;
  nextStep: () => void;
  prevStep: () => void;

  setBrandDNA: (brandDNA: BrandDNA) => void;
  setLogoFile: (file: File | null) => void;
  setWebsiteUrl: (url: string) => void;

  setTopic: (topic: string) => void;
  setContentType: (type: "post" | "carousel") => void;
  setGeneratedVariations: (variations: GeneratedVariation[]) => void;
  setGeneratedCarousel: (carousel: CarouselResponse) => void;
  setSelectedVariation: (index: number) => void;

  setFigmaJson: (json: Record<string, any>) => void;

  reset: () => void;
}

const initialState = {
  currentStep: 1 as const,
  brandDNA: null,
  logoFile: null,
  websiteUrl: "",
  topic: "",
  contentType: "post" as const,
  generatedVariations: [],
  generatedCarousel: null,
  selectedVariation: 0,
  figmaJson: null,
};

export const useWizardStore = create<WizardState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const current = get().currentStep;
        if (current < 3) {
          set({ currentStep: (current + 1) as 1 | 2 | 3 });
        }
      },

      prevStep: () => {
        const current = get().currentStep;
        if (current > 1) {
          set({ currentStep: (current - 1) as 1 | 2 | 3 });
        }
      },

      setBrandDNA: (brandDNA) => set({ brandDNA }),
      setLogoFile: (file) => set({ logoFile: file }),
      setWebsiteUrl: (url) => set({ websiteUrl: url }),

      setTopic: (topic) => set({ topic }),
      setContentType: (type) => set({ contentType: type }),
      setGeneratedVariations: (variations) => set({ generatedVariations: variations }),
      setGeneratedCarousel: (carousel) => set({ generatedCarousel: carousel }),
      setSelectedVariation: (index) => set({ selectedVariation: index }),

      setFigmaJson: (json) => set({ figmaJson: json }),

      reset: () => set(initialState),
    }),
    {
      name: "wizard-storage",
      partialize: (state) => ({
        // Ne pas persister logoFile (non-serializable)
        currentStep: state.currentStep,
        brandDNA: state.brandDNA,
        websiteUrl: state.websiteUrl,
        topic: state.topic,
        contentType: state.contentType,
        selectedVariation: state.selectedVariation,
      }),
    }
  )
);
