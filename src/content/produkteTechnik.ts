// ---------------------------------------------------------------------------
// Produkte & Technik — Kategorien für das Scrollytelling-Layout.
// Bündelt je Kategorie den Fließtext (aus services.ts) mit den passenden
// technischen Daten (aus technicalData.ts). Reihenfolge = Anzeigereihenfolge.
// Zuordnung laut Nutzervorgabe.
// ---------------------------------------------------------------------------
import { services } from './services';
import { technicalCategories, type TechnicalSpec } from './technicalData';

export interface ProductCategory {
  slug: string;
  /** Anzeigename (rechtes Panel / Mobile-Karte / Überschrift links). */
  name: string;
  tagline: string;
  intro: string;
  paragraphs: string[];
  /** Technische Daten; kann leer sein (z. B. Solepumpstation). */
  specs: TechnicalSpec[];
}

const svc = (slug: string) => services.find((s) => s.slug === slug)!;
const tech = (name: string) => technicalCategories.find((t) => t.name === name)?.specs ?? [];

export const productCategories: ProductCategory[] = [
  {
    slug: 'streusalzlagerung',
    name: 'Streusalzlagerung',
    tagline: svc('streusalzlagerung').tagline,
    intro: svc('streusalzlagerung').intro,
    paragraphs: svc('streusalzlagerung').paragraphs,
    specs: tech('Silotechnik'),
  },
  {
    slug: 'soleaufbereitung',
    name: 'Soleaufbereiter und -lagerung',
    tagline: svc('soleaufbereitung').tagline,
    intro: svc('soleaufbereitung').intro,
    paragraphs: svc('soleaufbereitung').paragraphs,
    specs: tech('Soletechnik'),
  },
  {
    slug: 'solepumpstation',
    name: 'Solepumpstation',
    tagline: svc('solepumpstation').tagline,
    intro: svc('solepumpstation').intro,
    paragraphs: svc('solepumpstation').paragraphs,
    specs: [],
  },
  {
    slug: 'automatisierung',
    name: 'Automatisierung',
    tagline: svc('automatisierungstechnik').tagline,
    intro: svc('automatisierungstechnik').intro,
    paragraphs: svc('automatisierungstechnik').paragraphs,
    specs: tech('Automatisierung (SalzManager)'),
  },
  {
    slug: 'service',
    name: 'Service und Notdienst',
    tagline: svc('wartung-service-notdienst').tagline,
    intro: svc('wartung-service-notdienst').intro,
    paragraphs: svc('wartung-service-notdienst').paragraphs,
    specs: tech('Service'),
  },
];
