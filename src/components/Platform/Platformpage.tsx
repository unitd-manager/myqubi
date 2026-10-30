import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "../qubi-landing/qubi-landing.css";
import "./Platformpage.css";
import { useSEO } from "@/hooks/useSEO";
import { SEOHead } from "@/components/SEOHead";
import qubiLogo from "@/assets/qubi-logo.png";
import {
  getPageBySlug,
  pickBlock,
  isShown,
  published,
  type PageData,
  type PlatformHeroData,
  type PlatformStoryData,
  type PlatformExplorerData,
  type PlatformFoundationData,
  type PlatformScaleData,
  type PlatformBridgeData,
  type CtaData,
} from "@/lib/strapi";

/* ---------------- Fallback content (used until the admin page has the block) ---------------- */
const steps = (rows: [string, string, string][]) =>
  rows.map(([number, title, description], id) => ({ id, number, title, description }));

const FALLBACK_HERO: PlatformHeroData = {
  __component: "acf-sections.platform-hero",
  eyebrow: "The qubi Platform",
  main_title: "One platform.",
  title_highlight: "Built to expand.",
  description: "Bring AI agents, automation, orchestration, integrations, human decisions, analytics, and governance into one connected environment — and add capabilities as your operation grows.",
  intro_text: "A growing platform designed to let teams start where they need and expand without rebuilding the foundation.",
  stats: [
    { id: 1, value: "One", label: "shared identity" },
    { id: 2, value: "Flexible", label: "capability adoption" },
    { id: 3, value: "Connected", label: "enterprise execution" },
  ],
};

const FALLBACK_STORY: PlatformStoryData = {
  __component: "acf-sections.platform-story",
  eyebrow: "How it fits together",
  main_title: "Start with what you need.",
  title_highlight: "Expand from there.",
  description: "The platform is designed so teams can adopt individual capabilities, connect them through a common foundation, and add more as their automation and AI programs mature.",
  steps: steps([
    ["", "Sign in", "Move across the platform through a shared identity and access model."],
    ["", "Adopt", "Begin with the capability that solves the immediate operational need."],
    ["", "Connect", "Bring agents, automations, systems, data, and human decisions into the same operating environment."],
    ["", "Govern", "Manage users, roles, permissions, organizations, and access from a shared foundation."],
    ["", "Expand", "Add new platform capabilities as teams, workflows, and use cases grow."],
  ]),
};

const product = (id: number, category: string, tag: string, title: string, description: string, caps: string[]) => ({
  id, category, tag, title, description,
  capabilities: caps.map((text, i) => ({ id: i, text })),
});

const FALLBACK_EXPLORER: PlatformExplorerData = {
  __component: "acf-sections.platform-explorer",
  eyebrow: "Explore the Platform",
  main_title: "Explore qubi by",
  title_highlight: "capability.",
  description: "Select a capability area on the left to explore the products and functions available across the platform. The structure can continue to grow as new capabilities are introduced.",
  sidebar_label: "Platform capabilities",
  details_heading: "Key capabilities",
  footer_text: "Part of the connected qubi platform ecosystem",
  categories: ["Build & Intelligence", "Automate & Execute", "Connect & Orchestrate", "Govern & Manage", "Discover & Improve", "Operate & Support"].map((text, id) => ({ id, text })),
  products: [
    product(1, "Build & Intelligence", "Build", "AgentHub / AI Builder", "A visual IDE for chat agents, voice agents, and agentic workflows. Design agents with governance guardrails, evaluations, and model fallback built in, then chain them into workflows with variables and versions.", ["Chat & voice agents on their own runtime", "Model-agnostic; credentials encrypted at rest", "Skills & MCP servers for external tools", "RAG sources chunked and embedded", "Jobs, queues & triggers on demand or scheduled", "Memory & vaults for encrypted continuity"]),
    product(2, "Govern & Manage", "Govern", "Qubi Platform", "Secure authentication, access management, and the launcher for everything. Single sign-on with one directory of people and role-based access applied across the platform.", ["Single sign-on with claims kept server-side", "User profiles unified across products", "Roles & permissions granular per product", "Organizations & tenants with isolated data", "Organization units scope what each person sees", "Product catalog & signed licensing"]),
    product(3, "Build & Intelligence", "Automate", "Automation Studio", "Low-code, drag-and-drop automation building. Compose end-to-end automations visually without heavy engineering, and hand them off to run on the platform.", ["Drag-and-drop builder", "Reusable automation components", "No deep coding required"]),
    product(4, "Govern & Manage", "Orchestrate", "Control Hub", "Centralized orchestration and monitoring. Run, schedule, and observe every automation and agent from one operational control plane.", ["Centralized orchestration", "Real-time monitoring", "Single pane of control"]),
    product(5, "Automate & Execute", "Execute", "Bot Agents", "Digital workers for attended and unattended work. Deploy bots that carry out repetitive, rules-based tasks alongside people or fully in the background.", ["Attended & unattended modes", "Repetitive work offloaded", "Scales with demand"]),
    product(6, "Connect & Orchestrate", "Connect", "Integration Hub", "Third-party APIs, connections, and data sync. Wire qubi into the systems you already run so work flows between them without manual keying.", ["Third-party API connections", "Data sync across systems", "Prebuilt & custom connectors"]),
    product(7, "Connect & Orchestrate", "Act", "Action Hub", "Business users act directly on a workflow. Give non-technical teams a place to review, approve, and push work forward without leaving the platform.", ["Business-user friendly", "Act directly on live workflows", "Human decisions in the loop"]),
    product(8, "Discover & Improve", "Discover", "Idea Hub", "Automation ideas, assessment, and ROI. Capture candidate processes, score them, and prioritize what to automate next by expected return.", ["Idea capture & pipeline", "Automation assessment", "ROI prioritization"]),
    product(9, "Discover & Improve", "Measure", "Analytics Hub", "Performance dashboards and ROI measurement. Track execution, throughput, and value delivered across the platform from one analytics layer.", ["Performance dashboards", "ROI measurement", "Cross-product visibility"]),
    product(10, "Operate & Support", "Support", "Support Hub", "Ticketing and incident management. Raise, route, and resolve issues across the platform so operations keep moving.", ["Ticketing built in", "Incident management", "Faster resolution"]),
  ],
};

