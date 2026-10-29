import { useState } from "react";
import { parseMetrics } from "@/lib/strapi";
import type { CsStoriesData } from "@/lib/strapi";

export default function StoryExplorer({ data }: { data: CsStoriesData }) {
  const items = data.case_studies ?? [];
  const [active, setActive] = useState(0);
  const story = items[active] ?? items[0];
  if (!story) return null;

  const metrics = parseMetrics(story.metrics);
  const quoteBy = story.quote_by ?? story.quoteBy;
  const navMetric = story.nav_metric ?? story.navMetric;

  return (
    <section id="stories" className="cs-stories cs-section-pad">
      <div className="cs-shell">
        <div className="cs-section-head">
          <span className="cs-eyebrow">{data.eyebrow}</span>
          <h2>{data.main_title}</h2>
        </div>

        <div className="cs-story-explorer">
          <aside className="cs-story-nav" aria-label={data.nav_label}>
            {data.nav_label && (
              <div className="cs-story-nav-label">{data.nav_label}</div>
            )}
            {items.map((item, i) => (
              <button
                type="button"
                key={item.id ?? i}
                className={`cs-story-tab ${i === active ? "active" : ""}`}
                onClick={() => setActive(i)}
              >
                <small>{item.industry}</small>
                <strong>{item.title}</strong>
                <span>{item.nav_metric ?? item.navMetric}</span>
              </button>
            ))}
          </aside>

          <article className="cs-story-content" aria-live="polite">
            <div className="cs-story-copy">
              <span className="cs-story-pill">{story.industry}</span>
              <h3>{story.title}</h3>
              <div className="cs-copy-block">
                <h4>Challenge</h4>
                <p>{story.challenge}</p>
              </div>
              <div className="cs-copy-block">
                <h4>Solution</h4>
                <p>{story.solution}</p>
              </div>
              {story.quote && (
                <blockquote className="cs-story-quote">
                  <p>“{story.quote}”</p>
                  {quoteBy && <cite>— {quoteBy}</cite>}
                </blockquote>
              )}
            </div>

            <aside className="cs-results-panel">
              <span className="cs-results-label">Results</span>
              <div className="cs-results-grid">
                {metrics.map((m, i) => (
                  <div className="cs-result-card" key={i}>
                    <strong>{m.value}</strong>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>
            </aside>
          </article>
        </div>
      </div>
    </section>
  );
}