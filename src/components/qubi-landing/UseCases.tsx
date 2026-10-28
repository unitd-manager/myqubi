import { useState } from "react";
import type { UseCasesData } from "@/lib/strapi";

interface UseCasesProps {
  useCases: UseCasesData | null;
}

const UseCases = ({ useCases }: UseCasesProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!useCases || useCases.Publish === false) return null;

  const items = useCases.use_case_items ?? [];
  if (!items.length) return null;

  const current = items[Math.min(activeIndex, items.length - 1)];
  const chips = (current.chips ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);

  return (
    <section className="use-cases section-pad" id="use-cases">
      <div className="site-shell">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">{useCases.eyebrow?.trim()}</div>
            <h2>{useCases.main_title?.trim()}</h2>
          </div>
        </div>

        <div className="use-grid reveal">
          <div className="use-tabs">
            {items.map((item, i) => (
              <button
                key={item.id}
                type="button"
                className={`use-tab${activeIndex === i ? " active" : ""}`}
                onClick={() => setActiveIndex(i)}
              >
                {item.title}
                <span>→</span>
              </button>
            ))}
          </div>

          <div className="use-panel">
            <h3>{current.panel_title}</h3>
            <p>{current.description}</p>

            <div className="scenario">
              <small>{useCases.scenario_label}</small>
              <p>{current.scenario}</p>
            </div>

            <div className={`integration-cloud ${current.tab_key ?? ""}`}>
              <div className="integration-core">
                {useCases.core_logo?.url && (
                  <img
                    src={useCases.core_logo.url}
                    alt={useCases.core_logo.alternativeText || ""}
                  />
                )}
              </div>

              {chips.slice(0, 5).map((chip, i) => (
                <span key={`${chip}-${i}`} className={`logo-chip chip-${i + 1}`}>
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UseCases;