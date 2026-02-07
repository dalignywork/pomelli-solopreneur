/**
 * API client for communicating with FastAPI backend.
 * All AI-related API calls go through here.
 */

import axios, { AxiosInstance } from "axios";
import type {
  ScrapeWebsiteRequest,
  ScrapeWebsiteResponse,
  ExtractColorsResponse,
  AnalyzeCompleteResponse,
  GeneratePostRequest,
  GeneratePostResponse,
  GenerateCarouselRequest,
  CarouselResponse,
  QuickPostRequest,
  FigmaExportRequest,
  FigmaExportResponse,
  Template,
  TemplateType,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: `${API_URL}/api`,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // === BRAND ENDPOINTS ===

  async scrapeWebsite(
    url: string
  ): Promise<ScrapeWebsiteResponse> {
    const response = await this.client.post<ScrapeWebsiteResponse>(
      "/brand/scrape-website",
      { url } as ScrapeWebsiteRequest
    );
    return response.data;
  }

  async extractColorsFromFile(
    file: File,
    numColors: number = 6
  ): Promise<ExtractColorsResponse> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("num_colors", numColors.toString());

    const response = await this.client.post<ExtractColorsResponse>(
      "/brand/extract-colors",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  async extractColorsFromURL(
    imageUrl: string,
    numColors: number = 6
  ): Promise<ExtractColorsResponse> {
    const response = await this.client.post<ExtractColorsResponse>(
      "/brand/extract-colors",
      { image_url: imageUrl, num_colors: numColors }
    );
    return response.data;
  }

  async analyzeComplete(
    logoFile?: File,
    websiteUrl?: string
  ): Promise<AnalyzeCompleteResponse> {
    const formData = new FormData();
    if (logoFile) {
      formData.append("logo_file", logoFile);
    }
    if (websiteUrl) {
      formData.append("website_url", websiteUrl);
    }

    const response = await this.client.post<AnalyzeCompleteResponse>(
      "/brand/analyze-complete",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // === GENERATION ENDPOINTS ===

  async generatePost(
    request: GeneratePostRequest
  ): Promise<GeneratePostResponse> {
    const response = await this.client.post<GeneratePostResponse>(
      "/generate/post",
      request
    );
    return response.data;
  }

  async generateCarousel(
    request: GenerateCarouselRequest
  ): Promise<CarouselResponse> {
    const response = await this.client.post<CarouselResponse>(
      "/generate/carousel",
      request
    );
    return response.data;
  }

  async quickPost(
    request: QuickPostRequest
  ): Promise<GeneratePostResponse> {
    const response = await this.client.post<GeneratePostResponse>(
      "/generate/quick-post",
      request
    );
    return response.data;
  }

  async exportForFigma(
    request: FigmaExportRequest
  ): Promise<FigmaExportResponse> {
    const response = await this.client.post<FigmaExportResponse>(
      "/generate/export-figma",
      request
    );
    return response.data;
  }

  // === TEMPLATES ENDPOINTS ===

  async listTemplates(
    templateType?: TemplateType
  ): Promise<Template[]> {
    const params = templateType ? { template_type: templateType } : {};
    const response = await this.client.get<Template[]>("/templates", {
      params,
    });
    return response.data;
  }

  async getTemplate(templateId: string): Promise<Template> {
    const response = await this.client.get<Template>(
      `/templates/${templateId}`
    );
    return response.data;
  }
}

// Export singleton instance
export const apiClient = new APIClient();
