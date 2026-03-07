"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const delta = y - lastY;

          // umbral para evitar parpadeos
          if (Math.abs(delta) > 8) {
            if (delta > 0 && y > 40) setHidden(true);  // bajando
            if (delta < 0) setHidden(false);           // subiendo
            lastY = y;
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const headerClass = useMemo(() => {
    return [
      "siteHeader",
      isHome ? "siteHeader--home" : "siteHeader--page",
      hidden ? "is-hidden" : "",
    ].join(" ");
  }, [hidden, isHome]);

  return (
    <header className={headerClass}>
      <div className="siteHeader__inner">
        <Link className="brand" href="/">
          MÁSMENOS STUDIO
        </Link>

        <nav className="nav">
          <Link href="/proyectos">Proyectos</Link>
          <Link href="/ideas">Ideas</Link>
          <Link href="/about">About</Link>
          <Link href="/contacto">Contacto</Link>
        </nav>
      </div>
    </header>
  );
}