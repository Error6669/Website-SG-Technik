export interface NavItem {
  label: string;
  href: string;
}

export const navigation: NavItem[] = [
  { label: 'Über uns', href: '/#ueber-uns' },
  { label: 'Leistungen', href: '/leistungen' },
  { label: 'Produkte & Technik', href: '/produkte-technik' },
  { label: 'Referenzen', href: '/referenzen' },
  { label: 'Kontakt', href: '/#kontakt' },
];
