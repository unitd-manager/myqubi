import { api, getStrapiMediaUrl } from '@/lib/api';

const BASE = import.meta.env.VITE_STRAPI_URL as string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = Record<string, any>;

/* ================= COMMON ================= */
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

/* ================= HEADER (single type) ================= */
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
    publish?: boolean | null;
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

/* ================= FOOTER (single type) ================= */
export interface FooterLink {
  id: number;
  label: string;
  url: string;
  publish?: boolean | null;
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

/* ================= HOME: HERO (+ Ticker) ================= */
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

/* ================= HOME: WHY (Problem) ================= */
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

/* ================= HOME: HOW (Capabilities block) ================= */
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

/* ================= HOME: USE CASES ================= */
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

/* ================= HOME: ENTERPRISE (Outcomes block) ================= */
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

/* ================= HOME: PROOF (Analytics block) ================= */
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

/* ================= CTA (Final CTA block, shared by pages) ================= */
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

/* ================= CUSTOMERS PAGE ================= */
export interface CsHeroData {
  badge_text?: string;
  main_title?: string;
  title_highlight?: string;
  description?: string;
  Publish?: boolean | null;
  __component: string;
}
export interface CsStatsData {
  stats?: Loose[];
  Publish?: boolean | null;
  __component: string;
}
export interface CsStoriesData {
  eyebrow?: string;
  main_title?: string;
  nav_label?: string;
  case_studies?: Loose[];
  Publish?: boolean | null;
  __component: string;
}
export interface CsStoryData {
  eyebrow?: string;
  main_title?: string;
  paragraphs?: Loose[];
  stats?: Loose[];
  Publish?: boolean | null;
  __component: string;
}
export interface CsWhyData {
  eyebrow?: string;
  main_title?: string;
  section_eyebrow?: string;
  section_title?: string;
  quote?: string;
  items?: { id: number; title?: string; description?: string }[];
  Publish?: boolean | null;
  __component: string;
}
export interface CustomersData {
  hero?: CsHeroData;
  stats?: CsStatsData;
  stories?: CsStoriesData;
  story?: CsStoryData;
  why?: CsWhyData;
  cta?: CtaData;
}

/* ================= FAQ PAGE ================= */
export interface FaqSectionData {
  eyebrow?: string;
  main_title?: string;
  items?: {
    id: number;
    category?: string;
    question?: string;
    answer?: string;
    Publish?: boolean | null;
  }[];
  Publish?: boolean | null;
  __component: string;
}
export interface FaqPageData {
  hero?: CsHeroData;
  faq?: FaqSectionData;
  cta?: CtaData;
}

/* ================= HELPERS ================= */
/**
 * Metric / stat value.
 * - Case-study metrics: primary_value + metric_type
 *     before_after -> "21 days → 2 days"
 *     reduction    -> "-60%"
 *     value        -> "95%"
 * - Plain stats: value / number / stat / title
 */
export const statValue = (s: Loose) => {
  if (s?.primary_value !== undefined && s?.primary_value !== null) {
    const p = String(s.primary_value);

    if (s.metric_type === "before_after" && s.secondary_value) {
      return `${s.secondary_value} → ${p}`;
    }
    if (s.metric_type === "reduction") {
      return p.startsWith("-") ? p : `-${p}`;
    }
    return p;
  }
  return String(s?.value ?? s?.number ?? s?.stat ?? s?.title ?? "");
};

export const statLabel = (s: Loose) =>
  String(s?.label ?? s?.description ?? s?.text ?? "");

export const itemText = (p: Loose) =>
  String(p?.text ?? p?.content ?? p?.description ?? p?.title ?? "");

/** markdown / multi-line text -> clean lines */
export const toLines = (md?: string): string[] =>
  (md ?? "")
    .split(/\r?\n/)
    .map((l) => l.replace(/^[#>\-*\s]+/, "").replace(/[*_`]/g, "").trim())
    .filter(Boolean);

/** metrics: repeatable [{label, primary_value...}] OR text lines "value | label" */
export function parseMetrics(m: unknown): { value: string; label: string }[] {
  if (Array.isArray(m)) {
    return m
      .filter((x) => x?.Publish !== false)
      .map((x) => ({ value: statValue(x), label: statLabel(x) }));
  }
  if (typeof m === "string") {
    return m
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean)
      .map((l) => {
        const [v, ...rest] = l.split("|");
        return { value: v.trim(), label: rest.join("|").trim() };
      });
  }
  return [];
}

/* ================= GENERIC BLOCK FETCH ================= */
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

/** block fetch that never throws (one bad block won't break the page) */
const safeBlock = <T extends { __component: string }>(
  uid: string,
  slug: string
) =>
  getBlock<T>(uid, slug).catch((e) => {
    console.error(`Block failed [${slug}]:`, uid, e);
    return undefined;
  });

/** Case studies block: `metrics` is a nested component, so populate it explicitly */
async function getCaseStudiesBlock(
  slug: string
): Promise<CsStoriesData | undefined> {
  const uid = "acf-sections.qubi-case-studies-section";
  const url =
    `${BASE}/api/pages?filters[slug]=${slug}` +
    `&populate[pageBuilder][on][${uid}][populate][case_studies][populate][metrics]=true`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Strapi error ${res.status}`);

  const json = await res.json();
  const blocks: CsStoriesData[] = json.data?.[0]?.pageBuilder ?? [];
  return blocks.find((b) => b.__component === uid);
}

/* ================= HEADER / FOOTER FETCH ================= */
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

/* ================= HOME FETCHERS ================= */
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

/* ================= CUSTOMERS FETCH ================= */
export async function getCustomersPage(): Promise<CustomersData> {
  const [hero, stats, stories, story, why, cta] = await Promise.all([
    safeBlock<CsHeroData>("acf-sections.qubi-simple-hero", "customers"),
    safeBlock<CsStatsData>("acf-sections.qubi-stats-section", "customers"),
    getCaseStudiesBlock("customers").catch((e) => {
      console.error("Case studies block failed:", e);
      return undefined;
    }),
    safeBlock<CsStoryData>("acf-sections.qubi-story-section", "customers"),
    safeBlock<CsWhyData>(
      "acf-sections.qubi-differentiators-section",
      "customers"
    ),
    safeBlock<CtaData>("acf-sections.qubi-final-cta-section", "customers"),
  ]);
  return { hero, stats, stories, story, why, cta };
}

/* ================= FAQ FETCH ================= */
export async function getFaqPage(): Promise<FaqPageData> {
  const [hero, faq, cta] = await Promise.all([
    safeBlock<CsHeroData>("acf-sections.qubi-simple-hero", "faqs"),
    safeBlock<FaqSectionData>("acf-sections.qubi-faq-section", "faqs"),
    safeBlock<CtaData>("acf-sections.qubi-final-cta-section", "faqs"),
  ]);
  return { hero, faq, cta };
}

/* ---------------- PLATFORM page blocks ---------------- */
export interface PlatformLabelValue {
  id: number;
  label?: string;
  value?: string;
  Publish?: boolean | null;
}

export interface PlatformStep {
  id: number;
  number?: string;
  title?: string;
  description?: string;
  Publish?: boolean | null;
}

export interface PlatformHeroData {
  eyebrow?: string;
  main_title?: string;
  title_highlight?: string;
  description?: string;
  intro_text?: string;
  stats?: PlatformLabelValue[];
  Publish?: boolean | null;
  __component: "acf-sections.platform-hero";
}

export interface PlatformStoryData {
  eyebrow?: string;
  main_title?: string;
  title_highlight?: string;
  description?: string;
  steps?: PlatformStep[];
  Publish?: boolean | null;
  __component: "acf-sections.platform-story";
}

export interface PlatformExplorerData {
  eyebrow?: string;
  main_title?: string;
  title_highlight?: string;
  description?: string;
  sidebar_label?: string;
  details_heading?: string;
  footer_text?: string;
  footer_logo?: StrapiImage | null;
  footer_brand?: string;
  categories?: { id: number; text?: string; Publish?: boolean | null }[];
  products?: {
    id: number;
    category?: string;
    tag?: string;
    title?: string;
    description?: string;
    capabilities?: { id: number; text?: string; Publish?: boolean | null }[];
    Publish?: boolean | null;
  }[];
  Publish?: boolean | null;
  __component: "acf-sections.platform-explorer";
}

export interface PlatformFoundationData {
  eyebrow?: string;
  main_title?: string;
  title_highlight?: string;
  description?: string;
  cards?: {
    id: number;
    eyebrow?: string;
    title?: string;
    description?: string;
    dark?: boolean | null;
    points?: PlatformLabelValue[];
    Publish?: boolean | null;
  }[];
  Publish?: boolean | null;
  __component: "acf-sections.platform-foundation";
}

export interface PlatformScaleData {
  eyebrow?: string;
  main_title?: string;
  title_highlight?: string;
  description?: string;
  steps?: PlatformStep[];
  Publish?: boolean | null;
  __component: "acf-sections.platform-scale";
}

export interface PlatformBridgeData {
  eyebrow?: string;
  main_title?: string;
  description?: string;
  button?: StrapiButton | null;
  secondary_button?: StrapiButton | null;
  Publish?: boolean | null;
  __component: "acf-sections.platform-bridge";
}

export interface PageData {
  title?: string;
  slug?: string;
  seo?: { metaTitle?: string; metaDescription?: string } | null;
  pageBuilder?: { __component: string; Publish?: boolean | null }[];
}

/* ---------------- Page by slug (deep-populated pageBuilder) ---------------- */
export async function getPageBySlug(slug: string): Promise<PageData | null> {
  const res = await fetch(`${BASE}/api/pages/slug/${encodeURIComponent(slug)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Strapi error ${res.status}`);
  const json = await res.json();
  return json.data ?? null;
}

/** Block of a given component in a page's pageBuilder (nth = 0 for the first, 1 for the second, …) */
export function findBlock<T extends { __component: string }>(
  page: PageData | null,
  uid: T["__component"],
  nth = 0
): T | undefined {
  return page?.pageBuilder?.filter((b) => b.__component === uid)[nth] as T | undefined;
}

/** Admin block to render; null when the page doesn't have it or an editor unpublished it. */
export function pickBlock<T extends { __component: string; Publish?: boolean | null }>(
  page: PageData | null,
  uid: T["__component"],
  nth = 0
): T | null {
  const block = findBlock<T>(page, uid, nth);
  return block && block.Publish !== false ? block : null;
}

/** Strapi media URL (relative uploads are served by the admin) */
export const mediaSrc = (image?: StrapiImage | null) =>
  image?.url ? (image.url.startsWith("http") ? image.url : `${BASE}${image.url}`) : undefined;

/** Title text: a new line is a line break, *text* is the highlighted (italic) part. */
export const titleParts = (text?: string) =>
  (text ?? "").split("\n").map((line) =>
    line.split(/(\*[^*]+\*)/).filter(Boolean).map((part) =>
      part.startsWith("*") && part.endsWith("*")
        ? { text: part.slice(1, -1), highlight: true }
        : { text: part, highlight: false }
    )
  );

/** Multi-line text field → non-empty lines */
export const lines = (text?: string) =>
  (text ?? "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

/** A button is rendered only when it has a label and is not unpublished */
export const isShown = (button?: { Publish?: boolean | null; label?: string } | null) =>
  !!button && button.Publish !== false && !!button.label;

/** Drop repeatable items an editor unpublished in the admin */
export const published = <T extends { Publish?: boolean | null }>(items?: T[] | null): T[] =>
  (items ?? []).filter((i) => i.Publish !== false);

/* ---------------- SOLUTIONS page blocks ---------------- */
export interface SolutionsUseCasesData {
  eyebrowLabel?: string;
  heading?: string;
  highlightedHeading?: string;
  description?: string;
  useCases?: {
    id: number;
    categoryLabel?: string;
    title?: string;
    description?: string;
    stats?: { id: number; text?: string; Publish?: boolean | null }[];
    Publish?: boolean | null;
  }[];
  Publish?: boolean | null;
  __component: "acf-sections.solutions-use-cases-layout";
}

/* ---------------- PRICING page blocks ---------------- */
export interface IconCardItem {
  id: number;
  icon?: string;
  title?: string;
  description?: string;
  Publish?: boolean | null;
}

export interface SimpleHeroData {
  badge_text?: string;
  main_title?: string;
  description?: string;
  Publish?: boolean | null;
  __component: "acf-sections.qubi-simple-hero";
}

export interface PlansData {
  eyebrow?: string;
  main_title?: string;
  cta_url?: string;
  nav_label?: string;
  popular_label?: string;
  compare_button_label?: string;
  fit_label?: string;
  profile_label?: string;
  profile_items?: PlatformLabelValue[];
  plans?: {
    id: number;
    tagline?: string;
    title?: string;
    tab_label?: string;
    popular?: boolean | null;
    description?: string;
    cta_label?: string;
    fit_title?: string;
    fit_description?: string;
    features?: { id: number; text?: string; Publish?: boolean | null }[];
    Publish?: boolean | null;
  }[];
  compare_title?: string;
  compare_aspect_label?: string;
  compare_rows?: {
    id: number;
    aspect?: string;
    values?: { id: number; text?: string; Publish?: boolean | null }[];
    Publish?: boolean | null;
  }[];
  Publish?: boolean | null;
  __component: "acf-sections.qubi-plans-section";
}

export interface IconGridData {
  eyebrow?: string;
  main_title?: string;
  description?: string;
  items?: IconCardItem[];
  Publish?: boolean | null;
  __component: "acf-sections.qubi-icon-grid-section";
}

export interface ExecutionData {
  main_title?: string;
  title_highlight?: string;
  description?: string;
  items?: IconCardItem[];
  callout_title?: string;
  callout_description?: string;
  Publish?: boolean | null;
  __component: "acf-sections.qubi-execution-section";
}

export interface ComparisonData {
  eyebrow?: string;
  main_title?: string;
  aspect_label?: string;
  them_label?: string;
  us_label?: string;
  rows?: { id: number; aspect?: string; them?: string; us?: string; Publish?: boolean | null }[];
  Publish?: boolean | null;
  __component: "acf-sections.qubi-comparison-section";
}

/* ================================================================
 * Legacy section/category API (restored) — still used by Blog, Demo,
 * Industries, Use Cases, Newsroom, Pricing and older home components.
 * ================================================================ */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StrapiMeta {
  pagination?: { page: number; pageSize: number; pageCount: number; total: number };
}

export interface StrapiResponse<T> {
  data: T;
  meta: StrapiMeta;
}

export interface StrapiItem<A> {
  id: number;
  attributes: A;
}

export interface StrapiMediaFormat {
  ext?: string;
  url: string;
  hash?: string;
  mime?: string;
  name?: string;
  path?: string | null;
  size?: number;
  width?: number;
  height?: number;
  sizeInBytes?: number;
}

export interface StrapiMediaAsset {
  id: number;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  formats?: Record<string, StrapiMediaFormat> | null;
}

// Content-type attribute shapes
export interface BlogAttributes {
  documentId?: string | null;
  title: string;
  description: string | null;
  author: string | null;
  date: string | null;
  category_id: number | null;
  flag: boolean | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keyword: string | null;
  us_title: string | null;
  us_description: string | null;
  published: boolean | null;
  images: StrapiMediaAsset[] | null;
}

export interface SectionAttributes {
  section_title: string;
  section_type: string | null;
  display_type: string | null;
  description: string | null;
  sort_order: number | null;
  published: boolean | null;
  external_link: string | null;
  internal_link: string | null;
  template: string | null;
  show_in_nav: boolean | null;
  images: StrapiMediaAsset[] | null;
}

export interface CategoryAttributes {
  section_id: number | null;
  category_title: string;
  category_type: string | null;
  description: string | null;
  description_short: string | null;
  display_type: string | null;
  template: string | null;
  sort_order: number | null;
  published: boolean | null;
  external_link: string | null;
  internal_link: string | null;
  images: StrapiMediaAsset[] | null;
}

export interface ContentAttributes {
  section_id: number | null;
  category_id: number | null;
  title: string;
  show_title: boolean | null;
  type: string | null;
  content_type: string | null;
  description_short: string | null;
  description: string | null;
  sort_order: number | null;
  published: boolean | null;
  content_date: string | null;
  external_link: string | null;
  favourite: boolean | null;
  images: StrapiMediaAsset[] | null;
}

export interface NavbarLink {
  label: string;
  href: string;
}

export interface NavbarSectionData {
  title: string;
  items: NavbarLink[];
  href?: string;
}

export interface EnquiryPayload {
  first_name: string;
  last_name?: string;
  email: string;
  company?: string;
  phone?: string;
  subject?: string;
  comments?: string;
  enquiry_type?: string;
  product?: string;
}

export interface SettingAttributes {
  key_text: string;
  value: string | null;
  group_name: string | null;
  value_type: string | null;
  published: boolean | null;
}

export interface FaqAttributes {
  question: string;
  answer: string;
  category: string | null;
  sort_order: number | null;
  published: boolean | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildQS(params: Record<string, string | number | boolean | undefined>) {
  const parts: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined) parts.push(`${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
  }
  return parts.length ? `?${parts.join("&")}` : "";
}

async function strapiGet<T>(path: string, qs = ""): Promise<T> {
  const res = await api.get(`${path}${qs}`);
  return res.data as T;
}

async function strapiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await api.post(path, { data: body });
  return res.data as T;
}

// ─── Strapi v5 → v4 normalizer ───────────────────────────────────────────────
// Strapi v5 REST API returns flat objects; normalize to { id, attributes } so
// all page mapping functions continue working without changes.
function normalizeItem<A>(raw: Record<string, unknown>): StrapiItem<A> {
  const { id, ...rest } = raw;
  return { id: id as number, attributes: rest as A };
}

function normalizeList<A>(raw: unknown): StrapiResponse<StrapiItem<A>[]> {
  const r = raw as { data: Record<string, unknown>[]; meta: StrapiMeta };
  return { data: (r.data ?? []).map((item) => normalizeItem<A>(item)), meta: r.meta ?? {} };
}

function normalizeOne<A>(raw: unknown): StrapiResponse<StrapiItem<A>> {
  const r = raw as { data: Record<string, unknown>; meta: StrapiMeta };
  return { data: normalizeItem<A>(r.data), meta: r.meta ?? {} };
}

/** Strip basic HTML/richtext tags for plain-text display */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").trim();
}

/** Resolve a Strapi media URL to an absolute URL */
export function mediaUrl(url: string | null | undefined): string {
  return getStrapiMediaUrl(url);
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export async function getBlogs(options?: { featured?: boolean; limit?: number }) {
  const qs =
    "?populate=images" +
    "&filters[published][$eq]=true" +
    (options?.featured !== undefined ? `&filters[flag][$eq]=${options.featured}` : "") +
    "&sort[0]=date:desc" +
    (options?.limit ? `&pagination[pageSize]=${options.limit}` : "&pagination[pageSize]=50");
  const raw = await strapiGet<unknown>("/blogs", qs);
  return normalizeList<BlogAttributes>(raw);
}

export async function getBlogById(id: number) {
  const raw = await strapiGet<unknown>(`/blogs/${id}?populate=images&filters[published][$eq]=true`);
  return normalizeOne<BlogAttributes>(raw);
}

export async function getBlogByDocumentId(documentId: string) {
  const raw = await strapiGet<unknown>(`/blogs/${encodeURIComponent(documentId)}?populate=images&filters[published][$eq]=true`);
  return normalizeOne<BlogAttributes>(raw);
}

// ─── Sections ────────────────────────────────────────────────────────────────

export async function getSections(sectionType?: string) {
  const filter = sectionType ? `&filters[section_type][$eq]=${encodeURIComponent(sectionType)}` : "";
  const raw = await strapiGet<unknown>(
    "/sections",
    `?populate=images&filters[published][$eq]=true${filter}&sort[0]=sort_order:asc&pagination[pageSize]=100`
  );
  return normalizeList<SectionAttributes>(raw);
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function getCategories(options?: { sectionId?: number; categoryType?: string }) {
  let filter = "";
  if (options?.sectionId) filter += `&filters[section_id][$eq]=${options.sectionId}`;
  if (options?.categoryType) filter += `&filters[category_type][$eq]=${encodeURIComponent(options.categoryType)}`;
  const raw = await strapiGet<unknown>(
    "/categories",
    `?populate=images&filters[published][$eq]=true${filter}&sort[0]=sort_order:asc&pagination[pageSize]=100`
  );
  return normalizeList<CategoryAttributes>(raw);
}

export async function getNavbarData(): Promise<NavbarSectionData[]> {
  const [sectionsRaw, categoriesRaw] = await Promise.all([
    strapiGet<unknown>(
      "/sections",
      "?filters[published][$eq]=true&filters[show_in_nav][$eq]=true&sort[0]=sort_order:asc&pagination[pageSize]=100"
    ),
    strapiGet<unknown>(
      "/categories",
      "?filters[published][$eq]=true&filters[show_in_nav][$eq]=true&sort[0]=sort_order:asc&pagination[pageSize]=100"
    ),
  ]);

  const sections = normalizeList<SectionAttributes>(sectionsRaw).data;
  const categories = normalizeList<CategoryAttributes>(categoriesRaw).data;
  const itemsBySection = new Map<number, NavbarLink[]>();

  for (const category of categories) {
    const sectionId = category.attributes.section_id;
    const href = category.attributes.internal_link || category.attributes.external_link;
    if (!sectionId || !href) continue;

    const items = itemsBySection.get(sectionId) ?? [];
    items.push({
      label: category.attributes.category_title,
      href,
    });
    itemsBySection.set(sectionId, items);
  }

  return sections.reduce<NavbarSectionData[]>((acc, section) => {
    const items = itemsBySection.get(section.id) ?? [];
    if (items.length > 0) {
      acc.push({
        title: section.attributes.section_title,
        items,
      });
      return acc;
    }

    const href = section.attributes.internal_link || section.attributes.external_link;
    if (href) {
      acc.push({
        title: section.attributes.section_title,
        items: [],
        href,
      });
    }

    return acc;
  }, []);
}

// ─── Contents ────────────────────────────────────────────────────────────────

export async function getContents(options?: {
  sectionId?: number;
  categoryId?: number;
  contentType?: string;
  type?: string;
  limit?: number;
}) {
  let filter = "";
  if (options?.sectionId) filter += `&filters[section_id][$eq]=${options.sectionId}`;
  if (options?.categoryId) filter += `&filters[category_id][$eq]=${options.categoryId}`;
  if (options?.contentType) filter += `&filters[content_type][$eq]=${encodeURIComponent(options.contentType)}`;
  if (options?.type) filter += `&filters[type][$eq]=${encodeURIComponent(options.type)}`;
  const limit = options?.limit ?? 50;
  const raw = await strapiGet<unknown>(
    "/contents",
    `?populate=images&filters[published][$eq]=true${filter}&sort[0]=sort_order:asc&pagination[pageSize]=${limit}`
  );
  return normalizeList<ContentAttributes>(raw);
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function getSettings(groupName?: string) {
  const filter = groupName ? `&filters[group_name][$eq]=${encodeURIComponent(groupName)}` : "";
  const raw = await strapiGet<unknown>(
    "/settings",
    `?filters[published][$eq]=true${filter}`
  );
  return normalizeList<SettingAttributes>(raw);
}

export async function getSettingByKey(key: string) {
  const raw = await strapiGet<unknown>(
    "/settings",
    `?filters[key_text][$eq]=${encodeURIComponent(key)}&filters[published][$eq]=true`
  );
  return normalizeList<SettingAttributes>(raw);
}

// ─── Home-page helpers ───────────────────────────────────────────────────────

/** Fetch the first published section of a given type, plus its categories */
export async function getHomeSectionWithItems(sectionType: string, categoryType: string) {
  const sectionResp = await getSections(sectionType);
  const section = sectionResp.data[0] ?? null;
  if (!section) return { section: null, items: [] as StrapiItem<CategoryAttributes>[] };
  const itemsResp = await getCategories({ sectionId: section.id, categoryType });
  return { section, items: itemsResp.data };
}

/** Fetch only the first published section of a given type */
export async function getHomeSection(sectionType: string) {
  const resp = await getSections(sectionType);
  return resp.data[0] ?? null;
}

// ─── Enquiries ────────────────────────────────────────────────────────────────

export async function createEnquiry(payload: EnquiryPayload) {
  return strapiPost<StrapiResponse<StrapiItem<EnquiryPayload>>>("/enquiries", {
    ...payload,
    creation_date: new Date().toISOString(),
    status: "new",
  });
}

// ─── FAQs ─────────────────────────────────────────────────────────────────────

export async function getFaqs(options?: { category?: string }) {
  let filter = "";
  if (options?.category) filter += `&filters[category][$eq]=${encodeURIComponent(options.category)}`;
  const raw = await strapiGet<unknown>(
    "/faqs",
    `?filters[published][$eq]=true${filter}&sort[0]=sort_order:asc&pagination[pageSize]=100`
  );
  return normalizeList<FaqAttributes>(raw);
}