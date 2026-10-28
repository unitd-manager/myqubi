import type { EnterpriseData } from "@/lib/strapi";

interface EnterpriseProps {
  enterprise: EnterpriseData | null;
  onOpenVideo: () => void;
}

const splitBullets = (s?: string | null) =>
  (s ?? "")
    .split("|")
    .map((b) => b.trim())
    .filter(Boolean);

const Enterprise = ({ enterprise, onOpenVideo }: EnterpriseProps) => {
  if (!enterprise || enterprise.Publish === false) return null;

  const clips = enterprise.clips ?? [];
  const cards = enterprise.outcome_items ?? [];

  return (
    <section className="enterprise section-pad" id="enterprise">
      <div className="site-shell">
        {/* ENTERPRISE INTRO */}
        <div className="enterprise-intro reveal">
          <div>
            <div className="eyebrow">{enterprise.eyebrow?.trim()}</div>

            <h2>
              {enterprise.main_title?.trim()}
              <br />
              <em>{enterprise.title_highlight}</em>
            </h2>
          </div>

          <div className="enterprise-intro-copy">
            <div className="confidence-strip">
              {enterprise.strip_items?.map((item) => (
                <span key={item.id}>{item.text}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ENTERPRISE CONTENT */}
        <div className="enterprise-grid reveal">
          {/* LEFT SIDE */}
          <article className="confidence-main">
            <div>
              <span className="confidence-kicker">
                {enterprise.featured_kicker}
              </span>
              <h3>{enterprise.featured_title}</h3>
              <p>{enterprise.featured_description}</p>
            </div>

            {/* GIF CLIPS */}
            <div className="enterprise-gif-box">
              <div className="enterprise-gif-grid">
                {clips.map((clip, index) => (
                  <div
                    className={`enterprise-gif enterprise-gif-${index + 1}`}
                    key={clip.id ?? clip.url}
                  >
                    <img
                      src={clip.url}
                      alt={clip.alternativeText || `qubi enterprise workflow ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* WATCH DEMO BUTTON */}
            <div className="enterprise-demo-action">
              <button
                type="button"
                className="btn btn-orange"
                onClick={onOpenVideo}
              >
                ▶ {enterprise.demo_button_label}
              </button>
            </div>
          </article>

          {/* RIGHT SIDE */}
          <div className="confidence-side">
            {cards.map((card) => {
              const bullets = splitBullets(card.bullets);
              return (
                <article className="confidence-card" key={card.id}>
                  <div>
                    <div className="confidence-icon">{card.icon}</div>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>

                  {bullets.length > 0 ? (
                    <ul>
                      {bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="visibility-mini">
                      <i></i>
                      <i></i>
                      <i></i>
                      <i></i>
                      <i></i>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Enterprise;