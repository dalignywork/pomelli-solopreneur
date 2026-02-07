/**
 * Extraction de couleurs côté client (navigateur).
 * Utilise un canvas HTML5 pour analyser les pixels de l'image.
 * Alternative gratuite aux bibliothèques tierces.
 */

import type { ColorPalette } from "@/types";

interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Convertit RGB en hex
 */
function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

/**
 * Calcule la distance entre deux couleurs
 */
function colorDistance(c1: RGB, c2: RGB): number {
  return Math.sqrt(
    Math.pow(c1.r - c2.r, 2) +
      Math.pow(c1.g - c2.g, 2) +
      Math.pow(c1.b - c2.b, 2)
  );
}

/**
 * Calcule la luminance d'une couleur
 */
function getLuminance(rgb: RGB): number {
  return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
}

/**
 * Vérifie si une couleur est trop claire (proche du blanc)
 */
function isTooLight(rgb: RGB): boolean {
  return getLuminance(rgb) > 0.95;
}

/**
 * Vérifie si une couleur est trop foncée (proche du noir)
 */
function isTooDark(rgb: RGB): boolean {
  return getLuminance(rgb) < 0.05;
}

/**
 * Vérifie si une couleur est trop grise (peu saturée)
 */
function isTooGray(rgb: RGB): boolean {
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const saturation = max === 0 ? 0 : (max - min) / max;
  return saturation < 0.15;
}

/**
 * Algorithme simple de quantification des couleurs.
 * Regroupe les pixels similaires pour trouver les couleurs dominantes.
 */
function quantizeColors(pixels: RGB[], numColors: number): RGB[] {
  if (pixels.length === 0) return [];

  // Échantillonner pour la performance
  const sampleSize = Math.min(pixels.length, 5000);
  const step = Math.floor(pixels.length / sampleSize);
  const sampled: RGB[] = [];

  for (let i = 0; i < pixels.length; i += step) {
    sampled.push(pixels[i]);
  }

  // Filtrer les couleurs trop claires, trop foncées ou trop grises
  const filtered = sampled.filter(
    (color) => !isTooLight(color) && !isTooDark(color) && !isTooGray(color)
  );

  if (filtered.length === 0) {
    // Si toutes les couleurs ont été filtrées, retourner les échantillonnées
    return sampled.slice(0, numColors);
  }

  // K-means simplifié
  const maxIterations = 10;
  let centroids: RGB[] = [];

  // Initialiser avec des couleurs aléatoires
  for (let i = 0; i < Math.min(numColors, filtered.length); i++) {
    const idx = Math.floor((i / numColors) * filtered.length);
    centroids.push({ ...filtered[idx] });
  }

  // Itérations K-means
  for (let iter = 0; iter < maxIterations; iter++) {
    // Assigner chaque pixel au centroïde le plus proche
    const clusters: RGB[][] = Array(centroids.length)
      .fill(null)
      .map(() => []);

    for (const pixel of filtered) {
      let minDist = Infinity;
      let closestIdx = 0;

      for (let i = 0; i < centroids.length; i++) {
        const dist = colorDistance(pixel, centroids[i]);
        if (dist < minDist) {
          minDist = dist;
          closestIdx = i;
        }
      }

      clusters[closestIdx].push(pixel);
    }

    // Recalculer les centroïdes
    const newCentroids: RGB[] = [];
    for (const cluster of clusters) {
      if (cluster.length === 0) {
        // Garder l'ancien centroïde si le cluster est vide
        newCentroids.push(centroids[newCentroids.length]);
        continue;
      }

      const sum = cluster.reduce(
        (acc, color) => ({
          r: acc.r + color.r,
          g: acc.g + color.g,
          b: acc.b + color.b,
        }),
        { r: 0, g: 0, b: 0 }
      );

      newCentroids.push({
        r: Math.round(sum.r / cluster.length),
        g: Math.round(sum.g / cluster.length),
        b: Math.round(sum.b / cluster.length),
      });
    }

    centroids = newCentroids;
  }

  return centroids;
}

