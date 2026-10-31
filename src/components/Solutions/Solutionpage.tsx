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

/** Internal links stay in the tab; external ones open a new tab */
const linkProps = (url?: string) =>
  url?.startsWith("/") ? { href: url } : { href: url, target: "_blank", rel: "noreferrer" };

// All content comes from the admin "solutions" page; a section without its block is not rendered.
export default function SolutionPage() {
  const { metadata, jsonLD } = useSEO({ path: "/solutions" });

  const [page, setPage] = useState<PageData | null>(null);
  useEffect(() => {
    getPageBySlug("solutions").then(setPage).catch(console.error);
  }, []);

  const hero = pickBlock<PlatformHeroData>(page, "acf-sections.platform-hero");
  const useCases = pickBlock<SolutionsUseCasesData>(page, "acf-sections.solutions-use-cases-layout");
  // Two platform-foundation blocks: the 1st is Industries, the 2nd is the Business Difference columns.
  const industries = pickBlock<PlatformFoundationData>(page, "acf-sections.platform-foundation", 0);
  const difference = pickBlock<PlatformFoundationData>(page, "acf-sections.platform-foundation", 1);
  const execution = pickBlock<PlatformStoryData>(page, "acf-sections.platform-story");
  const bridge = pickBlock<PlatformBridgeData>(page, "acf-sections.platform-bridge");
  const cta = pickBlock<CtaData>(page, "acf-sections.qubi-final-cta-section");

  const usecases = published(useCases?.useCases);
  const [selected, setSelected] = useState(0);
  const active = usecases[selected] ?? usecases[0];

  return (
    <div className="qubi-landing">
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
                {published(difference.cards).map((column) => (
                  <div className="sol-col" key={column.id}>
                    <div className="sol-col-title">{column.title}</div>
                    {published(column.points).map((row) => (
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
