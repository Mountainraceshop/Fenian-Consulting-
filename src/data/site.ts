// -----------------------------------------------------------------------------
// Central site configuration. Edit copy, contact details and navigation here.
// Most text shown across the whole site is driven from this file so non-technical
// editors can update it in one place.
// -----------------------------------------------------------------------------

export const site = {
  name: 'Fenian Consulting',
  domain: 'fenian-consulting.com.au',
  tagline: 'Practical strategy. Clear communication. Real-world recovery.',
  shortTagline: 'Strategy. Communication. Recovery.',
  defaultTitle: 'Fenian Consulting | Business Coaching, Marketing & Turnaround Support',
  socialTitle: 'Fenian Consulting | Practical strategy and business recovery support',
  socialDescription:
    'Business coaching, audits, marketing, tender support and turnaround help for practical businesses and regional organisations.',
  description:
    'Fenian Consulting provides practical business coaching, marketing, tender support, business audits and turnaround support for small businesses, regional organisations and practical industries.',
  businessDescription:
    'Fenian Consulting provides practical business coaching, marketing, tender support, operational planning, communications, event growth and turnaround support for small businesses, regional businesses, sporting organisations, community groups and practical industries.',
  principal: 'Craig Dixon',
  email: 'craig@fenian-consulting.com.au',
  phone: 'To be confirmed',
  location: 'Regional Australia',
  bookingNote: 'We usually reply within one business day.',
};

export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Services', href: '/services/' },
  { label: 'Business Coaching', href: '/business-coaching/' },
  { label: 'Business Audit', href: '/business-audit/' },
  { label: 'Business Turnaround', href: '/business-turnaround/' },
  { label: 'Tender & Grant Support', href: '/tender-grant-support/' },
  { label: 'Marketing & Communications', href: '/marketing-communications/' },
  { label: 'Event & Community Growth', href: '/event-community-growth/' },
  { label: 'Contact', href: '/contact/' },
];

export const footerItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about/' },
  { label: 'Services', href: '/services/' },
  { label: 'Business Coaching', href: '/business-coaching/' },
  { label: 'Business Turnaround', href: '/business-turnaround/' },
  { label: 'Tender & Grant Support', href: '/tender-grant-support/' },
  { label: 'Marketing & Communications', href: '/marketing-communications/' },
  { label: 'Contact', href: '/contact/' },
];

export type Service = {
  title: string;
  summary: string;
  href?: string;
};

// Cards shown in the homepage "What We Do" section.
export const whatWeDo: Service[] = [
  {
    title: 'Business Coaching',
    summary:
      'Practical coaching for owners who need clear advice, honest feedback and a plan they can actually use.',
    href: '/business-coaching/',
  },
  {
    title: 'Business Audits & Action Plans',
    summary:
      'A proper review of the business with a SWOT analysis and a prioritised plan for what to fix first.',
    href: '/business-audit/',
  },
  {
    title: 'Business Turnaround',
    summary:
      'Practical support for businesses under serious pressure to stabilise, rebuild and plan recovery.',
    href: '/business-turnaround/',
  },
  {
    title: 'Marketing & Communications',
    summary:
      'Clear campaigns, messaging and content that bring in enquiries and tell your story in plain English.',
    href: '/marketing-communications/',
  },
  {
    title: 'Tender & Grant Support',
    summary:
      'Well-written, compliant tender and grant responses that present your business at its best.',
    href: '/tender-grant-support/',
  },
  {
    title: 'Event & Community Growth',
    summary:
      'Practical planning to grow attendance, membership and community support for clubs and events.',
    href: '/event-community-growth/',
  },
  {
    title: 'Training & Practical Documentation',
    summary:
      'Simple, usable procedures, training documents and systems your team will actually follow.',
    href: '/contact/',
  },
  {
    title: 'AI & Small Business Systems',
    summary:
      'Sensible, low-cost tools and systems that save time and take pressure off busy owners.',
    href: '/contact/',
  },
];

export type CoachingTier = {
  id: string;
  level: string;
  title: string;
  subtitle: string;
  blurb: string;
  href?: string;
};

// Short version of the three support levels, reused on the homepage.
export const supportLevels: CoachingTier[] = [
  {
    id: 'mentor',
    level: '1',
    title: 'Fenian Mentor',
    subtitle: 'Phone-based mentoring for small business owners',
    blurb:
      'Entry-level phone mentoring for small business owners who need straight advice, direction and accountability.',
  },
  {
    id: 'business-audit',
    level: '2',
    title: 'Fenian Business Audit',
    subtitle: 'A complete business review and action plan',
    blurb:
      'A deeper review of the business with SWOT analysis, action plans and practical recommendations across operations, marketing, pricing, systems, staff, customer flow and financial pressure points.',
    href: '/business-audit/',
  },
  {
    id: 'turnaround',
    level: '3',
    title: 'Fenian Turnaround',
    subtitle: 'High-level intervention for businesses in serious trouble',
    blurb:
      'High-level intervention for businesses under serious pressure. We work inside the business, identify what is broken, stabilise operations, rebuild systems and help drive the recovery plan.',
    href: '/business-turnaround/',
  },
];
