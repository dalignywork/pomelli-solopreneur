/**
 * Step 3: Export
 * Preview + Download JSON Figma
 */

"use client";

import { useWizardStore } from "@/stores/wizardStore";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { downloadJSON } from "@/lib/utils";

export default function StepExport() {
  const {
    generatedVariations,
    selectedVariation,
    brandDNA,
    topic,
    prevStep,
    reset,
  } = useWizardStore();

  const variation = generatedVariations[selectedVariation];

  const handleDownloadJSON = () => {
    if (!variation) return;

    const figmaJson = {
      name: "LinkedIn Post",
      type: "POST",
      content: {
        hook: variation.hook || "",
        body: variation.text,
        cta: variation.cta || "",
        hashtags: variation.hashtags.join(" "),
      },
      colors: brandDNA?.colors || {
        primary: "#000000",
        secondary: "#FFFFFF",
        accent: "#4A90E2",
      },
      layout: {
        width: 1080,
        height: 1080,
        padding: 60,
      },
      metadata: {
        topic,
        generated_at: new Date().toISOString(),
      },
    };

    downloadJSON(figmaJson, `linkedin-post-${topic.slice(0, 20).replace(/\s+/g, "-")}.json`);
  };

  const handleRestart = () => {
    reset();
  };

  if (!variation) {
    return (
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-gray-500">Aucun contenu sélectionné</p>
        <Button onClick={prevStep} className="mt-4">
          ← Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>📦 Étape 3 : Export</CardTitle>
          <CardDescription>
            Preview et télécharge ton post en JSON pour Figma
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Preview */}
          <div className="mb-6 rounded-xl border-2 border-gray-200 bg-white p-8">
            {variation.hook && (
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                {variation.hook}
              </h3>
            )}
            <p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-700">
              {variation.text}
            </p>
            {variation.cta && (
              <p className="mt-6 font-semibold text-blue-600">
                {variation.cta}
              </p>
            )}
            {variation.hashtags.length > 0 && (
              <p className="mt-4 text-blue-500">
                {variation.hashtags.join(" ")}
              </p>
            )}
          </div>

          {/* Color Palette */}
          {brandDNA?.colors && (
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h4 className="mb-3 font-semibold text-gray-900">
                Palette de couleurs
              </h4>
              <div className="flex gap-3">
                {[
                  { name: "Primary", color: brandDNA.colors.primary },
                  { name: "Secondary", color: brandDNA.colors.secondary },
                  { name: "Accent", color: brandDNA.colors.accent },
                ].map((item) => (
                  <div key={item.name} className="text-center">
                    <div
                      className="mb-2 h-16 w-16 rounded-lg border border-gray-300"
                      style={{ backgroundColor: item.color }}
                    />
                    <p className="text-xs font-medium text-gray-600">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">{item.color}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={prevStep} variant="outline">
              ← Modifier
            </Button>
            <Button onClick={handleDownloadJSON} className="flex-1">
              Télécharger JSON Figma
            </Button>
          </div>

          <Button
            onClick={handleRestart}
            variant="ghost"
            className="mt-4 w-full"
          >
            Créer un nouveau post
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
