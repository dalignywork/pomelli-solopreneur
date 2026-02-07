/**
 * Landing page - Page d'accueil du site
 */

import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-6 text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
            🍒 Personal Branding
            <br />
            <span className="text-blue-600">avec IA</span>
          </h1>

          <p className="mb-8 text-xl text-gray-600">
            Génère du contenu LinkedIn et Instagram aligné avec ton Brand DNA.
            <br />
            Propulsé par Groq AI (gratuit).
          </p>

          <div className="flex justify-center gap-4">
            <Link href="/wizard">
              <Button size="lg">Commencer gratuitement</Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-4xl">🎨</div>
            <h3 className="mb-2 text-xl font-semibold">Brand DNA</h3>
            <p className="text-gray-600">
              Extrais tes couleurs, ton, et valeurs depuis ton logo + site web
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-4xl">✨</div>
            <h3 className="mb-2 text-xl font-semibold">Génération IA</h3>
            <p className="text-gray-600">
              Groq AI génère 3 variations de posts adaptées à ton style
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-4xl">📦</div>
            <h3 className="mb-2 text-xl font-semibold">Export Figma</h3>
            <p className="text-gray-600">
              Télécharge en JSON pour finaliser dans Figma
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto max-w-2xl rounded-2xl bg-blue-600 p-12 text-white">
          <h2 className="mb-4 text-3xl font-bold">
            Prêt à booster ton personal branding ?
          </h2>
          <p className="mb-6 text-lg opacity-90">
            100% gratuit. Pas de carte bancaire. Résultats en 2 minutes.
          </p>
          <Link href="/wizard">
            <Button size="lg" variant="secondary">
              Créer mon premier post
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500">
        <p>
          Made with 🍒 by Pomelli Solopreneur • Powered by{" "}
          <a
            href="https://groq.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Groq AI
          </a>
        </p>
      </footer>
    </main>
  );
}
