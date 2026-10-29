import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { HeaderData } from "@/lib/strapi";

interface NavProps {
  header: HeaderData | null;
  onOpenVideo: () => void;
}

const Nav = ({ header, onOpenVideo }: NavProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("Home");
  const navigate = useNavigate();
  const location = useLocation();

  const links = (header?.nav_links ?? []).filter(
    (l) => (l.publish ?? l.Publish) !== false
  );

  useEffect(() => {
    const currentPath = location.pathname;
    const matched = links.find(
      (l) => l.url !== "/" && currentPath.startsWith(l.url)
    );
    setActiveLink(matched ? matched.label : links[0]?.label ?? "Home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, header]);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  }, [location]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string
  ) => {
    e.preventDefault();
    setActiveLink(label);
    setIsMobileOpen(false);

    if (href.includes("#")) {
      const [path, hash] = href.split("#");
      if (location.pathname === (path || "/")) {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", href);
      } else {
        navigate(href);
      }
    } else {
      navigate(href);
    }
  };

  if (!header) return null;

  return (
    <>
      <div className="nav-wrap">
        <nav className="nav">
          <a
            className="brand"
            href="/"
            onClick={(e) => handleNavClick(e, "/", links[0]?.label ?? "Home")}
          >
            <div className="brand-logo-wrap">
              {header.logo?.url && (
                <img
                  src={header.logo.url}
                  alt={header.logo.alternativeText || "qubi"}
                  className="brand-mark"
                />
              )}
              <div className="brand-divider"></div>
              <div className="powered-by">
                <span className="powered-label">{header.powered_by_label}</span>
                {header.powered_by_logo?.url && (
                  <img
                    src={header.powered_by_logo.url}
                    alt={header.powered_by_logo.alternativeText || "qBotica"}
                    className="qbotica-wordmark"
                  />
                )}
              </div>
            </div>
          </a>

          <div className="nav-links">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                onClick={(e) => handleNavClick(e, link.url, link.label)}
                className={activeLink === link.label ? "active-orange" : ""}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <button className="nav-watch" onClick={onOpenVideo}>
              {header.watch_button_label}
            </button>
            {header.cta_label && (
              <a
                className="btn btn-orange"
                href={header.cta_url}
                target="_blank"
                rel="noreferrer"
              >
                {header.cta_label}
              </a>
            )}
            <button
              className="nav-hamburger"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </nav>
      </div>

      {isMobileOpen && (
        <div className="mobile-menu">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              onClick={(e) => handleNavClick(e, link.url, link.label)}
              className={activeLink === link.label ? "active-orange" : ""}
            >
              {link.label}
            </a>
          ))}
          <button
            className="nav-watch"
            onClick={() => {
              setIsMobileOpen(false);
              onOpenVideo();
            }}
          >
            {header.watch_button_label}
          </button>
          {header.cta_label && (
            <a
              className="btn btn-orange"
              href={header.cta_url}
              target="_blank"
              rel="noreferrer"
            >
              {header.cta_label}
            </a>
          )}
        </div>
      )}
    </>
  );
};

export default Nav;