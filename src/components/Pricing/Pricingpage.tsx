import { Fragment, useState, useEffect, type ReactNode } from "react";
import "./Pricingpage.css";
import "../qubi-landing/qubi-landing.css";
import { useSEO } from "@/hooks/useSEO";
import { SEOHead } from "@/components/SEOHead";
import {
  getPageBySlug,
  pickBlock,
  isShown,
  published,
  type PageData,
  type SimpleHeroData,
  type PlansData,
  type IconGridData,
  type ExecutionData,
  type ComparisonData,
  type FaqSectionData,
  type CtaData,
} from "@/lib/strapi";

const DEMO_URL = "https://meetings.hubspot.com/enterprisedemo/qubi-consultation";

/* ---------------- Title formatting ----------------
 * Editors can use a new line for a line break and *text* for the orange italic
 * highlight, e.g. "You pay for the\n*work completed,*\nnot licenses consumed".
 */
function formatTitle(text?: string): ReactNode {
  return (text ?? "").split("\n").map((line, lineIndex) => (
    <Fragment key={lineIndex}>
      {lineIndex > 0 && <br />}
      {line.split(/(\*[^*]+\*)/).map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : part
      )}
    </Fragment>
  ));
}

/** Plain-text answers with any URL turned into a "Learn more" link */
function formatAnswer(text?: string): ReactNode {
  return (text ?? "").split(/(https?:\/\/\S+)/).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <Fragment key={i}>
        <br />
        <a className="faq-link" href={part} target="_blank" rel="noopener noreferrer">Learn more →</a>
      </Fragment>
    ) : (
      part
    )
  );
}

/** "First sentence. Rest" → ["First sentence.", "Rest"] for the two-tone execution note */
const splitFirstSentence = (text?: string): [string, string] => {
  const match = (text ?? "").match(/^(.*?\.)\s+(.*)$/);
  return match ? [match[1], match[2]] : [text ?? "", ""];
};

/** Admin icon names (lucide-style) mapped to the glyphs this design uses */
const ICON_GLYPHS: Record<string, string> = {
  filetext: "▣",
  bot: "✦",
  settings: "⚙",
  link2: "↔",
  link: "↔",
};
const iconGlyph = (icon?: string) => {
  const value = icon?.trim() ?? "";
  return ICON_GLYPHS[value.toLowerCase()] ?? (value.length <= 2 ? value : "•");
};

/* ---------------- Plan details not stored in the admin ----------------
 * The admin plan item has tagline/title/description/features/cta. The side
 * "Best fit" panel, the short tab label and the badge stay here, matched by
 * plan title (falling back to position).
 */
const PLAN_EXTRAS: { match: string; label: string; fit: string; fitCopy: string; popular?: boolean }[] = [
  {
    match: "starter",
    label: "Single workflow",
    fit: "Start with one critical workflow",
    fitCopy: "Best suited to organizations validating ROI before expanding to broader execution.",
  },
  {
    match: "enterprise",
    label: "Multi-workflow",
    fit: "Multi-workflow execution at scale",
    fitCopy: "The most comprehensive standard program for organizations running multiple workflows as a managed service.",
    popular: true,
  },
  {
    match: "custom",
    label: "Transformational initiative",
    fit: "Enterprise transformation",
    fitCopy: "Designed around high-priority initiatives that require custom outcomes, governance, and delivery alignment.",
  },
];
const planExtras = (title: string | undefined, index: number) =>
  PLAN_EXTRAS.find((e) => title?.toLowerCase().includes(e.match)) ?? PLAN_EXTRAS[index] ?? PLAN_EXTRAS[0];

/* ---------------- "Compare plans" modal (static table) ---------------- */
const comparisonHeads = ["", "Starter Execution", "Enterprise Execution", "Custom Program"];

const comparisonRows = [
  ["Program fit", "Single critical workflow", "Multi-workflow, enterprise-scale operations", "Transformational initiatives"],
  ["Workflow execution", "1 end-to-end workflow execution", "Unlimited workflow executions", "Everything in Enterprise Execution"],
  ["DoqumentAI", "Up to 3 document types", "Full DoqumentAI any document type", "Everything in Enterprise Execution"],
  ["AI orchestration", "AI agent decision-making", "Advanced AI agent orchestration", "Custom execution roadmap"],
  ["Enterprise integrations", "Up to 5 enterprise system integrations", "Unlimited enterprise integrations", "Everything in Enterprise Execution"],
  ["Service level", "Standard SLA (business hours)", "24/7 managed service SLA", "Custom outcome metrics and SLAs"],
  ["Delivery support", "Dedicated implementation engineer", "Dedicated execution team", "Dedicated VP of Delivery"],
  ["Reporting", "Monthly outcome reporting", "Real-time outcome dashboards", "Custom outcome metrics and SLAs"],
  ["Additional program elements", "—", "Exception handling and escalation management", "Executive sponsorship alignment · Innovation lab access · Priority feature development"],
];

