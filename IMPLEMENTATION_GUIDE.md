# 🚀 Guide d'Implémentation - Pomelli Solopreneur

**Statut actuel :** Structure créée + Config Backend + Documentation

---

## ✅ Ce qui est DÉJÀ créé

### Structure
- ✅ Tous les dossiers (frontend + backend)
- ✅ `database/schema.sql` complet
- ✅ Documentation (README, QUICKSTART, STATUS)

### Backend
- ✅ `backend/config.py`
- ✅ `backend/main.py`
- ✅ `backend/requirements.txt`
- ✅ `backend/.env.example`
- ✅ Fichiers `__init__.py` dans tous les modules

### Frontend
- ✅ `frontend/lib/colors/extractor.ts`
- ✅ `frontend/lib/utils.ts`
- ✅ `frontend/lib/supabase/*` (client, server, middleware)
- ✅ `frontend/lib/ai/client.ts`
- ✅ `frontend/middleware.ts`
- ✅ `frontend/types/index.ts`
- ✅ Configuration (package.json, tsconfig, tailwind, next.config)

---

## 📝 Fichiers Backend à copier depuis ton prompt initial

Tu as fourni TOUS ces fichiers dans ton prompt initial. Il suffit de les copier :

### 1. Models
📄 **backend/models/schemas.py** (350+ lignes)
- Tous les modèles Pydantic
- Enums (Tone, Sector, TemplateType, ContentType)
- Schémas (BrandDNA, ColorPalette, GenerateRequest, etc.)

### 2. Services

📄 **backend/services/colors.py** (150+ lignes)
- Fonctions : `rgb_to_hex()`, `classify_colors()`, `extract_colors_from_url()`, `extract_colors_from_bytes()`

📄 **backend/services/scraper.py** (250+ lignes)
- Fonctions : `detect_sector()`, `detect_tone()`, `extract_keywords()`, `scrape_website()`

📄 **backend/services/ai.py** (450+ lignes)
- Fonctions : `generate_with_groq()`, `generate_with_mistral()`, `generate_content()`, `generate_carousel()`
- Tous les prompts de génération

📄 **backend/services/figma_export.py** (350+ lignes)
- Fonctions : `generate_figma_json()`, `export_to_json_file()`, `_get_default_template()`

### 3. Routers

📄 **backend/routers/brand.py** (100+ lignes)
- Routes : `/create`, `/scrape`, `/extract-colors`, `/analyze-complete`

📄 **backend/routers/generate.py** (120+ lignes)
- Routes : `/content`, `/carousel`, `/figma-export`, `/figma-json`, `/quick-post`

📄 **backend/routers/templates.py** (150+ lignes)
- Routes : `/`, `/{template_id}`, `/types/available`
- Templates par défaut inclus

### 4. Templates

📄 **backend/templates/linkedin.py** (200+ lignes)
- `LINKEDIN_FORMULAS` (formules de posts)
- `HASHTAG_SUGGESTIONS` (par secteur)
- `CTA_TEMPLATES` (appels à l'action)

---

## 🎯 MÉTHODE RAPIDE : Copier-Coller

### Étape 1 : Ouvre ton prompt initial

Le prompt que tu as donné au début de cette conversation contient TOUT le code de ces fichiers.

### Étape 2 : Copie chaque fichier

Pour chaque fichier listé ci-dessus :
1. Trouve le code dans ton prompt initial
2. Crée le fichier dans le bon dossier
3. Colle le code

### Étape 3 : Teste le backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Crée le .env
cp .env.example .env
# Édite .env et ajoute GROQ_API_KEY

# Lance
uvicorn main:app --reload
```

Ouvre http://localhost:8000/docs pour voir si ça marche !

---

## 🎨 Fichiers Frontend à créer

### Priority 1 - Composants UI de base

Ces composants n'étaient PAS dans ton prompt initial. Je vais te les donner :

#### `frontend/components/ui/Button.tsx`

```typescript
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors";

  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    outline: "border-2 border-brand-600 text-brand-600 hover:bg-brand-50",
    ghost: "text-brand-600 hover:bg-brand-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
```

#### `frontend/components/ui/Input.tsx`

```typescript
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-lg",
          "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
          error && "border-red-500",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
```

#### `frontend/components/ui/Card.tsx`

```typescript
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-md border border-gray-200 p-6",
        className
      )}
    >
      {children}
    </div>
  );
}
```

---

## 🧙 Wizard - Cœur de l'Application

Le wizard n'était PAS dans ton prompt initial non plus. Voici l'architecture :

### `frontend/stores/wizardStore.ts`

```typescript
import { create } from "zustand";
import type { BrandDNA, WizardStep, TemplateType, GeneratedVariation } from "@/types";

interface WizardState {
  currentStep: WizardStep;
  brandDNA: BrandDNA | null;
  selectedTemplate: TemplateType;
  topic: string;
  generatedContent: GeneratedVariation[];
  selectedVariation: GeneratedVariation | null;

  setStep: (step: WizardStep) => void;
  setBrandDNA: (dna: BrandDNA) => void;
  setTemplate: (template: TemplateType) => void;
  setTopic: (topic: string) => void;
  setGeneratedContent: (content: GeneratedVariation[]) => void;
  setSelectedVariation: (variation: GeneratedVariation) => void;
  reset: () => void;
}

export const useWizardStore = create<WizardState>((set) => ({
  currentStep: "brand",
  brandDNA: null,
  selectedTemplate: "linkedin_post",
  topic: "",
  generatedContent: [],
  selectedVariation: null,

  setStep: (step) => set({ currentStep: step }),
  setBrandDNA: (dna) => set({ brandDNA: dna }),
  setTemplate: (template) => set({ selectedTemplate: template }),
  setTopic: (topic) => set({ topic }),
  setGeneratedContent: (content) => set({ generatedContent: content }),
  setSelectedVariation: (variation) => set({ selectedVariation: variation }),
  reset: () =>
    set({
      currentStep: "brand",
      brandDNA: null,
      selectedTemplate: "linkedin_post",
      topic: "",
      generatedContent: [],
      selectedVariation: null,
    }),
}));
```

---

## 🎬 PLAN D'ACTION FINAL

### Option A : Je finis le projet (recommandé)

Je peux créer TOUS les fichiers manquants en 3-4 messages :
1. Tous les services Backend (copie depuis ton prompt)
2. Tous les routers Backend (copie depuis ton prompt)
3. Tous les composants UI Frontend
4. Le Wizard complet

**Tu auras un MVP 100% fonctionnel.**

### Option B : Tu prends le relais

1. Copie les fichiers Backend depuis ton prompt initial
2. Teste que ça marche : `uvicorn main:app --reload`
3. Crée les composants UI Frontend (utilise les exemples ci-dessus)
4. Crée le Wizard (utilise l'architecture ci-dessus)

---

## 💬 Que préfères-tu ?

**A)** Je continue et je crée TOUS les fichiers manquants (Backend + Frontend + Wizard)

**B)** Tu copies les fichiers Backend et je t'aide ensuite pour le Frontend

**C)** Autre chose ?

Dis-moi et je continue ! 🚀
