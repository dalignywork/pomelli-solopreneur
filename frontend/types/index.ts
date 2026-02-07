/**
 * TypeScript types matching backend Pydantic models.
 * Keep in sync with backend/models/schemas.py
 */

// === ENUMS ===

export enum Tone {
  PROFESSIONNEL = "professionnel",
  INSPIRANT = "inspirant",
  PEDAGOGIQUE = "pédagogique",
  PROVOCATEUR = "provocateur",
  AUTHENTIQUE = "authentique",
}

export enum Sector {
  COACHING = "coaching",
  CONSULTING = "consulting",
  DESIGN = "design",
  DEVELOPPEMENT = "développement",
  MARKETING = "marketing",
  SANTE = "santé",
  FINANCE = "finance",
  ECOMMERCE = "e-commerce",
  EDUCATION = "éducation",
  AUTRE = "autre",
}

export enum TemplateType {
  POST = "post",
  CAROUSEL = "carousel",
  STORY = "story",
}

export enum ContentType {
  LINKEDIN_POST = "linkedin_post",
  LINKEDIN_CAROUSEL = "linkedin_carousel",
  INSTAGRAM_POST = "instagram_post",
  INSTAGRAM_CAROUSEL = "instagram_carousel",
}

// === COLOR SCHEMAS ===

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  neutrals: string[];
  all_colors: string[];
}

// === BRAND DNA ===

export interface BrandDNA {
  colors: ColorPalette;
  tone: Tone;
  sector: Sector;
  values: string[];
  keywords: string[];
  target_audience?: string;
  unique_angle?: string;
}

// === BRAND MODELS ===

export interface Brand {
  id: string;
  user_id: string;
  name: string;
  website_url?: string;
  logo_url?: string;
  brand_dna?: BrandDNA;
  created_at: string;
  updated_at: string;
}

export interface BrandCreate {
  name: string;
  website_url?: string;
  logo_url?: string;
  brand_dna?: BrandDNA;
}

export interface BrandUpdate {
  name?: string;
  website_url?: string;
  logo_url?: string;
  brand_dna?: BrandDNA;
}

// === PROJECT MODELS ===

export interface Project {
  id: string;
  brand_id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectCreate {
  brand_id: string;
  name: string;
  description?: string;
}

// === GENERATION REQUESTS ===

export interface GeneratePostRequest {
  brand_id: string;
  topic: string;
  tone?: Tone;
  template_id?: string;
}

export interface GenerateCarouselRequest {
  brand_id: string;
  topic: string;
  num_slides?: number;
  tone?: Tone;
}

export interface QuickPostRequest {
  topic: string;
  tone?: Tone;
  sector?: Sector;
}

// === GENERATION RESPONSES ===

export interface GeneratedVariation {
  text: string;
  hook?: string;
  cta?: string;
  hashtags: string[];
  metadata?: Record<string, any>;
}

export interface GeneratePostResponse {
  variations: GeneratedVariation[];
  brand_colors?: ColorPalette;
  template_used?: string;
}

export interface CarouselSlide {
  slide_number: number;
  title: string;
  content: string;
  visual_hint?: string;
}

export interface CarouselResponse {
  title: string;
  slides: CarouselSlide[];
  cover_text?: string;
  brand_colors?: ColorPalette;
}

// === GENERATED CONTENT (DB) ===

export interface GeneratedContent {
  id: string;
  project_id: string;
  brand_id: string;
  user_id: string;
  content_type: ContentType;
  content_data: Record<string, any>;
  figma_json?: Record<string, any>;
  created_at: string;
}

// === TEMPLATES ===

export interface Template {
  id: string;
  name: string;
  template_type: TemplateType;
  structure: Record<string, any>;
  preview_image?: string;
  created_at: string;
}

// === SCRAPING ===

export interface ScrapeWebsiteRequest {
  url: string;
}

export interface ScrapeWebsiteResponse {
  url: string;
  title?: string;
  description?: string;
  detected_tone?: Tone;
  detected_sector?: Sector;
  suggested_keywords: string[];
  color_palette?: ColorPalette;
}

// === COLOR EXTRACTION ===

export interface ExtractColorsRequest {
  image_url?: string;
  num_colors?: number;
}

export interface ExtractColorsResponse {
  palette: ColorPalette;
  num_colors_extracted: number;
}

// === FIGMA EXPORT ===

export interface FigmaExportRequest {
  content_id: string;
  include_colors?: boolean;
}

export interface FigmaExportResponse {
  figma_json: Record<string, any>;
  content_type: ContentType;
  download_filename: string;
}

// === ANALYZE COMPLETE ===

export interface AnalyzeCompleteRequest {
  logo_file?: string;
  website_url?: string;
}

export interface AnalyzeCompleteResponse {
  brand_dna: BrandDNA;
  scrape_data?: ScrapeWebsiteResponse;
  colors_from_logo?: ColorPalette;
  colors_from_website?: ColorPalette;
}