/* ---------------- Fallback content (used until the admin page has the block) ---------------- */
const textItems = (rows: string[]) => rows.map((text, id) => ({ id, text }));

const FALLBACK_HERO: SimpleHeroData = {
  __component: "acf-sections.qubi-simple-hero",
  badge_text: "Outcome-Based Pricing",
  main_title: "You pay for the\n*work completed,*\nnot licenses consumed",
  description: "qubi is a managed service, not a software subscription. We run your operations end-to-end and charge based on outcomes delivered.",
};

const FALLBACK_PLANS: PlansData = {
  __component: "acf-sections.qubi-plans-section",
  eyebrow: "Plans",
  main_title: "Execution programs\nfor every scale",
  cta_url: DEMO_URL,
  plans: [
    {
      id: 1,
      tagline: "For single-workflow deployments",
      title: "Starter Execution",
      description: "Ideal for organizations that want to start with one critical workflow and prove ROI before scaling.",
      cta_label: "Talk to Us →",
      features: textItems([
        "1 end-to-end workflow execution",
        "DoqumentAI for up to 3 document types",
        "AI agent decision-making",
        "Up to 5 enterprise system integrations",
        "Standard SLA (business hours)",
        "Dedicated implementation engineer",
        "Monthly outcome reporting",
      ]),
    },
    {
      id: 2,
      tagline: "For multi-workflow, enterprise-scale operations",
      title: "Enterprise Execution",
      description: "Full-scale AI execution across multiple workflows, with our team running everything as a managed service.",
      cta_label: "Talk to Us →",
      features: textItems([
        "Unlimited workflow executions",
        "Full DoqumentAI any document type",
        "Advanced AI agent orchestration",
        "Unlimited enterprise integrations",
        "24/7 managed service SLA",
        "Dedicated execution team",
        "Real-time outcome dashboards",
        "Exception handling and escalation management",
      ]),
    },
    {
      id: 3,
      tagline: "For transformational initiatives",
      title: "Custom Program",
      description: "Co-design an enterprise AI execution program aligned to your most critical operational transformation goals.",
      cta_label: "Contact Us →",
      features: textItems([
        "Everything in Enterprise Execution",
        "Co-designed execution roadmap",
        "Executive sponsorship alignment",
        "Custom outcome metrics and SLAs",
        "Dedicated VP of Delivery",
        "Innovation lab access",
        "Priority feature development",
      ]),
    },
  ],
};

const FALLBACK_ENGINE: IconGridData = {
  __component: "acf-sections.qubi-icon-grid-section",
  eyebrow: "The Execution Engine",
  main_title: "Platform Components",
  description: "Not standalone products. Components of one execution engine, working together to run your operations.",
  items: [
    { id: 1, icon: "FileText", title: "DoqumentAI", description: "Intelligent document processing that reads, extracts, and validates at scale." },
    { id: 2, icon: "Bot", title: "AI Agents", description: "Autonomous agents that make decisions and take action within your workflows." },
    { id: 3, icon: "Settings", title: "Workflow Automation", description: "End-to-end process orchestration that connects every step." },
    { id: 4, icon: "Link2", title: "Orchestration", description: "Enterprise-grade coordination across systems, teams, and exceptions." },
  ],
};

const FALLBACK_EXECUTION: ExecutionData = {
  __component: "acf-sections.qubi-execution-section",
  main_title: "AI is not the problem.",
  title_highlight: "Execution is.",
  description: "Most enterprise AI promises intelligence. But intelligence without action is just another dashboard.",
  // Each sentence of a card's description is shown as its own bullet.
  items: [
    { id: 1, title: "Analyzes but does not act", description: "Insight-only tools generate dashboards while your team still executes manually. AI that never acts is not reducing your workload." },
    { id: 2, title: "Assists but does not complete", description: "Copilots and assistants help, but they do not finish the job. Someone still has to validate, correct, and push through every system." },
    { id: 3, title: "Sits outside operations", description: "Disconnected from your systems. Disconnected from your workflows. Disconnected from where the actual work happens." },
  ],
  callout_title: "qubi does not sell intelligence. We sell execution.",
  callout_description: "Stop managing AI projects. Start getting work done.",
};

