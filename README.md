# 🎨 Pomelli-Like pour Solopreneurs

**Générateur de Personal Branding IA** - Créé du contenu LinkedIn avec l'IA puis finalise dans Figma.

## 📋 Vue d'ensemble

Ce projet est une alternative à Google Labs Pomelli, optimisée pour les solopreneurs français/européens en personal branding. L'outil :
- ✅ Extrait le "Brand DNA" depuis logo + site web
- ✅ Génère du contenu LinkedIn/Instagram avec l'IA (Groq/Mistral)
- ✅ Exporte en JSON pour finalisation dans Figma
- ✅ Budget : 0-20€/mois maximum

---

## 🛠️ Stack Technique

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (Auth + BDD)
- **Zustand** (State management)

### Backend
- **FastAPI** (Python)
- **Groq API** (Llama 3 - GRATUIT)
- **Mistral AI** (0.10€/1M tokens)
- **BeautifulSoup** (Web scraping)
- **ColorThief** (Extraction couleurs)

### Déploiement
- **Vercel** (Frontend - gratuit)
- **Supabase** (BDD - gratuit)
- **Railway/Render** (Backend - gratuit)

---

## 🚀 Installation Rapide

### 1. Prérequis

```bash
# Node.js 18+
node --version

# Python 3.9+
python3 --version

# Git
git --version
```

### 2. Cloner le projet

```bash
git clone <votre-repo>
cd pomelli-solopreneur
```

### 3. Configuration Supabase

1. Va sur https://supabase.com et crée un projet
2. Dans l'éditeur SQL, exécute `database/schema.sql`
3. Récupère tes clés API :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 4. Configuration Backend

```bash
cd backend

# Créer l'environnement virtuel
python3 -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Créer le fichier .env
cp .env.example .env
```

**Édite `backend/.env` :**

```env
# Choisis Groq (gratuit) ou Mistral (0.10€/1M tokens)
AI_PROVIDER=groq

# Clé Groq (GRATUIT)
GROQ_API_KEY=ton_api_key_groq

# OU clé Mistral
MISTRAL_API_KEY=ton_api_key_mistral

# Supabase (clé SERVICE, pas anon)
SUPABASE_URL=https://ton-projet.supabase.co
SUPABASE_SERVICE_KEY=ton_service_key
```

**Obtenir une clé Groq (GRATUIT) :**
1. Va sur https://console.groq.com/
2. Crée un compte
3. Génère une clé API
4. Copie-la dans `.env`

### 5. Configuration Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Créer le fichier .env.local
cp .env.local.example .env.local
```

**Édite `frontend/.env.local` :**

```env
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ton_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🏃 Lancer le projet

### Backend (Terminal 1)

```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

Backend accessible sur : **http://localhost:8000**
Documentation API : **http://localhost:8000/docs**

### Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend accessible sur : **http://localhost:3000**

---

## 📚 Architecture du Projet

```
pomelli-solopreneur/
├── frontend/           # Next.js App
│   ├── app/           # Pages Next.js 14 (App Router)
│   ├── components/    # Composants React
│   ├── lib/           # Utilitaires (Supabase, AI client, etc.)
│   ├── stores/        # State management (Zustand)
│   └── types/         # Types TypeScript
│
├── backend/           # FastAPI Server
│   ├── routers/       # Routes API
│   ├── services/      # Logique métier
│   ├── models/        # Modèles Pydantic
│   └── templates/     # Templates de prompts
│
└── database/          # Schéma Supabase
```

---

## 🎯 Fonctionnalités MVP

### Phase 1 - Core (À faire maintenant)

1. **Extraction Brand DNA**
   - ✅ Upload logo → extraction couleurs (client-side)
   - ✅ Input URL site web → scraping textes + ton
   - ✅ Formulaire manuel : secteur, valeurs, mots-clés
   - ✅ Stockage profil dans Supabase

2. **Génération de contenu**
   - ✅ Templates LinkedIn (post simple, carousel, story)
   - ✅ Génération texte via Mistral/Llama
   - ✅ Adaptation aux couleurs de la marque
   - ✅ Export JSON pour import Figma

3. **Interface utilisateur**
   - ✅ Dashboard simple avec projets clients
   - ✅ Wizard 3 étapes : Brand → Génération → Export
   - ✅ Preview des créations
   - ✅ Historique des générations

---

## 🔑 APIs Gratuites Utilisées

| Service | Prix | Usage |
|---------|------|-------|
| **Groq** | 🎉 GRATUIT | LLM Llama 3.1 70B (ultra-rapide) |
| **Mistral AI** | 0.10€/1M tokens | Alternative à Groq |
| **Supabase** | Gratuit (500 MB) | Auth + PostgreSQL + Storage |
| **Vercel** | Gratuit | Hébergement frontend |

**Total : 0-20€/mois** ✅

---

## 📖 Guides d'Utilisation

### Créer un premier projet

1. **Connexion/Inscription** → Crée un compte Supabase
2. **Étape 1 : Brand DNA**
   - Upload logo → couleurs extraites automatiquement
   - Entre l'URL du site → ton et secteur détectés
   - Complète : valeurs, mots-clés, description
3. **Étape 2 : Génération**
   - Choisis le template (post LinkedIn, carousel, etc.)
   - Entre ton sujet
   - L'IA génère 3 variations
4. **Étape 3 : Export**
   - Sélectionne ta variation préférée
   - Télécharge le JSON Figma
   - Finalise dans Figma avec tes assets

### Utiliser l'API directement

```bash
# Test rapide de génération
curl -X POST "http://localhost:8000/api/generate/quick-post" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "3 erreurs que font les solopreneurs en personal branding",
    "tone": "professionnel",
    "sector": "coaching"
  }'
```

---

## 🐛 Dépannage

### Backend ne démarre pas

```bash
# Vérifier Python
python3 --version

# Réinstaller les dépendances
pip install --upgrade -r requirements.txt

# Vérifier les clés API
cat .env
```

### Frontend erreur Supabase

```bash
# Vérifier les variables d'environnement
cat .env.local

# Vérifier que le schéma SQL a été exécuté dans Supabase
# → Aller sur https://app.supabase.com → SQL Editor
```

### Erreur "No API key"

- Assure-toi d'avoir au moins **GROQ_API_KEY** OU **MISTRAL_API_KEY** dans `backend/.env`
- Groq est **gratuit** : https://console.groq.com/

---

## 🚢 Déploiement en Production

### Frontend (Vercel)

```bash
cd frontend
vercel deploy
```

Variables d'environnement à configurer dans Vercel :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL` (URL de ton backend en prod)

### Backend (Railway/Render)

1. Push le code sur GitHub
2. Connecte Railway/Render à ton repo
3. Configure les variables d'environnement
4. Deploy automatique !

---

## 🤝 Contribution

Ce projet est open-source. Les contributions sont les bienvenues !

1. Fork le projet
2. Crée une branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvre une Pull Request

---

## 📄 Licence

MIT License - Libre d'utilisation pour projets personnels et commerciaux.

---

## 🍒 Auteur

Créé avec amour par un designer solo pour les solopreneurs 🚀

**Stack choisie pour :**
- ✅ Budget minimal (0-20€/mois)
- ✅ Performance (Groq = ultra-rapide)
- ✅ Simplicité (Next.js + FastAPI)
- ✅ Scalabilité (Supabase + Vercel)

---

**Questions ? Ouvre une issue sur GitHub !** 🎉
