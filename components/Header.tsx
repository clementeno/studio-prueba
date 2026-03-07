"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import {client} from "../sanity/client";

type ProjectLabelResult = {
  client?: string;
  title?: string;
};

type ProjectLabelState = {
  slug: string;
  label: string;
};

const PROJECT_HEADER_LABEL_QUERY = `*[
  _type == "project" &&
  slug.current == $slug
][0]{
  client,
  title
}`;

function formatSlugLabel(slug: string) {
  return decodeURIComponent(slug)
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function normalizePathname(path: string) {
  if (!path) return "/";

  const clean = path.split("?")[0]?.split("#")[0] || "/";
  if (clean.length > 1 && clean.endsWith("/")) {
    return clean.slice(0, -1);
  }

  return clean;
}

export default function Header() {
  const routerPathname = usePathname();
  const [clientPathname, setClientPathname] = useState<string | null>(() =>
    typeof window !== "undefined" ? normalizePathname(window.location.pathname) : null
  );
  const pathname = normalizePathname(clientPathname || routerPathname || "/");
  const isHome = pathname === "/";
  const isProjectDetail = /^\/proyectos\/[^/]+$/.test(pathname);
  const projectSlug = isProjectDetail ? pathname.split("/")[2] || "" : "";

  const [hidden, setHidden] = useState(false);
  const [projectPastHero, setProjectPastHero] = useState(false);
  const [projectLabelState, setProjectLabelState] =
    useState<ProjectLabelState | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setClientPathname(normalizePathname(window.location.pathname));
  }, []);

  useEffect(() => {
    if (!routerPathname) return;
    setClientPathname(normalizePathname(routerPathname));
  }, [routerPathname]);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const delta = y - lastY;

          if (Math.abs(delta) > 8) {
            if (delta > 0 && y > 40) setHidden(true);
            if (delta < 0) setHidden(false);
            lastY = y;
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isProjectDetail) return;

    const hero = document.querySelector<HTMLElement>(".projectHero");

    if (!hero) {
      const resetId = window.requestAnimationFrame(() => {
        setProjectPastHero(false);
      });

      return () => window.cancelAnimationFrame(resetId);
    }

    const updateTone = () => {
      const headerHeightVar = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--headerH");
      const parsedHeaderHeight = Number.parseFloat(headerHeightVar);
      const headerHeight = Number.isFinite(parsedHeaderHeight)
        ? parsedHeaderHeight
        : 62;
      const heroBottom = hero.getBoundingClientRect().bottom;
      setProjectPastHero(heroBottom <= headerHeight);
    };

    const frameId = window.requestAnimationFrame(updateTone);

    window.addEventListener("scroll", updateTone, {passive: true});
    window.addEventListener("resize", updateTone);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateTone);
      window.removeEventListener("resize", updateTone);
    };
  }, [isProjectDetail, pathname]);

  useEffect(() => {
    let cancelled = false;

    if (!isProjectDetail || !projectSlug) {
      return;
    }

    client
      .fetch<ProjectLabelResult | null>(PROJECT_HEADER_LABEL_QUERY, {
        slug: projectSlug,
      })
      .then((result) => {
        if (cancelled) return;
        const label = (result?.client || result?.title || "").trim();
        if (!label) return;

        setProjectLabelState({slug: projectSlug, label});
      })
      .catch(() => {
        if (cancelled) return;
      });

    return () => {
      cancelled = true;
    };
  }, [isProjectDetail, projectSlug]);

  const navItems = [
    {href: "/proyectos", label: "Proyectos"},
    {href: "/ideas", label: "Ideas"},
    {href: "/about", label: "About"},
    {href: "/contacto", label: "Contacto"},
  ];

  const isNavActive = (href: string) => {
    if (href === "/proyectos") {
      return pathname === "/proyectos" || pathname.startsWith("/proyectos/");
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const tone: "light" | "dark" = isHome
    ? "light"
    : isProjectDetail
      ? projectPastHero
        ? "dark"
        : "light"
      : "dark";

  const fallbackProjectLabel =
    isProjectDetail && projectSlug ? formatSlugLabel(projectSlug) : "";
  const projectLabel =
    projectLabelState?.slug === projectSlug
      ? projectLabelState.label
      : fallbackProjectLabel;

  const headerClass = useMemo(() => {
    return [
      "siteHeader",
      tone === "light" ? "siteHeader--light" : "siteHeader--dark",
      hidden ? "is-hidden" : "",
    ].join(" ");
  }, [hidden, tone]);

  return (
    <>
      {isProjectDetail ? (
        <div
          className={[
            "siteHeader__projectLabel",
            tone === "light"
              ? "siteHeader__projectLabel--light"
              : "siteHeader__projectLabel--dark",
          ].join(" ")}
        >
          {projectLabel}
        </div>
      ) : null}

      <header className={headerClass}>
        <div className="siteHeader__inner">
          <Link className="brand" href="/">
            MÁSMENOS STUDIO
          </Link>

          <nav className="nav">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={isNavActive(item.href) ? "is-active" : ""}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
