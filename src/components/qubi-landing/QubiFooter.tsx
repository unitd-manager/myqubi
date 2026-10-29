import type { FooterData, FooterLink } from "@/lib/strapi";

interface FooterProps {
  footer: FooterData | null;
}

const visible = (l: FooterLink) => (l.publish ?? l.Publish) !== false;
const isExternal = (url: string) => /^https?:\/\//.test(url);

const FooterAnchor = ({ link }: { link: FooterLink }) => (
  <a
    href={link.url}
    {...(isExternal(link.url)
      ? { target: "_blank", rel: "noreferrer" }
      : {})}
  >
    {link.label}
  </a>
);

const QubiFooter = ({ footer }: FooterProps) => {
  if (!footer) return null;

  const columns = footer.columns ?? [];
  const legal = (footer.legal_links ?? []).filter(visible);

  return (
    <footer>
      <div className="site-shell">
        <div className="footer-grid">
          <div className="footer-intro">
            <a className="brand" href="/#top">
              <div className="brand-logo-wrap">
                {footer.logo?.url && (
                  <img
                    src={footer.logo.url}
                    alt={footer.logo.alternativeText || "qubi"}
                    className="brand-mark"
                  />
                )}
                <div className="brand-divider"></div>
                <div className="powered-by" aria-label="Powered by qBotica">
                  <span>{footer.powered_by_label}</span>
                  {footer.powered_by_logo?.url && (
                    <img
                      src={footer.powered_by_logo.url}
                      alt={footer.powered_by_logo.alternativeText || "qBotica"}
                      className="qbotica-wordmark"
                    />
                  )}
                </div>
              </div>
            </a>
            {footer.tagline && <p>{footer.tagline}</p>}
          </div>

          {columns.map((col) => (
            <div className="footer-col" key={col.id}>
              <strong>{col.title}</strong>
              {(col.links ?? []).filter(visible).map((link) => (
                <FooterAnchor key={link.id} link={link} />
              ))}
            </div>
          ))}
        </div>

        <div className="copyright">
          <span>
            {legal.map((link, i) => (
              <span key={link.id}>
                <FooterAnchor link={link} />
                {i < legal.length - 1 && " · "}
              </span>
            ))}
          </span>
          {footer.copyright_text && <span>{footer.copyright_text}</span>}
        </div>
      </div>
    </footer>
  );
};

export default QubiFooter;