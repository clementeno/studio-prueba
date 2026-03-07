"use client";

import Link from "next/link";
import {useMemo, useState} from "react";

export type ProjectCategory = {
  title?: string;
  slug?: string;
  order?: number;
};

export type GalleryProject = {
  _id: string;
  title?: string;
  slug?: string;
  hoverDetail?: string;
  categories?: ProjectCategory[];
  legacyArchiveCategories?: string[];
  coverColor?: string;
  previewMediaUrl?: string;
  previewMediaMimeType?: string;
  coverImageUrl?: string;
};

export type ProjectsGallerySettings = {
  pageTitle?: string;
  casesLabel?: string;
  archivesLabel?: string;
  defaultMode?: "cases" | "archives";
  allFilterLabel?: string;
  categories?: ProjectCategory[];
};

type Mode = "cases" | "archives";

type FilterCategory = {
  slug: string;
  title: string;
  order?: number;
};

const ALL_FILTER_SLUG = "__all__";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeCategory(category: ProjectCategory | string): FilterCategory | null {
  if (typeof category === "string") {
    const title = category.trim();
    if (!title) return null;
    return {
      title,
      slug: slugify(title),
    };
  }

  const title = (category.title || "").trim();
  const slug = (category.slug || "").trim() || slugify(title);
  if (!title || !slug) return null;

  return {
    title,
    slug,
    order: category.order,
  };
}

function getProjectCategories(project: GalleryProject) {
  const values = new Map<string, FilterCategory>();

  (project.categories || []).forEach((category) => {
    const normalized = normalizeCategory(category);
    if (normalized) {
      values.set(normalized.slug, normalized);
    }
  });

  (project.legacyArchiveCategories || []).forEach((category) => {
    const normalized = normalizeCategory(category);
    if (normalized && !values.has(normalized.slug)) {
      values.set(normalized.slug, normalized);
    }
  });

  return Array.from(values.values());
}

function buildFilters(projects: GalleryProject[], settings?: ProjectsGallerySettings) {
  const configured = (settings?.categories || [])
    .map((category) => normalizeCategory(category))
    .filter((category): category is FilterCategory => Boolean(category));

  const dynamicMap = new Map<string, FilterCategory>();

  projects.forEach((project) => {
    getProjectCategories(project).forEach((category) => {
      if (!dynamicMap.has(category.slug)) {
        dynamicMap.set(category.slug, category);
      }
    });
  });

  const dynamic = Array.from(dynamicMap.values()).sort((a, b) => {
    const orderA = typeof a.order === "number" ? a.order : Number.POSITIVE_INFINITY;
    const orderB = typeof b.order === "number" ? b.order : Number.POSITIVE_INFINITY;

    if (orderA !== orderB) return orderA - orderB;

    return a.title.localeCompare(b.title);
  });

  const merged = new Map<string, FilterCategory>();

  configured.forEach((category) => merged.set(category.slug, category));
  dynamic.forEach((category) => {
    if (!merged.has(category.slug)) merged.set(category.slug, category);
  });

  return [
    {
      slug: ALL_FILTER_SLUG,
      title: settings?.allFilterLabel?.trim() || "Todos",
    },
    ...Array.from(merged.values()),
  ];
}

function getProjectMediaType(project: GalleryProject) {
  const mediaType = (project.previewMediaMimeType || "").toLowerCase();
  const mediaUrl = project.previewMediaUrl || "";

  if (mediaType.startsWith("video/")) return "video";
  if (mediaType.startsWith("image/")) return "image";

  const lowerUrl = mediaUrl.toLowerCase();
  if (lowerUrl.endsWith(".gif")) return "image";
  if (lowerUrl.endsWith(".mp4") || lowerUrl.endsWith(".webm") || lowerUrl.endsWith(".mov")) {
    return "video";
  }

  return null;
}

