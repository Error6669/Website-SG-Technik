export interface TechnicalSpec {
  label: string;
  value: string;
}

export interface TechnicalCategory {
  name: string;
  specs: TechnicalSpec[];
}

// Bündelt technische Fakten, die bereits in services.ts als Fließtext stehen,
// als scanbare Spec-Liste. Keine neuen Inhalte, nur andere Darstellung.
export const productsAndTech = {
  eyebrow: 'Produkte & Technik',
  headline: 'Technische Daten im Überblick',
  lead: 'Die wichtigsten Eckdaten unserer Silo-, Sole- und Automatisierungssysteme auf einen Blick — Details zu jeder Leistung finden Sie im Abschnitt Leistungen.',
};

export const technicalCategories: TechnicalCategory[] = [
  {
    name: 'Silotechnik',
    specs: [
      { label: 'Kapazität', value: '100–980 t, individuell geplant' },
      { label: 'Edelstahlsilos', value: 'Hohe Korrosionsbeständigkeit, langlebig, wartungsfreundlich' },
      { label: 'GFK-Silos', value: 'Robust, für kleinere bis mittlere Anwendungen' },
    ],
  },
  {
    name: 'Soletechnik',
    specs: [
      { label: 'Löseleistung', value: 'Bis zu 15.000 l/h' },
      { label: 'Steuerung', value: 'Vollautomatisch über intuitiven Touchscreen' },
      { label: 'Entnahme', value: 'Manuell, per RFID oder vollautomatisch mittels Überfüllschutzstecker' },
      { label: 'Dokumentation', value: 'Lagerstände, Systemmeldungen und Entnahmen automatisch erfasst' },
    ],
  },
  {
    name: 'Automatisierung (SalzManager)',
    specs: [
      { label: 'Zugriffskontrolle', value: 'Per RFID oder Smartphone' },
      { label: 'Messgenauigkeit', value: '± 2 % der Gesamtmenge, ± 200 kg bei der Entnahme' },
      { label: 'Nachrüstung', value: 'Auch bei bestehenden Silos mit Stahlfüßen möglich' },
      { label: 'Fernwartung', value: 'Zentrale Überwachung, schnelle Anpassung ohne Vor-Ort-Einsatz' },
    ],
  },
  {
    name: 'Service',
    specs: [
      { label: 'Vor-Ort-Unterstützung', value: 'Innerhalb von 24 Stunden im Notfall' },
      { label: 'Bereitschaft', value: 'Telefonischer Notdienst während der Wintersaison' },
      { label: 'Ersatzteile', value: 'Umfangreiches Lager für rasche Störungsbehebung' },
    ],
  },
];
