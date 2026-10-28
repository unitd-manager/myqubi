import type { HeroData } from "../../lib/strapi";

interface HeroProps {
  hero: HeroData | null;
  onOpenVideo: () => void;
}

const Hero = ({ hero, onOpenVideo }: HeroProps) => {
  if (!hero || hero.Publish === false) return null;

  const cta = hero.button;
  const demo = hero.secondary_button;

  return (
    <header className="hero">
      <div className="site-shell hero-grid">
        <div className="hero-copy reveal">
          <div className="eyebrow">{hero.badge_text?.trim()}</div>

          <h1>
            {hero.main_title?.trim()} <em>{hero.title_highlight}</em>
          </h1>

          <p>{hero.description}</p>

          <div className="hero-actions">
            {demo?.Publish && (
              <button className="btn btn-orange" onClick={onOpenVideo}>
                ▶ {demo.label}
              </button>
            )}
            {cta?.Publish && (
              <a className="btn btn-light" href={cta.url} target="_blank" rel="noreferrer">
                {cta.label} ↗
              </a>
            )}
          </div>

          <div className="micro-proof">
            <div className="proof-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            {hero.trust_text}
          </div>
        </div>

        <div className="demo-stage reveal">
          <div className="orbit one"></div>
          <div className="orbit two"></div>

          <div className="product-window">
            <div className="window-top">
              <div className="window-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="window-title">{hero.window_title}</div>
              <div style={{ width: 44 }}></div>
            </div>

            <div className="window-body">
              <aside className="sidebar">
                <div className="side-logo">{hero.sidebar_logo}</div>
                {hero.sidebar_items?.map((item) => (
                  <div
                    key={item.id}
                    className={`side-item${item.is_active ? " active" : ""}`}
                  >
                    {item.label}
                  </div>
                ))}
              </aside>

              <div className="workspace">
                <div className="workspace-head">
                  <div>
                    <h3>{hero.workspace_title}</h3>
                    <p>{hero.workspace_subtitle}</p>
                  </div>
                  <div className="status">{hero.workspace_status}</div>
                </div>

                <div className="flow-canvas">
                  <div className="flow-line line-a"></div>
                  <div className="flow-line line-b"></div>
                  <div className="flow-line line-c"></div>
                  <div className="flow-line line-d"></div>

                  {hero.flow_nodes?.map((node, i) => (
                    <div key={node.id} className={`flow-node node-${i + 1}`}>
                      <strong>
                        <b></b>
                        {node.title}
                      </strong>
                      <span>{node.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {demo?.Publish && (
              <div className="play-overlay" onClick={onOpenVideo}>
                <div className="play-button">▶</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;