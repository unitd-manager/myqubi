import { toLines, statValue, statLabel } from "@/lib/strapi";
import type { CsHeroData, CsStatsData } from "@/lib/strapi";

export default function Hero({
  hero,
  stats,
}: {
  hero: CsHeroData;
  stats?: CsStatsData;
}) {
  const lines = toLines(hero.description);
  const metrics = stats?.Publish === false ? [] : stats?.stats ?? [];

  return (
    <header className="cs-hero" id="top">
      <div className="cs-shell">
        <div className="cs-hero-copy">
          {hero.badge_text && (
            <span className="cs-eyebrow">{hero.badge_text}</span>
          )}
          <h1>
            {hero.main_title}
            {hero.title_highlight && (
              <>
                <br />
                <em>{hero.title_highlight}</em>
              </>
            )}
          </h1>
          <p>
            {lines.map((l, i) => (
              <span key={i}>
                {l}
                {i < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>

        <div className="cs-hero-metrics">
          {metrics.map((m, i) => (
            <div className="cs-hero-metric" key={m.id ?? i}>
              <strong>{statValue(m)}</strong>
              <span>{statLabel(m)}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}