/**
 * Classifie les couleurs extraites en palette utilisable
 */
function classifyPalette(colors: RGB[]): ColorPalette {
  if (colors.length === 0) {
    return {
      primary: "#2563EB",
      secondary: "#1E40AF",
      accent: "#F59E0B",
      text: "#1F2937",
      background: "#FFFFFF",
    };
  }

  // Trier par luminance
  const sorted = [...colors].sort(
    (a, b) => getLuminance(b) - getLuminance(a)
  );

  const primary = rgbToHex(colors[0].r, colors[0].g, colors[0].b);
  const secondary =
    colors.length > 1
      ? rgbToHex(colors[1].r, colors[1].g, colors[1].b)
      : "#1E40AF";
  const accent =
    colors.length > 2
      ? rgbToHex(colors[2].r, colors[2].g, colors[2].b)
      : "#F59E0B";

  // Texte : la couleur la plus foncée
  const darkest = sorted[sorted.length - 1];
  const text = getLuminance(darkest) < 0.3
    ? rgbToHex(darkest.r, darkest.g, darkest.b)
    : "#1F2937";

  // Background : la couleur la plus claire
  const lightest = sorted[0];
  const background = getLuminance(lightest) > 0.8
    ? rgbToHex(lightest.r, lightest.g, lightest.b)
    : "#FFFFFF";

  return {
    primary,
    secondary,
    accent,
    text,
    background,
  };
}

/**
 * Extrait les couleurs dominantes d'une image côté client.
 * Utilise un canvas HTML5 pour analyser les pixels.
 */
export async function extractColorsFromImage(
  file: File,
  numColors: number = 6
): Promise<{ palette: ColorPalette; all_colors: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Créer un canvas pour analyser l'image
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Impossible de créer le contexte canvas"));
            return;
          }

          // Redimensionner pour la performance (max 200px)
          const maxSize = 200;
          const scale = Math.min(maxSize / img.width, maxSize / img.height);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;

          // Dessiner l'image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Extraire les pixels
          const imageData = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          const data = imageData.data;

          // Convertir en RGB
          const pixels: RGB[] = [];
          for (let i = 0; i < data.length; i += 4) {
            pixels.push({
              r: data[i],
              g: data[i + 1],
              b: data[i + 2],
              // data[i + 3] est l'alpha (transparence)
            });
          }

          // Quantifier les couleurs
          const dominantColors = quantizeColors(pixels, numColors);

          // Convertir en hex
          const allColorsHex = dominantColors.map((c) =>
            rgbToHex(c.r, c.g, c.b)
          );

          // Classifier en palette
          const palette = classifyPalette(dominantColors);

          resolve({
            palette,
            all_colors: allColorsHex,
          });
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error("Impossible de charger l'image"));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("Impossible de lire le fichier"));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Extrait les couleurs depuis une URL d'image
 */
export async function extractColorsFromURL(
  imageUrl: string,
  numColors: number = 6
): Promise<{ palette: ColorPalette; all_colors: string[] }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Pour éviter les problèmes CORS

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Impossible de créer le contexte canvas"));
          return;
        }

        const maxSize = 200;
        const scale = Math.min(maxSize / img.width, maxSize / img.height);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const pixels: RGB[] = [];
        for (let i = 0; i < data.length; i += 4) {
          pixels.push({
            r: data[i],
            g: data[i + 1],
            b: data[i + 2],
          });
        }

        const dominantColors = quantizeColors(pixels, numColors);
        const allColorsHex = dominantColors.map((c) =>
          rgbToHex(c.r, c.g, c.b)
        );
        const palette = classifyPalette(dominantColors);

        resolve({
          palette,
          all_colors: allColorsHex,
        });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Impossible de charger l'image depuis l'URL"));
    };

    img.src = imageUrl;
  });
}
