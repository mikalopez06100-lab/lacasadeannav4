"use client";

import { useEffect, useRef, useState } from "react";
import {
  SALE_BANNER_LINK,
  SALE_BANNER_LINK_MOBILE,
  SALE_BANNER_TEXT,
  SALE_BANNER_TEXT_MOBILE,
  SALE_END,
  SHOP_URL,
} from "@/lib/config";

const DISMISS_KEY = "sale-banner-dismissed";

/**
 * Bandeau temporaire (vente de Noël). Calcul de la date côté client uniquement :
 * le HTML statique mis en cache ne contient jamais le bandeau, il apparaît après
 * hydratation tant que SALE_END n'est pas passé, puis disparaît seul.
 * Il est fixe en haut ; sa hauteur est publiée dans --sale-banner-h pour que le
 * header fixe se place juste dessous (le hero n'est pas décalé).
 */
export function SaleBanner() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const remaining = new Date(SALE_END).getTime() - Date.now();
    let dismissed = false;
    try {
      dismissed = window.sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      /* stockage indisponible : on affiche */
    }
    if (remaining <= 0 || dismissed) return;
    setVisible(true);
    // page laissée ouverte : disparition à l'heure de fin (setTimeout plafonné à ~24,8 j)
    const timer = window.setTimeout(() => setVisible(false), Math.min(remaining, 2_147_000_000));
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const el = ref.current;
    if (!visible || !el) {
      root.style.removeProperty("--sale-banner-h");
      return;
    }
    const update = () => root.style.setProperty("--sale-banner-h", `${el.offsetHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--sale-banner-h");
    };
  }, [visible]);

  if (!visible) return null;

  const close = () => {
    try {
      window.sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignoré */
    }
    setVisible(false);
  };

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Vente de Noël"
      className="sale-banner fixed inset-x-0 top-0 z-50 overflow-hidden text-cream"
    >
      <div className="relative flex items-center py-2 pl-4 pr-11 text-[11.5px] leading-snug md:text-[13px] lg:justify-center lg:px-12">
        <p className="flex w-full items-center justify-between gap-3 text-left lg:w-auto lg:justify-center lg:text-center">
          <span className="min-w-0 [text-wrap:balance]">
            <span className="sale-star mr-1.5" aria-hidden="true">
              ✦
            </span>
            <span className="lg:hidden">{SALE_BANNER_TEXT_MOBILE}</span>
            <span className="hidden lg:inline">{SALE_BANNER_TEXT}</span>
          </span>
          <a href={SHOP_URL} target="_blank" rel="noopener noreferrer" className="sale-cta shrink-0">
            <span className="lg:hidden">{SALE_BANNER_LINK_MOBILE}</span>
            <span className="hidden lg:inline">{SALE_BANNER_LINK}</span>
            <span className="sale-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </p>
      </div>
      <button
        type="button"
        onClick={close}
        aria-label="Fermer le bandeau"
        className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
      >
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M3 3l10 10M13 3L3 13" />
        </svg>
      </button>
    </div>
  );
}
