import "../qubi-landing/qubi-landing.css"; // 1st - Nav ku
import "./Solutionpage.css"; // 2nd - Solutions ku
import { useEffect, useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { SEOHead } from "@/components/SEOHead";
import {
  getPageBySlug,
  pickBlock,
  isShown,
  published,
  type PageData,
  type PlatformHeroData,
  type SolutionsUseCasesData,
  type PlatformFoundationData,
  type PlatformStoryData,
  type PlatformBridgeData,
  type CtaData,
} from "@/lib/strapi";

/* ---------------- Fallback content (used until the admin page has the block) ---------------- */
const DEMO_URL = "https://meetings.hubspot.com/enterprisedemo/qubi-consultation";
const texts = (rows: string[]) => rows.map((text, id) => ({ id, text }));
const values = (rows: string[]) => rows.map((value, id) => ({ id, value }));

const FALLBACK_HERO: PlatformHeroData = {
  __component: "acf-sections.platform-hero",
  eyebrow: "Solutions",
  main_title: "Real work.",
  title_highlight: "Executed end-to-end.",
  description: "Explore the workflows and operational areas where qubi brings documents, decisions, systems, and actions together to deliver measurable outcomes.",
  intro_text: "Not demos. Not isolated tasks. Real operational workflows designed around completed work.",
  stats: [
    { id: 1, value: "85%", label: "Reduction in processing time" },
    { id: 2, value: "10x", label: "Increase in throughput" },
    { id: 3, value: "99.2%", label: "Accuracy rate achieved" },
  ],
};

const caseItem = (id: number, categoryLabel: string, title: string, description: string, results: string[]) => ({
  id, categoryLabel, title, description, stats: texts(results),
});

const FALLBACK_USE_CASES: SolutionsUseCasesData = {
  __component: "acf-sections.solutions-use-cases-layout",
  eyebrowLabel: "Use Cases",
  heading: "Start with the work you need to",
  highlightedHeading: "improve.",
  description: "Explore real workflows qubi can execute end-to-end, from intake and decision-making through system action and completion.",
  useCases: [
    caseItem(1, "Financial Services", "Invoice Processing & ERP Posting", "From document intake to validated ERP posting with zero manual touch. AI reads invoices, validates against POs, resolves exceptions, and posts — end-to-end.", ["21 days → 2 days processing", "95% accuracy", "$2M annual savings"]),
    caseItem(2, "Healthcare & Insurance", "Claims Intake to Adjudication", "End-to-end claims processing with AI-driven decisions. Extract claim data, validate against policy rules, route complex cases, and adjudicate — automatically.", ["60% reduction in processing time", "3x throughput increase", "98% accuracy"]),
    caseItem(3, "Shared Services", "Order-to-Cash Workflows", "From order capture to cash reconciliation, fully executed. qubi orchestrates order validation, fulfillment triggers, invoicing, and payment matching across systems.", ["Manual data entry eliminated", "50% faster O2C cycle", "99.2% accuracy"]),
    caseItem(4, "Finance & Accounting", "Financial Reconciliation", "Cross-system matching, exception handling, and reporting. Done. AI agents compare ledgers, flag discrepancies, and close the books without your team pulling all-nighters.", ["Month-end close accelerated", "Exceptions auto-resolved", "Full audit trail"]),
    caseItem(5, "Customer Operations", "Customer Onboarding", "Document collection, verification, and system setup, automated completely. New customers go from application to active in hours, not days.", ["Onboarding time cut by 70%", "Zero manual data entry", "Compliance enforced automatically"]),
    caseItem(6, "Cross-Industry", "Document-Heavy Decision Workflows", "Complex multi-document processes with intelligent routing. Contracts, applications, reports — qubi reads them, extracts what matters, and routes to the right action.", ["Any document type supported", "AI extracts structured data", "Decisions in minutes not days"]),
    caseItem(7, "Supply Chain & Logistics", "Supply Chain Document Processing", "Automate document processing and system updates across the supply chain. Bills of lading, shipping manifests, customs documents — processed and posted automatically.", ["Processing time from days to hours", "Zero manual keying", "Real-time visibility"]),
    caseItem(8, "Healthcare", "Prior Authorization Workflows", "Automate prior authorization workflows end-to-end. Extract clinical data, validate against payer rules, submit and track — with AI handling the complexity.", ["Auth turnaround from days to hours", "Denial rates reduced", "Clinical staff freed up"]),
  ],
};

const industry = (id: number, title: string, description: string, work: string[]) => ({
  id, title, description, points: values(work),
});

const FALLBACK_INDUSTRIES: PlatformFoundationData = {
  __component: "acf-sections.platform-foundation",
  eyebrow: "Industries & Operations",
  main_title: "Built around the work your teams",
  title_highlight: "already run.",
  description: "The same execution model can support different operational needs across industries and enterprise functions.",
  cards: [
    industry(1, "Financial Services", "AI-driven execution for the workflows that power financial operations, from invoice reconciliation to compliance reporting.", ["Close the books faster with AI-driven reconciliation", "Process invoices end-to-end without manual bottlenecks", "Automate three-way matching and exception handling", "Continuous invoice processing at scale"]),
    industry(2, "Healthcare and Insurance", "Handle the complexity of healthcare workflows with AI agents that understand clinical data, payer rules, and compliance requirements.", ["Process claims end-to-end without human bottlenecks", "Automate prior authorization workflows", "AI-driven eligibility verification", "Denial management and appeals automation"]),
    industry(3, "Shared Services and Operations", "Unify fragmented operations across shared service centers with AI orchestration that connects every system and every step.", ["Automate order-to-cash across systems", "Extract, validate, and act on financial data in minutes", "HR document processing and onboarding", "Cross-system reconciliation and reporting"]),
    industry(4, "Supply Chain and Logistics", "Keep goods moving with AI that processes shipping documents, updates systems, and handles exceptions without human bottlenecks.", ["Automate document processing and system updates", "Reduce processing time from days to hours", "Bills of lading and customs document automation", "Freight invoice processing and matching"]),
    industry(5, "Accounts Payable and Procurement", "Transform AP from a cost center into a strategic advantage with AI execution that handles the entire invoice lifecycle.", ["Three-way matching and exception handling", "Continuous invoice processing at scale", "Vendor onboarding and compliance checks", "Early payment discount capture"]),
    industry(6, "Customer Operations", "Deliver better customer experiences by automating the back-office work that backs every customer interaction.", ["Automate customer onboarding workflows", "Reduce manual data entry and system updates", "Contract processing and activation", "Customer document verification at scale"]),
  ],
};

const FALLBACK_EXECUTION: PlatformStoryData = {
  __component: "acf-sections.platform-story",
  eyebrow: "How qubi Executes",
  main_title: "From input to",
  title_highlight: "outcome.",
  description: "This page focuses on what happens to the work. For the agents, automation, orchestration, integrations, governance, and other capabilities behind it, explore the qubi Platform.",
  steps: [
    { id: 1, title: "Documents", description: "Ingest and understand invoices, claims, contracts, financials, and other business documents." },
    { id: 2, title: "Decisions", description: "Apply AI, rules, and business context to determine what should happen next." },
    { id: 3, title: "Actions", description: "Execute across the enterprise systems involved in the workflow." },
    { id: 4, title: "Outcomes", description: "Complete, verify, and deliver the work end-to-end." },
  ],
};

// The second platform-foundation block on the page: two comparison columns.
const FALLBACK_DIFFERENCE: PlatformFoundationData = {
  __component: "acf-sections.platform-foundation",
  eyebrow: "The Business Difference",
  main_title: "Most AI assists.",
  title_highlight: "qubi executes.",
  description: "Many tools stop at analysis or assistance. qubi is designed around completing operational work across the systems and decisions involved.",
  cards: [
    { id: 1, title: "Traditional approach", points: values(["Analyze data", "Assist users", "Require teams to execute", "Sit outside workflows"]) },
    { id: 2, title: "qubi", points: values(["Executes work", "Completes processes", "Owns outcomes", "Operates inside systems"]) },
  ],
};

const FALLBACK_BRIDGE: PlatformBridgeData = {
  __component: "acf-sections.platform-bridge",
  eyebrow: "Explore the Platform",
  main_title: "See what powers every qubi solution.",
  description: "Explore the agents, automation, orchestration, integrations, governance, analytics, and other capabilities that make end-to-end execution possible.",
  button: { id: 1, label: "Explore the qubi Platform →", url: "/platform", Publish: true },
};

const FALLBACK_CTA: CtaData = {
  __component: "acf-sections.qubi-final-cta-section",
  main_title: "Don't see your workflow?",
  description: "We work across operations where documents, decisions, and system actions need to happen together. Tell us what your team needs to execute.",
  button: { id: 1, label: "Book a Demo →", url: DEMO_URL, Publish: true },
};

/** Internal links stay in the tab; external ones open a new tab */
const linkProps = (url?: string) =>
  url?.startsWith("/") ? { href: url } : { href: url, target: "_blank", rel: "noreferrer" };

export default function SolutionPage() {
  const { metadata, jsonLD } = useSEO({
    path: "/solutions",
    fallbackTitle: "qubi Solutions | Real Work Executed End-to-End",
    fallbackDescription: "Explore workflows where qubi brings documents, decisions, systems and actions together.",
  });

  const [page, setPage] = useState<PageData | null>(null);
  useEffect(() => {
    getPageBySlug("solutions").then(setPage).catch(console.error);
  }, []);

  const hero = pickBlock(page, FALLBACK_HERO);
  const useCases = pickBlock(page, FALLBACK_USE_CASES);
  const industries = pickBlock(page, FALLBACK_INDUSTRIES, 0);
  const execution = pickBlock(page, FALLBACK_EXECUTION);
  const difference = pickBlock(page, FALLBACK_DIFFERENCE, 1);
  const bridge = pickBlock(page, FALLBACK_BRIDGE);
  const cta = pickBlock(page, FALLBACK_CTA);

  const usecases = published(useCases?.useCases);
  const [selected, setSelected] = useState(0);
  const active = usecases[selected] ?? usecases[0];
  const [traditional, qubiColumn] = published(difference?.cards);

  return (
    <div className="qubi-landing"> {/* ITHU THAAN FIX DA - qubi-solutions-root ah remove panniten */}
      <SEOHead metadata={metadata} jsonLD={jsonLD} />

      <div className="solutions-page">
        {hero && (
          <>
            <header className="sol-hero">
              <div className="sol-shell">
                {hero.eyebrow && <span className="sol-ey">{hero.eyebrow}</span>}
                <h1>{hero.main_title} {hero.title_highlight && <em>{hero.title_highlight}</em>}</h1>
                {hero.description && <p>{hero.description}</p>}
              </div>
            </header>

            <div className="sol-proof">
              <div className="sol-shell sol-proof-grid">
                <div><p>{hero.intro_text}</p></div>
                {published(hero.stats).map((stat) => (
                  <div key={stat.id}><b>{stat.value}</b><span>{stat.label}</span></div>
                ))}
              </div>
            </div>
          </>
        )}

        {useCases && active && (
          <section className="sol-section sol-usecases">
            <div className="sol-shell">
              <div className="sol-head">
                {useCases.eyebrowLabel && <span className="sol-ey">{useCases.eyebrowLabel}</span>}
                <h2>{useCases.heading} {useCases.highlightedHeading && <em>{useCases.highlightedHeading}</em>}</h2>
                {useCases.description && <p>{useCases.description}</p>}
              </div>

              <div className="sol-uc-layout">
                <div className="sol-uc-cards">
                  {usecases.map((x, i) => (
                    <button key={x.id} className={`sol-uc-card ${x === active ? "active" : ""}`} onClick={() => setSelected(i)}>
                      <small>{x.categoryLabel}</small>
                      <h3>{x.title}</h3>
                    </button>
                  ))}
                </div>

                <article className="sol-uc-detail">
                  <div>
                    <div className="sol-over">{active.categoryLabel}</div>
                    <h3>{active.title}</h3>
                    <p>{active.description}</p>
                  </div>
                  <div className="sol-results">
                    {published(active.stats).map((r) => <div key={r.id} className="sol-result">{r.text}</div>)}
                  </div>
                </article>
              </div>
            </div>
          </section>
        )}

        {industries && (
          <section className="sol-section sol-industries">
            <div className="sol-shell">
              <div className="sol-head center">
                {industries.eyebrow && <span className="sol-ey">{industries.eyebrow}</span>}
                <h2>{industries.main_title} {industries.title_highlight && <em>{industries.title_highlight}</em>}</h2>
                {industries.description && <p>{industries.description}</p>}
              </div>
              <div className="sol-industry-grid">
                {published(industries.cards).map((x) => (
                  <article key={x.id} className="sol-industry">
                    <h3>{x.title}</h3>
                    <p>{x.description}</p>
                    {published(x.points).map((v) => <div key={v.id} className="sol-work">{v.value}</div>)}
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {execution && (
          <section className="sol-section sol-execution">
            <div className="sol-shell sol-exec-grid">
              <div>
                {execution.eyebrow && <span className="sol-ey">{execution.eyebrow}</span>}
                <h2>{execution.main_title} {execution.title_highlight && <em>{execution.title_highlight}</em>}</h2>
                {execution.description && <p>{execution.description}</p>}
              </div>
              <div className="sol-steps">
                {published(execution.steps).map((step) => (
                  <div className="sol-step" key={step.id}><b>{step.title}</b><span>{step.description}</span></div>
                ))}
              </div>
            </div>
          </section>
        )}

        {difference && (
          <section className="sol-section sol-diff">
            <div className="sol-shell">
              <div className="sol-head">
                {difference.eyebrow && <span className="sol-ey">{difference.eyebrow}</span>}
                <h2>{difference.main_title} {difference.title_highlight && <em>{difference.title_highlight}</em>}</h2>
                {difference.description && <p>{difference.description}</p>}
              </div>
              <div className="sol-compare">
                {[traditional, qubiColumn].filter(Boolean).map((column) => (
                  <div className="sol-col" key={column!.id}>
                    <div className="sol-col-title">{column!.title}</div>
                    {published(column!.points).map((row) => (
                      <div className="sol-compare-row" key={row.id}>{row.value}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {bridge && (
          <section className="sol-section sol-bridge">
            <div className="sol-shell">
              <div className="sol-bridgebox">
                <div>
                  {bridge.eyebrow && <span className="sol-ey">{bridge.eyebrow}</span>}
                  <h2>{bridge.main_title}</h2>
                  {bridge.description && <p>{bridge.description}</p>}
                </div>
                {isShown(bridge.button) && (
                  <a {...linkProps(bridge.button?.url)} className="sol-btn sol-orange">{bridge.button?.label}</a>
                )}
              </div>
            </div>
          </section>
        )}

        {cta && (
          <section className="sol-cta">
            <div className="sol-shell">
              <h2>{cta.main_title}</h2>
              {cta.description && <p>{cta.description}</p>}
              {isShown(cta.button) && (
                <a {...linkProps(cta.button?.url)} className="sol-btn sol-orange">{cta.button?.label}</a>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