const FALLBACK_COMPARISON: ComparisonData = {
  __component: "acf-sections.qubi-comparison-section",
  eyebrow: "Comparison",
  main_title: "Why qubi, not workflow tools?",
  them_label: "Workflow Automation Tools",
  us_label: "qubi",
  rows: [
    ["AI Role", "Optional add-on", "Core decision engine"],
    ["Document Processing", "Requires separate tools", "Built-in DoqumentAI"],
    ["Delivery Model", "You build and operate", "We design and run (managed)"],
    ["Success Metric", "Task completion", "Business outcomes"],
    ["Exception Handling", "Manual intervention", "AI-powered escalation"],
    ["Pricing Model", "Per-seat or per-task licenses", "Outcome-based"],
  ].map(([aspect, them, us], id) => ({ id, aspect, them, us })),
};

const FALLBACK_FAQ: FaqSectionData = {
  __component: "acf-sections.qubi-faq-section",
  eyebrow: "FAQ",
  main_title: "Common questions",
  items: [
    ["How is qubi priced?", "qubi operates on an outcome-based model. You pay for work completed, not licenses consumed. Pricing is scoped per workflow based on volume, complexity, and the number of systems involved. We provide a detailed SOW after a discovery session."],
    ["How can I validate qubi before making a long-term commitment?", "qBotica participates in the Clutch Guarantee program, giving eligible new engagements a 14-day, no-questions-asked refund period. This gives you the opportunity to begin working with qubi and evaluate the engagement with greater confidence. If it isn't the right fit within the first 14 days, you can cancel in writing and receive a refund of eligible fees under the terms of the Clutch Guarantee. https://clutch.co/profile/qbotica"],
    ["How long does implementation take?", "Most workflows go live within 6-10 weeks. Complex multi-system orchestrations may take 12-16 weeks. We provide a detailed timeline during scoping."],
    ["What systems does qubi integrate with?", "qubi has 500+ pre-built connectors covering SAP, Oracle, Salesforce, ServiceNow, Workday, and most major enterprise platforms. We also build custom integrations as part of the managed service."],
    ["What happens when there is an exception?", "qubi handles most exceptions autonomously using AI-powered escalation logic. Cases requiring human judgment are routed to the right person with full context - no manual triage needed."],
    ["How do you measure success?", "We measure success by the business outcomes defined in your SOW - processing time reduction, cost savings, accuracy improvement, and throughput increase. Every client has a custom outcome dashboard."],
  ].map(([question, answer], id) => ({ id, question, answer })),
};

const FALLBACK_CTA: CtaData = {
  __component: "acf-sections.qubi-final-cta-section",
  main_title: "Get a custom proposal\nfor your workflow",
  description: "Every engagement starts with a 30-minute discovery call. We will scope your workflow, define success metrics, and provide a tailored proposal.",
  button: { id: 1, label: "Talk to an Expert →", url: DEMO_URL, Publish: true },
};