const points = (rows: [string, string][]) => rows.map(([label, value], id) => ({ id, label, value }));

const FALLBACK_FOUNDATION: PlatformFoundationData = {
  __component: "acf-sections.platform-foundation",
  eyebrow: "Platform Foundation",
  main_title: "The layers that keep everything",
  title_highlight: "connected.",
  description: "The platform is more than a catalog of products. Shared intelligence, identity, governance, and operational control give each capability a common foundation.",
  cards: [
    {
      id: 1,
      eyebrow: "Intelligence & Agent Foundation",
      title: "AgentHub / AI Builder",
      description: "A visual environment for chat agents, voice agents, and agentic workflows, with governance guardrails, evaluations, model fallback, RAG, tools, jobs, queues, triggers, memory, and encrypted continuity.",
      dark: true,
      points: points([["Models", "Model-agnostic execution"], ["Knowledge", "RAG sources + retrieval"], ["Tools", "Skills + MCP servers"], ["Operations", "Jobs, queues + triggers"]]),
    },
    {
      id: 2,
      eyebrow: "Identity & Governance Foundation",
      title: "Qubi Platform",
      description: "Secure authentication, access management, and the launcher for the platform — one directory of people with role-based access and tenant-aware governance.",
      dark: false,
      points: points([["Identity", "OpenID Connect + OAuth 2.0"], ["Access", "Roles + permissions"], ["Structure", "Organizations + tenants"], ["Catalog", "Products + licensing"]]),
    },
  ],
};

const FALLBACK_SCALE: PlatformScaleData = {
  __component: "acf-sections.platform-scale",
  eyebrow: "Designed to Grow",
  main_title: "Not a fixed suite.",
  title_highlight: "An expandable platform.",
  description: "qubi does not need to be defined by a fixed number of products. New capabilities can join the same ecosystem while the customer experience — identity, governance, connections, and operations — stays consistent.",
  steps: steps([
    ["01", "Start focused", "Adopt the capability that addresses the immediate need."],
    ["02", "Connect the work", "Link enterprise systems, agents, automation, and people."],
    ["03", "Govern centrally", "Apply shared identity, roles, access, and operational visibility."],
    ["04", "Expand continuously", "Add capabilities and use cases without redesigning the platform foundation."],
  ]),
};

const FALLBACK_BRIDGE: PlatformBridgeData = {
  __component: "acf-sections.platform-bridge",
  eyebrow: "Platform + Solutions",
  main_title: "See what the platform can put to work.",
  description: "The Platform page explains what qubi is made of. The Solutions page shows how those capabilities come together across real workflows and industries.",
  button: { id: 1, label: "Explore Solutions →", url: "/solutions", Publish: true },
  secondary_button: { id: 2, label: "Watch the Demo", url: "", Publish: true },
};

