import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "@/lib/api";

type PublicSetting = {
  key?: string;
  text?: string | null;
};

type PublicSettingsResponse = { data?: PublicSetting[] };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function applySearchConsoleVerification(value: string | null | undefined) {
  const setting = value?.trim();
  if (!setting || /^google-site-verification:/i.test(setting) || /\.html$/i.test(setting)) return;

  const contentMatch = setting.match(/content=["']([^"']+)["']/i);
  const token = contentMatch?.[1] ?? setting;
  if (!token || token.startsWith("<")) return;

  let meta = document.querySelector<HTMLMetaElement>('meta[name="google-site-verification"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "google-site-verification";
    document.head.appendChild(meta);
  }
  meta.content = token;
}

export default function GoogleAnalytics() {
  const location = useLocation();
  const [measurementId, setMeasurementId] = useState("");

  useEffect(() => {
    let active = true;
    api
      .get<PublicSettingsResponse>("/public-settings")
      .then(({ data }) => {
        const settings = data?.data ?? [];
        const ga4 = settings.find((setting) => setting.key?.toLowerCase() === "ga4");
        const gsc = settings.find((setting) => setting.key?.toLowerCase() === "gsc");
        applySearchConsoleVerification(gsc?.text);
        const id = ga4?.text?.trim() ?? "";
        if (active && /^G-[A-Z0-9]+$/.test(id)) setMeasurementId(id);
      })
      .catch(() => {
        // Analytics is optional; a settings/API outage must not affect the site.
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!measurementId) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));

    if (!document.querySelector(`script[data-ga4-id="${measurementId}"]`)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      script.dataset.ga4Id = measurementId;
      document.head.appendChild(script);
      window.gtag("js", new Date());
      window.gtag("config", measurementId, { send_page_view: false });
    }

    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: `${location.pathname}${location.search}`,
      page_title: document.title,
    });
  }, [measurementId, location.pathname, location.search]);

  return null;
}
