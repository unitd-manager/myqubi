import { useEffect, useMemo, useState } from "react";
import "./Faqpage.css";
import { getFaqPage, toLines, type FaqPageData } from "@/lib/strapi";

type QA = { question: string; answer: string };

const Faqpage = () => {
  const [data, setData] = useState<FaqPageData | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const [openQuestion, setOpenQuestion] = useState(0);

  useEffect(() => {
    getFaqPage().then(setData).catch(console.error);
  }, []);

  // category field vechi group pannrom (Strapi-la entered order maaraadhu)
  const sections = useMemo(() => {
    const map = new Map<string, QA[]>();
    (data?.faq?.items ?? [])
      .filter((f) => f.Publish !== false)
      .forEach((f) => {
        const cat = f.category?.trim() || "General";
        if (!map.has(cat)) map.set(cat, []);
        map.get(cat)!.push({
          question: f.question ?? "",
          answer: f.answer ?? "",
        });
      });
    return Array.from(map.entries());
  }, [data]);

  if (!data) return <div className="faq-page-loading">Loading...</div>;

  const { hero, faq, cta } = data;
  const current = sections[activeSection] ?? sections[0];

  const heroDesc = toLines(hero?.description).join(" ");
  const ctaBtn =
    cta?.button && cta.button.Publish !== false ? cta.button : null;
  const ctaBtn2 =
    cta?.secondary_button && cta.secondary_button.Publish !== false
      ? cta.secondary_button
      : null;

  const selectSection = (i: number) => {
    setActiveSection(i);
    setOpenQuestion(0);
  };

  return (
    <div className="faq-page">
      {/* HERO */}
      {hero && hero.Publish !== false && (
        <header className="faq-hero">
          <div className="faq-shell">
            {hero.badge_text && (
              <span className="faq-pill">● &nbsp; {hero.badge_text}</span>
            )}
            <h1>
              {hero.main_title}{" "}
              {hero.title_highlight && <em>{hero.title_highlight}</em>}
            </h1>
            <p>{heroDesc}</p>
          </div>
        </header>
      )}

      {/* FAQ LIST */}
      {faq && faq.Publish !== false && current && (
        <main className="faq-main">
          <div className="faq-shell faq-layout">
            <aside className="faq-side">
              <div className="faq-label">{faq.eyebrow}</div>
              <div className="faq-cats">
                {sections.map(([title, questions], i) => (
                  <button
                    key={title}
                    type="button"
                    className={`faq-cat${i === activeSection ? " active" : ""}`}
                    onClick={() => selectSection(i)}
                  >
                    {title}
                    <span>
                      {questions.length}{" "}
                      {questions.length === 1 ? "question" : "questions"}
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            <section>
              <div className="faq-top">
                <div>
                  <small>{current[0]}</small>
                  <h2>{current[0]}</h2>
                </div>
                <div className="faq-count">
                  {String(current[1].length).padStart(2, "0")}
                </div>
              </div>

              <div>
                {current[1].map(({ question, answer }, i) => {
                  const open = i === openQuestion;
                  return (
                    <div
                      className={`faq-qa${open ? " open" : ""}`}
                      key={question}
                    >
                      <button
                        className="faq-q"
                        type="button"
                        onClick={() => setOpenQuestion(open ? -1 : i)}
                      >
                        <span className="faq-num">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="faq-qt">{question}</span>
                        <span className="faq-plus">+</span>
                      </button>
                      {open && <div className="faq-ans">{answer}</div>}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </main>
      )}

      {/* CTA */}
      {cta && cta.Publish !== false && (
        <section className="faq-cta">
          <div className="faq-shell faq-cg">
            <div>
              <h2>{cta.main_title}</h2>
              <p>{toLines(cta.description).join(" ")}</p>
            </div>
            <div className="faq-actions">
              {ctaBtn && (
                <a
                  className="faq-btn faq-orange"
                  href={ctaBtn.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {ctaBtn.label}
                </a>
              )}
              {ctaBtn2 && (
                <a
                  className="faq-btn faq-outline"
                  href={ctaBtn2.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {ctaBtn2.label}
                </a>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Faqpage;