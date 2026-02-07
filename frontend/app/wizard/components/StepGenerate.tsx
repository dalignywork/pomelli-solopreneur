/**
 * Step 2: Generation
 * Entre un sujet → Génère 3 variations de posts
 */

"use client";

import { useState } from "react";
import { useWizardStore } from "@/stores/wizardStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Spinner } from "@/components/ui/Spinner";
import { apiClient } from "@/lib/ai/client";
import { Tone, Sector } from "@/types";

export default function StepGenerate() {
  const {
    topic,
    brandDNA,
    contentType,
    setTopic,
    setContentType,
    setGeneratedVariations,
    setSelectedVariation,
    nextStep,
    prevStep,
  } = useWizardStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variations, setVariations] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Veuillez entrer un sujet");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.quickPost({
        topic,
        tone: brandDNA?.tone || Tone.PROFESSIONNEL,
        sector: brandDNA?.sector || Sector.AUTRE,
      });

      setVariations(result.variations);
      setGeneratedVariations(result.variations);
      setSelectedVariation(0);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Erreur lors de la génération");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVariation = (index: number) => {
    setSelectedVariation(index);
    nextStep();
  };

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>✨ Étape 2 : Génération</CardTitle>
          <CardDescription>
            Entre ton sujet et génère 3 variations de posts LinkedIn
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            label="Sujet du post"
            placeholder="Ex: 3 erreurs en personal branding"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          {brandDNA && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm">
              <p className="font-semibold text-blue-900">Brand DNA actif:</p>
              <p className="text-blue-700">
                Ton: {brandDNA.tone} • Secteur: {brandDNA.sector}
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={prevStep} variant="outline">
              ← Retour
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={!topic.trim() || isLoading}
              isLoading={isLoading}
              className="flex-1"
            >
              {isLoading ? "Génération..." : "Générer 3 variations"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-gray-600">
            IA en train de générer tes posts...
          </p>
        </div>
      )}

      {/* Variations */}
      {variations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Sélectionne une variation:</h3>

          {variations.map((variation, index) => (
            <Card
              key={index}
              className="cursor-pointer transition-all hover:border-blue-500"
              onClick={() => handleSelectVariation(index)}
            >
              <CardContent className="pt-6">
                {variation.hook && (
                  <p className="mb-3 font-bold text-gray-900">
                    {variation.hook}
                  </p>
                )}
                <p className="whitespace-pre-wrap text-gray-700">
                  {variation.text.slice(0, 300)}...
                </p>
                {variation.hashtags.length > 0 && (
                  <p className="mt-3 text-sm text-blue-600">
                    {variation.hashtags.join(" ")}
                  </p>
                )}
                <Button variant="outline" className="mt-4">
                  Choisir cette version →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