function ProjectMedia({
  project,
  className,
  imageWidth,
}: {
  project: GalleryProject;
  className: string;
  imageWidth: number;
}) {
  const mediaUrl = project.previewMediaUrl;
  const mediaType = getProjectMediaType(project);

  if (mediaUrl && mediaType === "video") {
    return (
      <video
        className={className}
        src={mediaUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />
    );
  }

  if (mediaUrl && mediaType === "image") {
    return <img className={className} src={mediaUrl} alt="" loading="lazy" />;
  }

  if (project.coverImageUrl) {
    return (
      <img
        className={className}
        src={`${project.coverImageUrl}?w=${imageWidth}&fit=max&auto=format`}
        alt=""
        loading="lazy"
      />
    );
  }

  return null;
}

export default function ProjectsGallery({
  projects,
  settings,
}: {
  projects: GalleryProject[];
  settings?: ProjectsGallerySettings;
}) {
  const [mode, setMode] = useState<Mode>(
    settings?.defaultMode === "archives" ? "archives" : "cases"
  );
  const [activeCategory, setActiveCategory] = useState(ALL_FILTER_SLUG);

  const filters = useMemo(() => buildFilters(projects, settings), [projects, settings]);

  const archiveItems = useMemo(() => {
    if (activeCategory === ALL_FILTER_SLUG) return projects;

    return projects.filter((project) =>
      getProjectCategories(project).some((category) => category.slug === activeCategory)
    );
  }, [activeCategory, projects]);

  const pageTitle = settings?.pageTitle?.trim() || "Proyectos";
  const casesLabel = settings?.casesLabel?.trim() || "Casos de estudio";
  const archivesLabel = settings?.archivesLabel?.trim() || "Archivos";

  return (
    <section className="projectsGallery">
      <div className="projectsGallery__top">
        <h1 className="h1 projectsGallery__title">{pageTitle}</h1>

        <div className="projectsMode" role="tablist" aria-label="Modalidad de proyectos">
          <button
            type="button"
            className={`projectsMode__button ${mode === "cases" ? "is-active" : ""}`}
            onClick={() => setMode("cases")}
            role="tab"
            aria-selected={mode === "cases"}
          >
            {casesLabel}
          </button>
          <button
            type="button"
            className={`projectsMode__button ${mode === "archives" ? "is-active" : ""}`}
            onClick={() => setMode("archives")}
            role="tab"
            aria-selected={mode === "archives"}
          >
            {archivesLabel}
          </button>
        </div>
      </div>

      {mode === "cases" ? (
        <div className="casesGrid">
          {projects.map((project) => {
            const slug = project.slug || "";
            const detail = project.hoverDetail || "";

            return (
              <Link key={project._id} href={`/proyectos/${slug}`} className="casesCard">
                <div
                  className="casesCard__media"
                  style={{
                    background: project.coverColor || "#ededed",
                  }}
                >
                  <ProjectMedia
                    project={project}
                    className="casesCard__asset"
                    imageWidth={1200}
                  />
                  {detail ? <p className="casesCard__hoverLine">{detail}</p> : null}
                </div>
                <h2 className="casesCard__title">{project.title || "Sin título"}</h2>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="archivesView">
          <div className="archivesFilters">
            {filters.map((filter) => (
              <button
                key={filter.slug}
                type="button"
                onClick={() => setActiveCategory(filter.slug)}
                className={`archivesFilters__button ${
                  activeCategory === filter.slug ? "is-active" : ""
                }`}
              >
                {filter.title}
              </button>
            ))}
          </div>

          <div className="archivesGrid">
            {archiveItems.map((project) => {
              const slug = project.slug || "";
              const categoryNames = getProjectCategories(project).map((category) => category.title);
              const categoriesLabel = categoryNames.join(" · ");

              return (
                <Link key={project._id} href={`/proyectos/${slug}`} className="archiveCard">
                  <div
                    className="archiveCard__media"
                    style={{
                      background: project.coverColor || "#efefef",
                    }}
                  >
                    <ProjectMedia
                      project={project}
                      className="archiveCard__asset"
                      imageWidth={900}
                    />
                  </div>
                  <div className="archiveCard__meta">
                    <h2 className="archiveCard__title">{project.title || "Sin título"}</h2>
                    <p className="archiveCard__cats">{categoriesLabel || "Sin categoría"}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
