import { itemText, statValue, statLabel } from "@/lib/strapi";
import type { CsWhyData, CsStoryData } from "@/lib/strapi";

export default function WhyQubi({
  why,
  story,
}: {
  why?: CsWhyData;
  story?: CsStoryData;
}) {
  const showWhy = why && why.Publish !== false;
  const showStory = story && story.Publish !== false;
  const paras = (story?.paragraphs ?? []).map(itemText).filter(Boolean);

  return (
    <section id="why" className="cs-why">
      <div className="cs-shell">
        {showWhy && (why.section_eyebrow || why.section_title) && (
          <div className="cs-why-head">
            {why.section_eyebrow && (
              <span className="cs-eyebrow">{why.section_eyebrow}</span>
            )}
            {why.section_title && <h2>{why.section_title}</h2>}
          </div>
        )}

        <div className="cs-why-grid">
          {showWhy && (
            <article className="cs-choose">
              <div className="cs-sub-label">{why.eyebrow}</div>
              <h3>{why.main_title}</h3>
              <div className="cs-choose-list">
                {(why.items ?? []).map((it, i) => (
                  <div className="cs-choose-item" key={it.id ?? i}>
                    <strong>{it.title}</strong>
                    <p>{it.description}</p>
                  </div>
                ))}
              </div>
              {why.quote && (
                <>
                  <div className="cs-choose-divider"></div>
                  <blockquote className="cs-choose-quote">
                    "{why.quote}"
                  </blockquote>
                </>
              )}
            </article>
          )}

          {showStory && (
            <article className="cs-built">
              <div>
                <div className="cs-sub-label">{story.eyebrow}</div>
                <h3>{story.main_title}</h3>
                {paras.map((p, i) => (
                  <p
                    key={i}
                    className={i === paras.length - 1 ? "cs-closing" : undefined}
                  >
                    {p}
                  </p>
                ))}
              </div>
              <div className="cs-proof-row">
                {(story.stats ?? []).map((s, i) => (
                  <div key={s.id ?? i}>
                    <strong>{statValue(s)}</strong>
                    <span>{statLabel(s)}</span>
                  </div>
                ))}
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}