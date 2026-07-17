export const site = {
  name: 'SG Technik GmbH',
  tagline: 'Silo- und Soleanlagenbau',
};

export const hero = {
  eyebrow: 'SG Technik GmbH — Silo- und Soleanlagenbau',
  headline: 'Silo- und Soleanlagen für den Winterdienst',
  subheadline: 'Robust. Präzise. Vernetzt.',
  lead: 'Maßgeschneidert auf Ihre Anforderungen. Wir schaffen langlebige Lösungen für Ihre Winterdienstanlage – mit langjähriger Erfahrung und Handschlagqualität.',
  primaryCta: { label: 'Kostenloses Erstgespräch vereinbaren', href: '/#kontakt' },
  secondaryCta: { label: 'Unsere Leistungen', href: '/produkte-technik' },
};

export interface Stat {
  value: string;
  label: string;
}

export const stats: Stat[] = [
  { value: '100–980 t', label: 'Silo-Kapazität, individuell geplant' },
  { value: '15.000 l/h', label: 'Löseleistung der Soleaufbereitung' },
  { value: '± 2 %', label: 'Messgenauigkeit der Verwiegungstechnik' },
  { value: '24 h', label: 'Vor-Ort-Unterstützung im Notdienst' },
];

export const about = {
  eyebrow: 'Über uns',
  headline: 'Wer wir sind',
  lead: 'Die SG Technik GmbH ist ein Fachbetrieb mit Sitz in Österreich, spezialisiert auf die Montage von Edelstahlsilos und Soleanlagen für den kommunalen Winterdienst. Unser Fokus liegt auf technisch ausgereiften, langlebigen und praxistauglichen Lösungen – zugeschnitten auf die Anforderungen der Anwender.',
  whatWeDo: {
    headline: 'Was wir tun',
    text: 'Wir begleiten unsere Kunden von der Planung über die Lieferung bis hin zur fachgerechten Montage ihrer Anlage. Dabei stehen wir auch nach Projektabschluss mit Wartung, Service und Störungsbehebungen verlässlich zur Seite.',
  },
  scope: {
    headline: 'Unser Leistungsspektrum umfasst',
    items: [
      'Planung und Montage von GFK- und Edelstahlsilos',
      'Bau von Soleaufbereitungsanlagen und Soletankanlagen',
      'Wartung, Service und Störungsnotdienst bestehender Anlagen',
    ],
  },
};

export interface ProcessStep {
  title: string;
  text: string;
}

export const process: ProcessStep[] = [
  {
    title: 'Erstgespräch & Bedarfserhebung',
    text: 'In einem persönlichen Gespräch analysieren wir die Anforderungen und Gegebenheiten vor Ort. Gemeinsam erarbeiten wir eine wirtschaftliche und technisch optimale Lösung für Ihren Einsatzbereich.',
  },
  {
    title: 'Technische Planung',
    text: 'Auf Basis der Bedarfserhebung erfolgt die detaillierte technische Planung der Anlage. Dabei berücksichtigen wir die örtlichen Gegebenheiten, Kapazitäten, Automatisierungsmöglichkeiten sowie zukünftige Anforderungen.',
  },
  {
    title: 'Angebotserstellung',
    text: 'Sie erhalten ein transparentes und individuell abgestimmtes Angebot – passend zu Ihrem Projekt und den gewünschten Leistungsumfängen.',
  },
  {
    title: 'Lieferung & Montage',
    text: 'Wir koordinieren die termingerechte Lieferung sämtlicher Komponenten und übernehmen die fachgerechte Montage der Anlage direkt vor Ort.',
  },
  {
    title: 'Inbetriebnahme',
    text: 'Nach erfolgter Montage erfolgt die Inbetriebnahme der Anlage inklusive Funktionsprüfung und Einschulung des Bedienpersonals.',
  },
  {
    title: 'Wartung & Service',
    text: 'Auch nach Projektabschluss stehen wir unseren Kunden als verlässlicher Partner zur Seite. Regelmäßige Wartungen und Servicearbeiten sorgen für einen langfristig sicheren und störungsfreien Betrieb.',
  },
  {
    title: 'Notdienst',
    text: 'Gerade während der Wintersaison ist bei technischen Störungen schnelles Handeln entscheidend. Wir stehen unseren Kunden im Bedarfsfall schnell und unkompliziert zur Verfügung und sorgen mit unserem Notdienst für eine möglichst kurze Reaktionszeit sowie eine rasche Wiederherstellung der Einsatzbereitschaft.',
  },
];

export const customers = {
  headline: 'Wer sind unsere Kunden',
  items: ['Landesregierungen', 'Magistrate', 'Gemeinden', 'Infrastrukturträger', 'Autobahnbetreiber'],
};

export const values = {
  headline: 'Wofür wir stehen',
  items: [
    'Qualitätsbewusstsein',
    'Handschlagqualität',
    'Praxisorientierte Lösungen',
    'Schnelle Reaktionszeiten im Störungsfall',
  ],
};

export interface Reference {
  title: string;
  location: string;
  detail: string;
}

export const references: Reference[] = [
  { title: 'Siloumstellung', location: 'Steinerkirchen', detail: 'Umstellung bestehender Siloanlage' },
  { title: 'Neubau 300 t Silo', location: 'Mondsee', detail: 'Mit Soleanlage' },
  { title: 'Neubau 680 t Silo', location: 'Mitterweißenbach', detail: 'Mit Soleanlage' },
  { title: 'Neubau 300 t Silo', location: 'Obernberg', detail: 'Erneuerung Platten, mit Soleanlage' },
];

export const closingCta = {
  headline: 'Kostenloses Erstgespräch, langlebige Lösung.',
  lead: 'Ob Neubau oder Umstellung Ihrer Silo- und Soleanlage — wir planen individuell, liefern termingerecht und sind im Ernstfall innerhalb von 24 Stunden vor Ort.',
};

export const contact = {
  eyebrow: 'Kontakt',
  headline: 'Ihr direkter Draht zu uns',
  lead: 'Sie haben Fragen oder planen ein Projekt? Wir freuen uns, Sie kennenzulernen und stehen gerne für ein persönliches Gespräch zur Verfügung.',
  person: 'Gregor Hofer',
  // TODO: Telefonnummer, E-Mail und Adresse ergänzen, sobald verfügbar.
  phone: '',
  email: '',
};
