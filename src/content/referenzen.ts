// ---------------------------------------------------------------------------
// Referenzprojekte. Metadaten hier, Fotos unter src/assets/referenzen/<slug>/
// (Datei 01 = Hero, danach Detailbilder). Reihenfolge = Anzeigereihenfolge.
//
// Bewusst nur belegte Angaben: Kapazität/Jahr sind optional und werden nur
// gerendert, wenn gefüllt — keine erfundenen Werte. Für die neueren Projekte
// (Gmunden, Trieben/Selzthal, Kittsee) fehlen noch Kapazität/Jahr.
// ---------------------------------------------------------------------------
export interface Projekt {
  /** Ordner-Slug unter src/assets/referenzen/ und im Lightbox-Gruppierungs-Key. */
  slug: string;
  title: string;
  location: string;
  /** Anlagentyp, z. B. „Silo- und Soleanlage". */
  typ: string;
  /** Optional — nur rendern, wenn vorhanden. */
  kapazitaet?: string;
  jahr?: string;
  /** Kurzbeschreibung (ein Satz). */
  detail?: string;
}

export const projekte: Projekt[] = [
  {
    slug: 'mondsee',
    title: 'Neubau Siloanlage',
    location: 'Mondsee',
    typ: 'Silo- und Soleanlage',
    kapazitaet: '300 t',
    detail: 'Neubau einer Siloanlage mit integrierter Soleaufbereitung.',
  },
  {
    slug: 'mitterweissenbach',
    title: 'Neubau Siloanlage',
    location: 'Mitterweißenbach',
    typ: 'Silo- und Soleanlage',
    kapazitaet: '680 t',
    detail: 'Neubau einer Siloanlage mit Soleaufbereitung.',
  },
  {
    slug: 'steinerkirchen',
    title: 'Siloumstellung',
    location: 'Steinerkirchen',
    typ: 'Siloanlage',
    detail: 'Umstellung und Modernisierung einer bestehenden Siloanlage.',
  },
  {
    slug: 'gmunden',
    title: 'Silo- und Soleanlage',
    location: 'Gmunden',
    typ: 'Silo- und Soleanlage',
    detail: 'Siloanlage mit Soleaufbereitung.',
  },
  {
    slug: 'obernberg',
    title: 'Neubau Siloanlage',
    location: 'Obernberg',
    typ: 'Silo- und Soleanlage',
    kapazitaet: '300 t',
    detail: 'Neubau einer Siloanlage mit Soleaufbereitung, inklusive Erneuerung der Platten.',
  },
  {
    slug: 'trieben-selzthal',
    title: 'Siloanlage',
    location: 'Trieben / Selzthal',
    typ: 'Siloanlage',
    detail: 'Errichtung einer Siloanlage.',
  },
  {
    slug: 'kittsee',
    title: 'Soleanlage',
    location: 'Kittsee',
    typ: 'Soleanlage',
    detail: 'Aufbau einer Soleaufbereitung.',
  },
];