const Pricingpage = () => {
  const { metadata, jsonLD, loading: seoLoading } = useSEO({
    path: "/pricing",
    fallbackTitle: "Pricing | Qubi Flow Orchestrator",
    fallbackDescription:
      "Explore outcome-based pricing options for Qubi Flow Orchestrator.",
  });

  const [page, setPage] = useState<PageData | null>(null);
  useEffect(() => {
    getPageBySlug("pricing").then(setPage).catch(console.error);
  }, []);

  const hero = pickBlock(page, FALLBACK_HERO);
  const plansBlock = pickBlock(page, FALLBACK_PLANS);
  const engine = pickBlock(page, FALLBACK_ENGINE);
  const execution = pickBlock(page, FALLBACK_EXECUTION);
  const comparison = pickBlock(page, FALLBACK_COMPARISON);
  const faq = pickBlock(page, FALLBACK_FAQ);
  const cta = pickBlock(page, FALLBACK_CTA);

  const plans = published(plansBlock?.plans);
  const faqs = published(faq?.items);

  // Default to the "popular" plan (Enterprise), as before.
  const popularIndex = Math.max(0, plans.findIndex((plan, i) => planExtras(plan.title, i).popular));
  const [activePlan, setActivePlan] = useState<number | null>(null);
  const activeIndex = activePlan !== null && activePlan < plans.length ? activePlan : popularIndex;
  const selectedPlan = plans[activeIndex];
  const selectedExtras = planExtras(selectedPlan?.title, activeIndex);

  const [compareOpen, setCompareOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    if (!compareOpen) return;

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyPosition = body.style.position;
    const prevBodyTop = body.style.top;
    const prevBodyWidth = body.style.width;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.position = prevBodyPosition;
      body.style.top = prevBodyTop;
      body.style.width = prevBodyWidth;
      window.scrollTo(0, scrollY);
    };
  }, [compareOpen]);

  if (seoLoading) {
    return <div className="pricing-page-loading">Loading...</div>;
  }

  const [noteStrong, noteSpan] = splitFirstSentence(execution?.callout_title);
  const [noteSmall, noteSmallSpan] = splitFirstSentence(execution?.callout_description);

  return (
    <div className="pricing-page qubi-landing">
      <SEOHead metadata={metadata} jsonLD={jsonLD} />

      {hero && (
        <header className="pricing-hero">
          <div className="pricing-shell pricing-hero-copy">
            {hero.badge_text && <span className="pricing-eyebrow">{hero.badge_text}</span>}
            <h1>{formatTitle(hero.main_title)}</h1>
            {hero.description && <p>{hero.description}</p>}
          </div>
        </header>
      )}

      {plansBlock && selectedPlan && (
        <section id="plans" className="pricing-section pricing-plans">
          <div className="pricing-shell">
            <div className="pricing-section-head">
              <div>
                {plansBlock.eyebrow && <span className="pricing-eyebrow">{plansBlock.eyebrow}</span>}
                <h2>{formatTitle(plansBlock.main_title)}</h2>
              </div>
            </div>

            <div className="plan-explorer">
              <aside className="plan-nav">
                <div className="plan-nav-label">Choose a program</div>
                {plans.map((plan, index) => {
                  const extras = planExtras(plan.title, index);
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      className={`plan-tab ${index === activeIndex ? "active" : ""}`}
                      onClick={() => setActivePlan(index)}
                    >
                      <small>{plan.tagline}</small>
                      <strong>{plan.title}</strong>
                      <span>{extras.label}</span>
                      {extras.popular && <em className="popular">Most Popular</em>}
                    </button>
                  );
                })}
              </aside>

              <article className="plan-content" aria-live="polite">
                <div className="plan-copy">
                  <span className="plan-kicker">{selectedPlan.tagline}</span>
                  <h3>{selectedPlan.title}</h3>
                  <p className="plan-desc">{selectedPlan.description}</p>
                  <ul className="feature-list">
                    {published(selectedPlan.features).map((feature) => (
                      <li key={feature.id}>{feature.text}</li>
                    ))}
                  </ul>
                  <div className="plan-actions">
                    <a className="pricing-btn pricing-btn-orange" href={plansBlock.cta_url || DEMO_URL} target="_blank" rel="noreferrer">
                      {selectedPlan.cta_label}
                    </a>
                    <button className="pricing-btn compare-plans-btn" type="button" onClick={() => setCompareOpen(true)}>
                      Compare plans ↗
                    </button>
                  </div>
                </div>
              </article>

              <aside className="plan-side" aria-label="Program fit">
                <div className="side-center">
                  <div className="callout">
                    <small>Best fit</small>
                    <strong>{selectedExtras.fit}</strong>
                    <p>{selectedExtras.fitCopy}</p>
                  </div>
                </div>
                <div className="side-profile">
                  <span>Program profile</span>
                  <div><b>Delivery</b><em>Managed execution</em></div>
                  <div><b>Pricing</b><em>Outcome-based</em></div>
                </div>
              </aside>
            </div>
          </div>
        </section>
      )}

      {(engine || execution) && (
        <section id="engine" className="pricing-section pricing-engine">
          <div className="pricing-shell">
            {engine && (
              <div className="engine-grid">
                <div className="engine-intro">
                  {engine.eyebrow && <span className="pricing-eyebrow">{engine.eyebrow}</span>}
                  <h2>{formatTitle(engine.main_title)}</h2>
                  {engine.description && <p>{engine.description}</p>}
                </div>
                <div className="component-grid">
                  {published(engine.items).map((item) => (
                    <article className="component-card" key={item.id}>
                      <div className="component-icon">{iconGlyph(item.icon)}</div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}
            {execution && (
              <div className="execution-panel">
                <h3>{execution.main_title} {execution.title_highlight && <em>{execution.title_highlight}</em>}</h3>
                {execution.description && <p>{execution.description}</p>}
                <div className="execution-cards">
                  {published(execution.items).map((item) => (
                    <article className="execution-card" key={item.id}>
                      <h4>{item.title}</h4>
                      <ul className="execution-points">
                        {(item.description ?? "").split(/(?<=\.)\s+/).filter(Boolean).map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>

                {execution.callout_title && (
                  <div className="execution-note">
                    <div>
                      <strong>
                        {noteStrong}
                        {noteSpan && <span>{noteSpan}</span>}
                      </strong>
                      {execution.callout_description && (
                        <small>
                          {noteSmall}
                          {noteSmallSpan && <span>{noteSmallSpan}</span>}
                        </small>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {comparison && (
        <section id="compare" className="pricing-section pricing-compare">
          <div className="pricing-shell">
            <div className="pricing-section-head compare-head">
              <div>
                {comparison.eyebrow && <span className="pricing-eyebrow">{comparison.eyebrow}</span>}
                <h2>{formatTitle(comparison.main_title)}</h2>
              </div>
            </div>
            <div className="compare-box">
              <div className="compare-row compare-header">
                <div>Aspect</div><div>{comparison.them_label}</div><div>{comparison.us_label}</div>
              </div>
              {published(comparison.rows).map((row) => (
                <div className="compare-row" key={row.id}>
                  <div className="aspect">{row.aspect}</div><div>{row.them}</div><div>{row.us}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {faq && (
        <section id="faq" className="pricing-section pricing-faq">
          <div className="pricing-shell faq-wrap">
            <div className="faq-copy">
              {faq.eyebrow && <span className="pricing-eyebrow">{faq.eyebrow}</span>}
              <h2>{formatTitle(faq.main_title)}</h2>
            </div>

            <div className="accordion">
              {faqs.map((item, index) => {
                const open = openFaq === index;
                return (
                  <div className={`faq-item ${open ? "open" : ""}`} key={item.id}>
                    <button
                      className="faq-question"
                      type="button"
                      onClick={() => setOpenFaq(open ? -1 : index)}
                    >
                      <span>{item.question}</span>
                      <span>{open ? "×" : "+"}</span>
                    </button>
                    {open && <div className="faq-answer">{formatAnswer(item.answer)}</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {cta && (
        <section id="contact" className="pricing-cta">
          <div className="pricing-shell">
            <div className="cta-box">
              <div>
                <h2>{formatTitle(cta.main_title)}</h2>
                {cta.description && <p>{cta.description}</p>}
              </div>
              <div className="cta-actions">
                {[cta.button, cta.secondary_button].filter(isShown).map((button) => (
                  <a key={button!.label} className="pricing-btn pricing-btn-dark" href={button!.url} target="_blank" rel="noreferrer">
                    {button!.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {compareOpen && (
        <div className="modal-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setCompareOpen(false); }}>
          <div className="plan-modal" role="dialog" aria-modal="true">
            <div className="modal-head">
              <div><h3>Compare execution programs</h3></div>
              <button className="modal-close" type="button" aria-label="Close comparison" onClick={() => setCompareOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="plan-compare-grid">
                {comparisonHeads.map((h, i) => (
                  <div
                    key={`head-${i}`}
                    className={`pcell ${i === 0 ? "head" : "plan-head"} ${i === 2 ? "enterprise-col enterprise-top" : ""}`}
                  >
                    {i === 2 ? (
                      <span className="enterprise-head-inline">
                        <span>{h}</span>
                        <span className="enterprise-badge">MOST POPULAR</span>
                      </span>
                    ) : (
                      h || "Aspect"
                    )}
                  </div>
                ))}

                {comparisonRows.map((row, r) =>
                  row.map((cell, i) => (
                    <div
                      key={`${r}-${i}`}
                      className={`pcell ${i === 0 ? "head" : cell === "—" ? "muted" : "yes"} ${i === 2 ? "enterprise-col" : ""} ${
                        i === 2 && r === comparisonRows.length - 1 ? "enterprise-bottom" : ""
                      }`}
                    >
                      {cell}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricingpage;
