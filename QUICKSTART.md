# ⚡ QUICKSTART - Pomelli Solopreneur

Lance le projet en **5 minutes** !

## 🎯 Ce que tu vas créer

Un générateur de contenu LinkedIn alimenté par l'IA (Groq GRATUIT) qui :
1. Extrait ton "Brand DNA" depuis ton logo + site
2. Génère du contenu LinkedIn personnalisé
3. Exporte en JSON pour Figma

## 📦 Ce dont tu as besoin

- Node.js 18+ et Python 3.9+
- Compte Supabase (gratuit) : https://supabase.com
- Clé API Groq (gratuit) : https://console.groq.com

## 🚀 Installation (5 min)

### 1. Backend

```bash
cd backend

# Créer l'environnement Python
python3 -m venv venv
source venv/bin/activate

# Installer
pip install fastapi uvicorn httpx beautifulsoup4 requests pydantic \
  mistralai groq python-dotenv Pillow colorthief lxml supabase

# Configurer
cp .env.example .env
```

**Édite `backend/.env` :**
```env
AI_PROVIDER=groq
GROQ_API_KEY=<ta_cle_groq_ici>
```

**Obtenir ta clé Groq (1 min) :**
- Va sur https://console.groq.com/
- Crée un compte → API Keys → Create
- Copie la clé dans `.env`

### 2. Frontend

```bash
cd frontend

# Installer
npm install

# Configurer
cp .env.local.example .env.local
```

**Édite `frontend/.env.local` :**
```env
NEXT_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ta_cle_anon
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Configurer Supabase (2 min) :**
- Crée un projet sur https://supabase.com
- SQL Editor → Colle `database/schema.sql` → Run
- Settings → API → Copie URL + anon key

### 3. Lancer

**Terminal 1 - Backend :**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

✅ **C'est prêt !** Ouvre http://localhost:3000

---

## 🧪 Test Rapide (sans frontend)

```bash
# Test de génération IA
curl -X POST "http://localhost:8000/api/generate/quick-post" \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "3 erreurs en personal branding",
    "tone": "professionnel",
    "sector": "coaching"
  }'
```

---

## 🎨 Workflow Complet

1. **Crée un compte** (Supabase Auth)
2. **Étape 1 : Brand DNA**
   - Upload logo → couleurs extraites
   - URL site → ton/secteur détecté
   - Complète les valeurs/mots-clés
3. **Étape 2 : Génération**
   - Choisis template (post/carousel)
   - Entre ton sujet
   - L'IA génère 3 variations
4. **Étape 3 : Export**
   - Télécharge JSON Figma
   - Finalise dans Figma

---

## ❌ Problèmes ?

### "No API key"
→ Ajoute `GROQ_API_KEY` dans `backend/.env`

### "Supabase error"
→ Vérifie que `database/schema.sql` a été exécuté dans Supabase

### Backend ne démarre pas
→ `pip install -r requirements.txt`

---

## 🚀 Prochaines Étapes

- [ ] Personnalise les templates dans `backend/templates/linkedin.py`
- [ ] Ajoute tes propres prompts dans `backend/services/ai.py`
- [ ] Déploie sur Vercel (frontend) + Railway (backend)

---

**🍒 Tu as un MVP fonctionnel en 5 min ! Go !**