const FALLBACK_CTA: CtaData = {
  __component: "acf-sections.qubi-final-cta-section",
  main_title: "Build from where you are.",
  description: "Explore the qubi platform with your current workflows in mind, then expand the environment as your automation and AI needs grow.",
  button: { id: 1, label: "Book a Platform Walkthrough →", url: "https://meetings.hubspot.com/enterprisedemo/qubi-consultation", Publish: true },
};


export default function Platformpage() {
  const { metadata, jsonLD } = useSEO({
    path: "/platform",
    fallbackTitle: "Qubi Platform | One Platform Built to Expand",
    fallbackDescription: "Explore qubi Platform",
  });
  const { openVideo } = useOutletContext<{ openVideo: () => void }>();
  const navigate = useNavigate();

  const [page, setPage] = useState<PageData | null>(null);
  useEffect(() => {
    getPageBySlug("platform").then(setPage).catch(console.error);
  }, []);

  const hero = pickBlock(page, FALLBACK_HERO);
  const story = pickBlock(page, FALLBACK_STORY);
  const explorer = pickBlock(page, FALLBACK_EXPLORER);
  const foundation = pickBlock(page, FALLBACK_FOUNDATION);
  const scale = pickBlock(page, FALLBACK_SCALE);
  const bridge = pickBlock(page, FALLBACK_BRIDGE);
  const cta = pickBlock(page, FALLBACK_CTA);

  const products = published(explorer?.products);
  const groups = published(explorer?.categories).map((c) => c.text ?? "");

  const [selected, setSelected] = useState(0);
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  // Open the first product's group once products are known (and again if admin data replaces the fallback).
  useEffect(() => {
    setSelected(0);
    setOpenGroups(products[0]?.category ? [products[0].category] : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const selectedItem = products[selected] ?? products[0];
  const toggleGroup = (group: string) => {
    const isCurrentlyOpen = openGroups.includes(group);
    if (!isCurrentlyOpen) {
      const firstIndexInGroup = products.findIndex(item => item.category === group);
      if (firstIndexInGroup !== -1) {
        setSelected(firstIndexInGroup);
      }
      setOpenGroups([group]);
    } else {
      setOpenGroups([]);
    }
  };

  const goTo = (url?: string) => {
    if (!url) return openVideo();
    if (url.startsWith("/")) return navigate(url);
    window.open(url, "_blank", "noopener");
  };

  return (
    <div className="qubi-landing">
      <SEOHead metadata={metadata} jsonLD={jsonLD} />

      <div className="platform-page">
        {hero && (
          <>
            <header className="platform-hero platform-interior-hero">
              <div className="platform-shell">
                {hero.eyebrow && <span className="platform-eyebrow">{hero.eyebrow}</span>}
                <h1>{hero.main_title} {hero.title_highlight && <em>{hero.title_highlight}</em>}</h1>
                {hero.description && <p>{hero.description}</p>}
              </div>
            </header>

            <div className="platform-proof">
              <div className="platform-shell platform-proof-grid">
                <div><p>{hero.intro_text}</p></div>
                {published(hero.stats).map((stat) => (
                  <div key={stat.id}><b>{stat.value}</b><span>{stat.label}</span></div>
                ))}
              </div>
            </div>
          </>
        )}

        {story && (
          <section className="platform-section platform-story">
            <div className="platform-shell platform-story-grid">
              <div className="platform-story-copy">
                {story.eyebrow && <span className="platform-eyebrow">{story.eyebrow}</span>}
                <h2>{story.main_title} {story.title_highlight && <em>{story.title_highlight}</em>}</h2>
                {story.description && <p>{story.description}</p>}
              </div>
              <div className="platform-flow">
                {published(story.steps).map((step) => (
                  <div className="platform-flow-row" key={step.id}><b>{step.title}</b><span>{step.description}</span></div>
                ))}
              </div>
            </div>
          </section>
        )}

        {explorer && selectedItem && (
          <section className="platform-section platform-explore-section" id="explore">
            <div className="platform-shell">
              <div className="platform-head">
                {explorer.eyebrow && <span className="platform-eyebrow">{explorer.eyebrow}</span>}
                <h2>{explorer.main_title} {explorer.title_highlight && <em>{explorer.title_highlight}</em>}</h2>
                {explorer.description && <p>{explorer.description}</p>}
              </div>
              <div className="platform-explorer">
                <aside className="platform-capability-side">
                  <div className="platform-side-label">{explorer.sidebar_label}</div>
                  {groups.map((group) => {
                    const matches = products.map((item, index) => ({ item, index })).filter(({ item }) => item.category === group);
                    const isOpen = openGroups.includes(group);
                    return (
                      <div className={`platform-capability-group ${isOpen? "open" : ""}`} key={group}>
                        <button type="button" className="platform-group-toggle" onClick={() => toggleGroup(group)}><span>{group}</span><span className="platform-chev">›</span></button>
                        {isOpen && (
                          <div className="platform-group-items">
                            {matches.map(({ item, index }) => (
                              <button type="button" key={item.id} className={`platform-cap-item ${index === selected? "active" : ""}`} onClick={() => setSelected(index)}>{item.title}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </aside>
                <article className="platform-capability-detail">
                  <div>
                    <div className="platform-detail-over">{selectedItem.category} · {selectedItem.tag}</div>
                    <h3>{selectedItem.title}</h3>
                    <p>{selectedItem.description}</p>
                    <div className="platform-detail-heading">{explorer.details_heading}</div>
                    <div className="platform-detail-list">
                      {published(selectedItem.capabilities).map((detail) => <div className="platform-detail" key={detail.id}>{detail.text}</div>)}
                    </div>
                  </div>
                  <div className="platform-detail-foot">
                    <span>{explorer.footer_text}</span>
                    <span className="platform-foot-brand">
                      <img src={qubiLogo} alt="qubi" className="platform-foot-logo" />
                      Platform
                    </span>
                  </div>
                </article>
              </div>
            </div>
          </section>
        )}

        {foundation && (
          <section className="platform-section platform-foundation">
            <div className="platform-shell">
              <div className="platform-head platform-head-center">
                {foundation.eyebrow && <span className="platform-eyebrow">{foundation.eyebrow}</span>}
                <h2>{foundation.main_title} {foundation.title_highlight && <em>{foundation.title_highlight}</em>}</h2>
                {foundation.description && <p>{foundation.description}</p>}
              </div>
              <div className="platform-foundation-grid">
                {published(foundation.cards).map((card) => (
                  <article className={`platform-foundation-card ${card.dark ? "dark" : ""}`} key={card.id}>
                    {card.eyebrow && <span className="platform-eyebrow">{card.eyebrow}</span>}
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <div className="platform-mini">
                      {published(card.points).map((point) => (
                        <div key={point.id}><span>{point.label}</span>{point.value}</div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {scale && (
          <section className="platform-section platform-scale">
            <div className="platform-shell platform-scale-grid">
              <div>
                {scale.eyebrow && <span className="platform-eyebrow">{scale.eyebrow}</span>}
                <h2>{scale.main_title}{scale.title_highlight && <><br /><em>{scale.title_highlight}</em></>}</h2>
                {scale.description && <p>{scale.description}</p>}
              </div>
              <div className="platform-ladder">
                {published(scale.steps).map((step) => (
                  <div className="platform-rung" key={step.id}><b>{step.number}</b><div><strong>{step.title}</strong><span>{step.description}</span></div></div>
                ))}
              </div>
            </div>
          </section>
        )}

        {bridge && (
          <section className="platform-section platform-bridge">
            <div className="platform-shell platform-bridge-grid">
              <div>
                {bridge.eyebrow && <span className="platform-eyebrow">{bridge.eyebrow}</span>}
                <h2>{bridge.main_title}</h2>
                {bridge.description && <p>{bridge.description}</p>}
              </div>
              <div className="platform-bridge-actions">
                {isShown(bridge.button) && (
                  <button className="btn platform-orange" onClick={() => goTo(bridge.button?.url)}>
                    {bridge.button?.label}
                  </button>
                )}
                {isShown(bridge.secondary_button) && (
                  <a className="platform-btn platform-watch platform-bridge-watch" onClick={() => goTo(bridge.secondary_button?.url)}>
                    {bridge.secondary_button?.label}
                  </a>
                )}
              </div>
            </div>
          </section>
        )}

        {cta && (
          <section className="platform-cta" id="demo">
            <div className="platform-shell">
              <h2>{cta.main_title}</h2>
              {cta.description && <p>{cta.description}</p>}
              {isShown(cta.button) && (
                <a className="platform-btn platform-orange" href={cta.button?.url} target="_blank" rel="noopener noreferrer">
                  {cta.button?.label}
                </a>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
