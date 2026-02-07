-- ============================================
-- Pomelli-Like : Schéma de base de données
-- À exécuter dans l'éditeur SQL de Supabase
-- ============================================

-- Table des marques (profils clients)
CREATE TABLE IF NOT EXISTS brands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    website_url TEXT,
    logo_url TEXT,
    -- Le Brand DNA complet en JSON
    brand_dna JSONB DEFAULT '{
        "colors": {
            "primary": "#2563EB",
            "secondary": "#1E40AF",
            "accent": "#F59E0B",
            "text": "#1F2937",
            "background": "#FFFFFF"
        },
        "tone": "professionnel",
        "keywords": [],
        "sector": "",
        "values": [],
        "description": ""
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des projets (regroupement de créations)
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'linkedin_post',
    status VARCHAR(50) DEFAULT 'draft',
    content JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table du contenu généré par l'IA
CREATE TABLE IF NOT EXISTS generated_content (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    content_text TEXT,
    content_data JSONB DEFAULT '{}'::jsonb,
    ai_model VARCHAR(50) DEFAULT 'mistral',
    prompt_used TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table des templates prédéfinis
CREATE TABLE IF NOT EXISTS templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    structure JSONB NOT NULL,
    preview_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Sécurité : Row Level Security (RLS)
-- ============================================

ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Politique : les utilisateurs ne voient que leurs marques
CREATE POLICY "Utilisateurs voient leurs marques"
    ON brands FOR ALL
    USING (auth.uid() = user_id);

-- Politique : les utilisateurs ne voient que leurs projets
CREATE POLICY "Utilisateurs voient leurs projets"
    ON projects FOR ALL
    USING (
        brand_id IN (
            SELECT id FROM brands WHERE user_id = auth.uid()
        )
    );

-- Politique : les utilisateurs ne voient que leur contenu généré
CREATE POLICY "Utilisateurs voient leur contenu"
    ON generated_content FOR ALL
    USING (
        project_id IN (
            SELECT p.id FROM projects p
            JOIN brands b ON p.brand_id = b.id
            WHERE b.user_id = auth.uid()
        )
    );

-- Politique : tout le monde peut lire les templates
CREATE POLICY "Templates publics en lecture"
    ON templates FOR SELECT
    USING (is_active = TRUE);

-- ============================================
-- Index pour les performances
-- ============================================

CREATE INDEX idx_brands_user_id ON brands(user_id);
CREATE INDEX idx_projects_brand_id ON projects(brand_id);
CREATE INDEX idx_generated_content_project_id ON generated_content(project_id);
CREATE INDEX idx_templates_type ON templates(type);

-- ============================================
-- Fonction de mise à jour automatique
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER brands_updated_at
    BEFORE UPDATE ON brands
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
