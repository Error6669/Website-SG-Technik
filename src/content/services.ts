export interface Service {
  slug: string;
  name: string;
  tagline: string;
  intro: string;
  paragraphs: string[];
}

export const services: Service[] = [
  {
    slug: 'streusalzlagerung',
    name: 'Streusalzlagerung',
    tagline: 'Effizient. Langlebig. Passgenau.',
    intro:
      'Für eine sichere und wirtschaftliche Winterdienstlogistik ist die richtige Lagerung von Auftausalz entscheidend. Wir bieten durchdachte und robuste Lösungen für die Streusalzlagerung – abgestimmt auf den Bedarf unserer Kunden.',
    paragraphs: [
      'Unsere Streusalz-Silos ermöglichen eine zuverlässige Bevorratung und einfache Entnahme des Streumaterials – genau dann, wenn es benötigt wird. Durch langlebige Materialien, individuelle Anpassungsmöglichkeiten und wartungsfreundliche Konstruktionen schaffen wir wirtschaftliche Lösungen für den langfristigen Einsatz.',
      'Unsere Streusalz-Silos sind in unterschiedlichen Größen von 100 bis 980 Tonnen erhältlich und können individuell an die Anforderungen des jeweiligen Standorts angepasst werden. Besonders unsere Edelstahlsilos überzeugen durch ihre hohe Korrosionsbeständigkeit, Langlebigkeit und Wartungsfreundlichkeit. Alternativ bieten wir robuste GFK-Silos für kleinere bis mittlere Anwendungen an.',
      'Durch die individuelle Planung jeder Anlage stellen wir sicher, dass Größe, Ausstattung und Technik optimal zum jeweiligen Standort passen. Unsere Systeme sorgen für hohe Betriebssicherheit und bieten langfristige Investitionssicherheit für Gemeinden, Bauhöfe und Straßenmeistereien.',
    ],
  },
  {
    slug: 'soleaufbereitung',
    name: 'Soleaufbereitung und -lagerung',
    tagline: 'Automatisch. Zuverlässig. Leistungsstark.',
    intro:
      'Für einen reibungslosen Winterdienst ist die dauerhafte Verfügbarkeit von Sole in definierter Konzentration essenziell. Unsere vollautomatischen Soleaufbereitungsanlagen gewährleisten einen sicheren und effizienten Betrieb – wirtschaftlich und bedienerfreundlich.',
    paragraphs: [
      'Durch die automatische Herstellung und Verteilung der Sole reduzieren sich manuelle Arbeitsabläufe und Fehlerquellen auf ein Minimum. Gleichzeitig bleibt die gewünschte Solekonzentration jederzeit konstant verfügbar. Die automatische Dokumentation sämtlicher Entnahmen und Lagerstände sorgt für maximale Transparenz und Kontrolle im laufenden Betrieb.',
      'Im Zwangsmischer wird das über eine Dosierschnecke zugeführte Trockensalz mit Wasser zu Sole vermischt. Die gesamte Anlage arbeitet vollautomatisch und wird über einen intuitiven Touchscreen gesteuert. Sämtliche Lagerstände, Systemmeldungen und Entnahmen werden automatisch dokumentiert und sind jederzeit abrufbar. Die Sole kann flexibel über verschiedene Entnahmestellen abgegeben werden – manuell, per RFID oder vollautomatisch mittels Überfüllschutzstecker. Unsere Anlagen erreichen eine Löseleistung von bis zu 15.000 l/h.',
      'Die einfache Bedienung, die präzise Steuerung und die automatische Dokumentation reduzieren den Aufwand für Betreiber erheblich. Gleichzeitig sorgen unsere robusten Anlagen für einen zuverlässigen und störungsarmen Betrieb – besonders während der Wintersaison.',
    ],
  },
  {
    slug: 'solepumpstation',
    name: 'Solepumpstation',
    tagline: 'Kompakt. Flexibel. Wartungsarm.',
    intro:
      'Für Standorte ohne eigene Soleproduktion bieten wir kompakte Solepumpstationen zur Zwischenlagerung und automatisierten Abgabe fertiger Sole.',
    paragraphs: [
      'Unsere Solepumpstationen ermöglichen eine wirtschaftliche und zuverlässige Versorgung von Bauhöfen und kleineren Standorten mit Sole, ohne dass eine eigene Produktionsanlage erforderlich ist. Durch die kompakte Bauweise eignen sich die Systeme besonders für Standorte mit begrenztem Platzangebot und geringem Wartungsaufwand.',
      'Die fertige Sole wird per LKW angeliefert und in einem Lagertank zwischengespeichert. Die anschließende Entnahme durch die Streufahrzeuge erfolgt vollautomatisch und effizient. Nicht benötigte Sole kann bei Bedarf wieder ins System rückgeführt werden. Die Anlage besteht aus Lagertank, Pumptechnik und Steuerungseinheit und wird individuell auf die Anforderungen des jeweiligen Standorts abgestimmt.',
      'Unsere Solepumpstationen werden exakt auf die örtlichen Gegebenheiten abgestimmt und bieten eine platzsparende sowie wartungsarme Lösung. Dadurch reduzieren sich laufender Aufwand und Betriebskosten für den Betreiber deutlich.',
    ],
  },
  {
    slug: 'automatisierungstechnik',
    name: 'Automatisierungstechnik',
    tagline: 'Anpassbar. Vernetzt. Effizient.',
    intro:
      'Moderne Winterdienstanlagen benötigen intelligente Systeme, die Prozesse automatisieren, überwachen und dokumentieren.',
    paragraphs: [
      'Mit unseren Automatisierungslösungen behalten Sie jederzeit den Überblick über Ihre Salz- und Solebestände sowie sämtliche Entnahmen und Rücknahmen. Durch die zentrale Überwachung und Fernwartungsmöglichkeiten lassen sich Ausfallzeiten minimieren und Serviceeinsätze effizienter gestalten.',
      'Alle Systeme sind mit der webbasierten Plattform SalzManager vernetzt. Dadurch können Lagerbestände, Entnahmen und Rücknahmen inklusive Zugriffskontrolle mittels RFID oder Smartphone zentral überwacht und dokumentiert werden. Unsere Verwiegungstechnik mittels Dehnmessstreifen misst Füllstände und Entnahmemengen präzise und kann auch bei bestehenden Silos mit Stahlfüßen unkompliziert nachgerüstet werden. Die Messgenauigkeit liegt bei ± 2 % der Gesamtmenge sowie bei ± 200 kg bei der Entnahme.',
      'Durch die präzise Dokumentation aller Prozesse schaffen wir maximale Transparenz und reduzieren den Verwaltungsaufwand für Betreiber. Gleichzeitig minimieren Fernwartung und automatische Überwachung Ausfallzeiten und ermöglichen schnelle Reaktionszeiten.',
    ],
  },
  {
    slug: 'wartung-service-notdienst',
    name: 'Wartung, Service und Notdienst',
    tagline: 'Verlässlich. Schnell. Kompetent.',
    intro:
      'Damit Ihre Silo- und Soleanlagen auch im Winter zuverlässig funktionieren, übernehmen wir die laufende Betreuung Ihrer Anlagen – von der regelmäßigen Wartung bis zur schnellen Störungsbehebung.',
    paragraphs: [
      'Regelmäßige Wartungen erhöhen die Betriebssicherheit und helfen dabei, ungeplante Ausfälle zu vermeiden. Besonders während der Wintersaison profitieren unsere Kunden von schnellen Reaktionszeiten, kompetenter Unterstützung und einer raschen Wiederherstellung der Einsatzbereitschaft ihrer Anlagen.',
      'Im Zuge der Wartungsarbeiten prüfen wir sämtliche sicherheitsrelevanten Komponenten und überwachen die automatischen Prozesse der Anlage. Besonders im Winter zählt jede Stunde. Deshalb bieten wir einen telefonischen Bereitschaftsdienst sowie eine Vor-Ort-Unterstützung innerhalb von 24 Stunden. Durch unser umfangreiches Ersatzteillager und unsere Erfahrung können Störungen rasch behoben und die Einsatzbereitschaft schnell wiederhergestellt werden.',
      'Durch unsere Erfahrung, schnelle Hilfe im Störungsfall und unser umfangreiches Ersatzteillager reduzieren wir Ausfälle im Winter auf ein Minimum. So bleibt Ihre Anlage auch in kritischen Situationen zuverlässig einsatzbereit.',
    ],
  },
];
