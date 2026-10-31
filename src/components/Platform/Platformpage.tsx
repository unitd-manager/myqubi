import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "../qubi-landing/qubi-landing.css";
import "./Platformpage.css";
import { useSEO } from "@/hooks/useSEO";
import { SEOHead } from "@/components/SEOHead";
import {
  getPageBySlug,
  pickBlock,
  isShown,
  published,
  mediaSrc,
  type PageData,
  type PlatformHeroData,
  type PlatformStoryData,
  type PlatformExplorerData,
  type PlatformFoundationData,
  type PlatformScaleData,
  type PlatformBridgeData,
  type CtaData,
} from "@/lib/strapi";

// All content comes from the admin "platform" page; a section without its block is not rendered.
export default function Platformpage() {
  const { metadata, jsonLD } = useSEO({ path: "/platform" });
  const { openVideo } = useOutletContext<{ openVideo: () => void }>();
  const navigate = useNavigate();

  const [page, setPage] = useState<PageData | null>(null);
  useEffect(() => {
    getPageBySlug("platform").then(setPage).catch(console.error);
  }, []);

  const hero = pickBlock<PlatformHeroData>(page, "acf-sections.platform-hero");
  const story = pickBlock<PlatformStoryData>(page, "acf-sections.platform-story");
  const explorer = pickBlock<PlatformExplorerData>(page, "acf-sections.platform-explorer");
  const foundation = pickBlock<PlatformFoundationData>(page, "acf-sections.platform-foundation");
  const scale = pickBlock<PlatformScaleData>(page, "acf-sections.platform-scale");
  const bridge = pickBlock<PlatformBridgeData>(page, "acf-sections.platform-bridge");
  const cta = pickBlock<CtaData>(page, "acf-sections.qubi-final-cta-section");

  const products = published(explorer?.products);
  const groups = published(explorer?.categories).map((c) => c.text ?? "");

  const [selected, setSelected] = useState(0);
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  // Open the first product's group once the admin data has loaded.
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
                      {mediaSrc(explorer.footer_logo) && (
                        <img src={mediaSrc(explorer.footer_logo)} alt={explorer.footer_logo?.alternativeText ?? ""} className="platform-foot-logo" />
                      )}
                      {explorer.footer_brand}
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
