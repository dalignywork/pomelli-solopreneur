/**
 * Step 1: Brand DNA
 * Upload logo + scrape website → Générer Brand DNA
 */

"use client";

import { useState } from "react";
import { useWizardStore } from "@/stores/wizardStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { apiClient } from "@/lib/ai/client";
import type { BrandDNA, ColorPalette } from "@/types";

export default function StepBrand() {
  const {
    logoFile,
    websiteUrl,
    setLogoFile,
    setWebsiteUrl,
    setBrandDNA,
    nextStep,
  } = useWizardStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewPalette, setPreviewPalette] = useState<ColorPalette | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!logoFile && !websiteUrl) {
      setError("Veuillez uploader un logo ou entrer une URL de site web");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.analyzeComplete(logoFile || undefined, websiteUrl || undefined);

      setBrandDNA(result.brand_dna);
      setPreviewPalette(result.brand_dna.colors);

      // Auto next step après 2 secondes
      setTimeout(() => {
        nextStep();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erreur lors de l'analyse");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>🎨 Étape 1 : Brand DNA</CardTitle>
          <CardDescription>
            Upload ton logo et/ou entre l'URL de ton site pour extraire ton Brand DNA
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Logo (optionnel)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
            />
            {logoFile && (
              <p className="mt-2 text-sm text-green-600">
                ✓ {logoFile.name}
              </p>
            )}
          </div>

          {/* Website URL */}
          <Input
            label="URL de ton site web (optionnel)"
            type="url"
            placeholder="https://ton-site.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
          />

          {/* Preview Palette */}
          {previewPalette && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h4 className="mb-3 font-semibold text-green-900">
                ✓ Palette extraite
              </h4>
              <div className="flex gap-2">
                {[
                  previewPalette.primary,
                  previewPalette.secondary,
                  previewPalette.accent,
                  ...previewPalette.neutrals.slice(0, 2),
                ].map((color, i) => (
                  <div key={i} className="text-center">
                    <div
                      className="mb-1 h-12 w-12 rounded-lg border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-xs text-gray-600">{color}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button
            onClick={handleAnalyze}
            disabled={(!logoFile && !websiteUrl) || isLoading}
            isLoading={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "Analyse en cours..." : "Analyser mon Brand DNA"}
          </Button>
        </CardFooter>
      </Card>

      {isLoading && (
        <div className="mt-6 text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-gray-600">
            Extraction des couleurs et analyse du site...
          </p>
        </div>
      )}
    </div>
  );
}
