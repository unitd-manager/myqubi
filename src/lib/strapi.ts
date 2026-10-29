const BASE = import.meta.env.VITE_STRAPI_URL as string;

export interface StrapiButton {
  id: number;
  label: string;
  url: string;
  Publish: boolean | null;
}

export interface StrapiImage {
  id?: number;
  url: string;
  alternativeText?: string | null;
}

/* ---------------- HEADER (single type) ---------------- */
export interface NavLink {
  id: number;
  label: string;
  url: string;
  publish?: boolean | null; // Strapi API key: "publish"
  Publish?: boolean | null;
  children?: {
    id: number;
    label: string;
    url: string;
    Publish?: boolean | null;
  }[];
}

export interface HeaderData {
  logo?: StrapiImage | null;
  powered_by_label?: string;
  powered_by_logo?: StrapiImage | null;
  nav_links?: NavLink[];
  watch_button_label?: string;
  cta_label?: string;
  cta_url?: string;
}

/* ---------------- FOOTER (single type) ---------------- */
export interface FooterLink {
  id: number;
  label: string;
  url: string;
  Publish?: boolean | null;
}

export interface FooterData {
  copyright_text?: string;
  publish?: boolean | null;
  logo?: StrapiImage | null;
  powered_by_label?: string;
  powered_by_logo?: StrapiImage | null;
  tagline?: string;
  columns?: { id: number; title?: string; links?: FooterLink[] }[];
  legal_links?: FooterLink[];
}

/* ---------------- HERO (+ Ticker) ---------------- */
export interface HeroData {
  badge_text?: string;
  main_title?: string;
  title_highlight?: string;
  description?: string;
  trust_text?: string;
  Publish?: boolean | null;
  button?: StrapiButton | null;
  secondary_button?: StrapiButton | null;
  window_title?: string;
  sidebar_logo?: string;
  sidebar_items?: { id: number; label: string; is_active?: boolean | null }[];
  workspace_title?: string;
  workspace_subtitle?: string;
  workspace_status?: string;
  flow_nodes?: { id: number; title: string; description: string }[];
  ticker_items?: { id: number; text: string }[];
  video_modal_title?: string;
  __component: string;
}

/* ---------------- WHY (Problem) ---------------- */
export interface ProblemData {
  eyebrow?: string;
  main_title?: string;
  title_highlight?: string;
  description?: string;
  conclusion_text?: string;
  Publish?: boolean | null;
  problem_items?: { id: number; title: string }[];
  outcome_cards?: { id: number; title: string; description: string }[];
  __component: string;
}

/* ---------------- HOW (Capabilities block) ---------------- */
export interface HowData {
  eyebrow?: string;
  main_title?: string;
  Publish?: boolean | null;
  capability_items?: {
    id: number;
    icon?: string;
    title?: string;
    description?: string;
  }[];
  __component: string;
}

/* ---------------- USE CASES ---------------- */
export interface UseCasesData {
  eyebrow?: string;
  main_title?: string;
  scenario_label?: string;
  core_logo?: StrapiImage | null;
  Publish?: boolean | null;
  use_case_items?: {
    id: number;
    tab_key?: string;
    title?: string;
    panel_title?: string;
    description?: string;
    scenario?: string;
    chips?: string;
  }[];
  __component: string;
}

/* ---------------- ENTERPRISE (Outcomes block) ---------------- */
export interface EnterpriseData {
  eyebrow?: string;
  main_title?: string;
  title_highlight?: string;
  strip_items?: { id: number; text: string }[];
  featured_kicker?: string;
  featured_title?: string;
  featured_description?: string;
  demo_button_label?: string;
  clips?: StrapiImage[] | null;
  Publish?: boolean | null;
  outcome_items?: {
    id: number;
    icon?: string;
    title?: string;
    description?: string;
    bullets?: string | null;
  }[];
  __component: string;
}

/* ---------------- PROOF (Analytics block) ---------------- */
export interface ProofData {
  eyebrow?: string;
  main_title?: string;
  featured_tag?: string;
  featured_quote?: string;
  featured_metric?: string;
  featured_button?: StrapiButton | null;
  bridge_logo?: StrapiImage | null;
  bridge_prefix?: string;
  bridge_brand?: string;
  bridge_description?: string;
  bridge_button?: StrapiButton | null;
  Publish?: boolean | null;
  features?: {
    id: number;
    story_label?: string;
    title?: string;
    description?: string;
  }[];
  __component: string;
}

/* ---------------- CTA (Final CTA block) ---------------- */
export interface CtaData {
  eyebrow?: string;
  main_title?: string;
  title_highlight?: string;
  description?: string;
  Publish?: boolean | null;
  button?: StrapiButton | null;
  secondary_button?: StrapiButton | null;
  __component: string;
}

/* ---------------- Generic fetch ---------------- */
async function getBlock<T extends { __component: string }>(
  uid: string,
  slug = "home"
): Promise<T | undefined> {
  const url =
    `${BASE}/api/pages?filters[slug]=${slug}` +
    `&populate[pageBuilder][on][${uid}][populate]=*`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Strapi error ${res.status}`);

  const json = await res.json();
  const blocks: T[] = json.data?.[0]?.pageBuilder ?? [];
  return blocks.find((b) => b.__component === uid);
}

/* ---------------- Header fetch ---------------- */
export async function getHeader(): Promise<HeaderData | null> {
  const url =
    `${BASE}/api/header` +
    `?populate[logo]=true` +
    `&populate[powered_by_logo]=true` +
    `&populate[nav_links][populate][children]=true`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Strapi error ${res.status}`);
  const json = await res.json();
  return json.data ?? null;
}

/* ---------------- Footer fetch ---------------- */
export async function getFooter(): Promise<FooterData | null> {
  const url =
    `${BASE}/api/footer` +
    `?populate[logo]=true` +
    `&populate[powered_by_logo]=true` +
    `&populate[columns][populate][links]=true` +
    `&populate[legal_links]=true`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Strapi error ${res.status}`);
  const json = await res.json();
  return json.data ?? null;
}

/* ---------------- Section fetchers ---------------- */
export const getHero = () =>
  getBlock<HeroData>("acf-sections.qubi-home-hero");

export const getProblem = () =>
  getBlock<ProblemData>("acf-sections.qubi-problem-section");

export const getHow = () =>
  getBlock<HowData>("acf-sections.qubi-capabilities-section");

export const getUseCases = () =>
  getBlock<UseCasesData>("acf-sections.qubi-use-cases-section");

export const getEnterprise = () =>
  getBlock<EnterpriseData>("acf-sections.qubi-outcomes-section");

export const getProof = () =>
  getBlock<ProofData>("acf-sections.qubi-analytics-section");

export const getCta = () =>
  getBlock<CtaData>("acf-sections.qubi-final-cta-section");