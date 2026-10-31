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
  titleParts,
  lines,
  type PageData,
  type SimpleHeroData,
  type PlansData,
  type IconGridData,
  type ExecutionData,
  type ComparisonData,
  type FaqSectionData,
  type CtaData,
} from "@/lib/strapi";

/** Admin title → JSX: new lines become <br />, *text* becomes the orange <em> highlight */
function Title({ text }: { text?: string }) {
  return (
    <>
      {titleParts(text).map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 && <br />}
          {line.map((part, i) => (part.highlight ? <em key={i}>{part.text}</em> : part.text))}
        </Fragment>
      ))}
    </>
  );
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

// All content comes from the admin "pricing" page; a section without its block is not rendered.
const Pricingpage = () => {
  const { metadata, jsonLD, loading: seoLoading } = useSEO({ path: "/pricing" });

  const [page, setPage] = useState<PageData | null>(null);
  useEffect(() => {
    getPageBySlug("pricing").then(setPage).catch(console.error);
  }, []);

  const hero = pickBlock<SimpleHeroData>(page, "acf-sections.qubi-simple-hero");
  const plansBlock = pickBlock<PlansData>(page, "acf-sections.qubi-plans-section");
  const engine = pickBlock<IconGridData>(page, "acf-sections.qubi-icon-grid-section");
  const execution = pickBlock<ExecutionData>(page, "acf-sections.qubi-execution-section");
  const comparison = pickBlock<ComparisonData>(page, "acf-sections.qubi-comparison-section");
  const faq = pickBlock<FaqSectionData>(page, "acf-sections.qubi-faq-section");
  const cta = pickBlock<CtaData>(page, "acf-sections.qubi-final-cta-section");

  const plans = published(plansBlock?.plans);
  const faqs = published(faq?.items);
  const compareRows = published(plansBlock?.compare_rows);

  // Default to the plan marked "popular" in the admin.
  const popularIndex = Math.max(0, plans.findIndex((plan) => plan.popular));
  const [activePlan, setActivePlan] = useState<number | null>(null);
  const activeIndex = activePlan !== null && activePlan < plans.length ? activePlan : popularIndex;
  const selectedPlan = plans[activeIndex];

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

  // Callout lines: the first is the strong part, the rest are the muted <span>.
  const [noteStrong, ...noteRest] = lines(execution?.callout_title);
  const [noteSmall, ...noteSmallRest] = lines(execution?.callout_description);

  return (
    <div className="pricing-page qubi-landing">
      <SEOHead metadata={metadata} jsonLD={jsonLD} />

      {hero && (
        <header className="pricing-hero">
          <div className="pricing-shell pricing-hero-copy">
            {hero.badge_text && <span className="pricing-eyebrow">{hero.badge_text}</span>}
            <h1><Title text={hero.main_title} /></h1>
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
                <h2><Title text={plansBlock.main_title} /></h2>
              </div>
            </div>

            <div className="plan-explorer">
              <aside className="plan-nav">
                <div className="plan-nav-label">{plansBlock.nav_label}</div>
                {plans.map((plan, index) => (
                  <button
                    key={plan.id}
                    type="button"
                    className={`plan-tab ${index === activeIndex ? "active" : ""}`}
                    onClick={() => setActivePlan(index)}
                  >
                    <small>{plan.tagline}</small>
                    <strong>{plan.title}</strong>
                    <span>{plan.tab_label}</span>
                    {plan.popular && plansBlock.popular_label && <em className="popular">{plansBlock.popular_label}</em>}
                  </button>
                ))}
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
                    {selectedPlan.cta_label && plansBlock.cta_url && (
                      <a className="pricing-btn pricing-btn-orange" href={plansBlock.cta_url} target="_blank" rel="noreferrer">
                        {selectedPlan.cta_label}
                      </a>
                    )}
                    {plansBlock.compare_button_label && compareRows.length > 0 && (
                      <button className="pricing-btn compare-plans-btn" type="button" onClick={() => setCompareOpen(true)}>
                        {plansBlock.compare_button_label}
                      </button>
                    )}
                  </div>
                </div>
              </article>

              <aside className="plan-side" aria-label={plansBlock.fit_label}>
                <div className="side-center">
                  <div className="callout">
                    <small>{plansBlock.fit_label}</small>
                    <strong>{selectedPlan.fit_title}</strong>
                    <p>{selectedPlan.fit_description}</p>
                  </div>
                </div>
                <div className="side-profile">
                  <span>{plansBlock.profile_label}</span>
                  {published(plansBlock.profile_items).map((item) => (
                    <div key={item.id}><b>{item.label}</b><em>{item.value}</em></div>
                  ))}
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
                  <h2><Title text={engine.main_title} /></h2>
                  {engine.description && <p>{engine.description}</p>}
                </div>
                <div className="component-grid">
                  {published(engine.items).map((item) => (
                    <article className="component-card" key={item.id}>
                      <div className="component-icon">{item.icon}</div>
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
                        {lines(item.description).map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>

                {noteStrong && (
                  <div className="execution-note">
                    <div>
                      <strong>
                        {noteStrong}
                        {noteRest.length > 0 && <span>{noteRest.join(" ")}</span>}
                      </strong>
                      {noteSmall && (
                        <small>
                          {noteSmall}
                          {noteSmallRest.length > 0 && <span>{noteSmallRest.join(" ")}</span>}
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
                <h2><Title text={comparison.main_title} /></h2>
              </div>
            </div>
            <div className="compare-box">
              <div className="compare-row compare-header">
                <div>{comparison.aspect_label}</div><div>{comparison.them_label}</div><div>{comparison.us_label}</div>
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
              <h2><Title text={faq.main_title} /></h2>
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
                <h2><Title text={cta.main_title} /></h2>
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

      {compareOpen && plansBlock && (
        <div className="modal-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) setCompareOpen(false); }}>
          <div className="plan-modal" role="dialog" aria-modal="true">
            <div className="modal-head">
              <div><h3>{plansBlock.compare_title}</h3></div>
              <button className="modal-close" type="button" aria-label="Close" onClick={() => setCompareOpen(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="plan-compare-grid">
                <div className="pcell head">{plansBlock.compare_aspect_label}</div>
                {plans.map((plan) => (
                  <div
                    key={`head-${plan.id}`}
                    className={`pcell plan-head ${plan.popular ? "enterprise-col enterprise-top" : ""}`}
                  >
                    {plan.popular ? (
                      <span className="enterprise-head-inline">
                        <span>{plan.title}</span>
                        {plansBlock.popular_label && <span className="enterprise-badge">{plansBlock.popular_label.toUpperCase()}</span>}
                      </span>
                    ) : (
                      plan.title
                    )}
                  </div>
                ))}

                {compareRows.map((row, r) => (
                  <Fragment key={row.id}>
                    <div className="pcell head">{row.aspect}</div>
                    {plans.map((plan, i) => {
                      const cell = published(row.values)[i]?.text ?? "";
                      return (
                        <div
                          key={`${row.id}-${plan.id}`}
                          className={`pcell ${cell === "—" ? "muted" : "yes"} ${plan.popular ? "enterprise-col" : ""} ${
                            plan.popular && r === compareRows.length - 1 ? "enterprise-bottom" : ""
                          }`}
                        >
                          {cell}
                        </div>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricingpage;
