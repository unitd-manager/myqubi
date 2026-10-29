import type { CtaData } from "@/lib/strapi";
import { toLines } from "@/lib/strapi";

export default function Cta({ cta }: { cta: CtaData }) {
  const btn = cta.button && cta.button.Publish !== false ? cta.button : null;
  const external = btn?.url?.startsWith("http");

  return (
    <section id="contact" className="cs-cta">
      <div className="cs-shell">
        <div className="cs-cta-box">
          <div>
            <h2>
              {cta.main_title}
              {cta.title_highlight && (
                <>
                  <br />
                  {cta.title_highlight}
                </>
              )}
            </h2>
            <p>{toLines(cta.description).join(" ")}</p>
          </div>
          {btn?.label && (
            <div className="cs-cta-actions">
              <a
                className="cs-btn cs-btn-dark"
                href={btn.url}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
              >
                {btn.label}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}