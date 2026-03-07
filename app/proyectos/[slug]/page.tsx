import {notFound} from "next/navigation";
import {client} from "../../../sanity/client";

type ProjectModuleBase = {
  _type: string;
  _key: string;
};

type ProjectTextModule = ProjectModuleBase & {
  _type: "projectTextSection";
  heading?: string;
  body?: string;
};

type ProjectImageModule = ProjectModuleBase & {
  _type: "projectImageSection";
  imageUrl?: string;
  alt?: string;
  caption?: string;
  width?: "full" | "narrow";
};

type ProjectVideoModule = ProjectModuleBase & {
  _type: "projectVideoSection";
  videoFileUrl?: string;
  videoUrl?: string;
  caption?: string;
  autoplay?: boolean;
  loop?: boolean;
};

type ProjectGalleryImage = {
  _key: string;
  imageUrl?: string;
  alt?: string;
  caption?: string;
};

type ProjectGalleryModule = ProjectModuleBase & {
  _type: "projectGallerySection";
  title?: string;
  columns?: number;
  images?: ProjectGalleryImage[];
};

type ProjectEmbedModule = ProjectModuleBase & {
  _type: "projectEmbedSection";
  title?: string;
  embedUrl?: string;
  aspectRatio?: string;
};

type ProjectRowMediaItem = {
  _key: string;
  width?: number;
  alt?: string;
  caption?: string;
  imageUrl?: string;
  mediaFileUrl?: string;
  mediaFileMimeType?: string;
};

type ProjectMediaRowModule = ProjectModuleBase & {
  _type: "projectMediaRowSection";
  title?: string;
  items?: ProjectRowMediaItem[];
};

type ProjectModule =
  | ProjectMediaRowModule
  | ProjectTextModule
  | ProjectImageModule
  | ProjectVideoModule
  | ProjectGalleryModule
  | ProjectEmbedModule;

type ProjectClosingBlock = {
  _key: string;
  title?: string;
  body?: string;
};

type ProjectClosingSection = {
  leftText?: string;
  rightBlocks?: ProjectClosingBlock[];
};

type Project = {
  client?: string;
  title?: string;
  summary?: string;
  services?: string[];
  tags?: string[];
  coverColor?: string;
  coverImageUrl?: string;
  contentModules?: ProjectModule[];
  closingSection?: ProjectClosingSection;
};

const PROJECT_BY_SLUG_QUERY = `*[
  _type == "project" &&
  slug.current == $slug
][0]{
  client,
  title,
  summary,
  "services": coalesce(services, []),
  "tags": coalesce(tags, []),
  coverColor,
  "coverImageUrl": coverImage.asset->url,
  "closingSection": closingSection{
    leftText,
    "rightBlocks": coalesce(rightBlocks[]{
      _key,
      title,
      body
    }, [])
  },
  "contentModules": coalesce(contentModules[]{
    _type,
    _key,
    heading,
    body,
    caption,
    width,
    title,
    embedUrl,
    aspectRatio,
    videoUrl,
    autoplay,
    loop,
    columns,
    alt,
    "videoFileUrl": videoFile.asset->url,
    "imageUrl": image.asset->url,
    "mediaFileUrl": mediaFile.asset->url,
    "mediaFileMimeType": mediaFile.asset->mimeType,
    "items": items[]{
      _key,
      width,
      alt,
      caption,
      "imageUrl": image.asset->url,
      "mediaFileUrl": mediaFile.asset->url,
      "mediaFileMimeType": mediaFile.asset->mimeType
    },
    "images": images[]{
      _key,
      alt,
      caption,
      "imageUrl": image.asset->url
    }
  }, [])
}`;

const PROJECT_SLUGS_QUERY = `*[
  _type == "project" &&
  defined(slug.current)
]{
  "slug": slug.current
}`;

export const revalidate = 30;

export async function generateStaticParams() {
  return client.fetch<{slug: string}[]>(PROJECT_SLUGS_QUERY, {}, {next: {revalidate}});
}

function toEmbedUrl(rawUrl?: string) {
  if (!rawUrl) return "";

  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtube.com" || host === "m.youtube.com") {
      const videoId = url.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (host === "youtu.be") {
      const videoId = url.pathname.replace(/^\//, "");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }

    if (host === "vimeo.com") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      if (videoId) return `https://player.vimeo.com/video/${videoId}`;
    }

    return rawUrl;
  } catch {
    return rawUrl;
  }
}

function normalizeAspectRatio(value?: string) {
  if (!value) return "16 / 9";
  return value.replace("/", " / ");
}

function getMediaKind(item: ProjectRowMediaItem) {
  const mime = (item.mediaFileMimeType || "").toLowerCase();
  const url = (item.mediaFileUrl || "").toLowerCase();

  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("image/")) return "image";

  if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov")) return "video";
  if (url.endsWith(".gif")) return "image";

  return null;
}

function renderRowMedia(item: ProjectRowMediaItem) {
  const mediaKind = getMediaKind(item);

  if (mediaKind === "video" && item.mediaFileUrl) {
    return (
      <video
        className="projectRowMediaItem__asset"
        src={item.mediaFileUrl}
        controls
        playsInline
        preload="metadata"
      />
    );
  }

  if (mediaKind === "image" && item.mediaFileUrl) {
    return (
      <img
        className="projectRowMediaItem__asset"
        src={item.mediaFileUrl}
        alt={item.alt || item.caption || ""}
        loading="lazy"
      />
    );
  }

  if (item.imageUrl) {
    return (
      <img
        className="projectRowMediaItem__asset"
        src={`${item.imageUrl}?w=2000&fit=max&auto=format`}
        alt={item.alt || item.caption || ""}
        loading="lazy"
      />
    );
  }

  return null;
}

function renderProjectModule(module: ProjectModule) {
  if (module._type === "projectMediaRowSection") {
    return (
      <section key={module._key} className="projectModule projectModule--mediaRow">
        {module.title ? <h2 className="projectModule__heading">{module.title}</h2> : null}
        <div className="projectRowMediaGrid">
          {(module.items || []).map((item) => {
            const width = Math.min(Math.max(item.width || 12, 1), 12);

            return (
              <figure
                key={item._key}
                className="projectRowMediaItem"
                style={{gridColumn: `span ${width}`}}
              >
                {renderRowMedia(item)}
                {item.caption ? (
                  <figcaption className="projectModule__caption">{item.caption}</figcaption>
                ) : null}
              </figure>
            );
          })}
        </div>
      </section>
    );
  }

  if (module._type === "projectTextSection") {
    return (
      <section key={module._key} className="projectModule projectModule--text projectModule--narrow">
        {module.heading ? <h2 className="projectModule__heading">{module.heading}</h2> : null}
        {module.body ? <p className="projectModule__text">{module.body}</p> : null}
      </section>
    );
  }

  if (module._type === "projectImageSection") {
    return (
      <section
        key={module._key}
        className={`projectModule projectModule--image ${
          module.width === "narrow" ? "projectModule--narrow" : ""
        }`}
      >
        {module.imageUrl ? (
          <img
            className="projectModule__image"
            src={`${module.imageUrl}?w=2200&fit=max&auto=format`}
            alt={module.alt || module.caption || ""}
            loading="lazy"
          />
        ) : null}
        {module.caption ? <p className="projectModule__caption">{module.caption}</p> : null}
      </section>
    );
  }

  if (module._type === "projectVideoSection") {
    const videoSrc = module.videoFileUrl || module.videoUrl || "";

    return (
      <section key={module._key} className="projectModule projectModule--video">
        {videoSrc ? (
          <video
            className="projectModule__video"
            src={videoSrc}
            controls
            autoPlay={Boolean(module.autoplay)}
            loop={Boolean(module.loop)}
            muted={Boolean(module.autoplay)}
            playsInline
            preload="metadata"
          />
        ) : null}
        {module.caption ? <p className="projectModule__caption">{module.caption}</p> : null}
      </section>
    );
  }

  if (module._type === "projectGallerySection") {
    const columns = Math.min(Math.max(module.columns || 2, 2), 4);

    return (
      <section key={module._key} className="projectModule projectModule--gallery">
        {module.title ? <h2 className="projectModule__heading">{module.title}</h2> : null}
        <div
          className="projectModule__gallery"
          style={{gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`}}
        >
          {(module.images || []).map((item) => (
            <figure key={item._key} className="projectModule__galleryItem">
              {item.imageUrl ? (
                <img
                  className="projectModule__image"
                  src={`${item.imageUrl}?w=1500&fit=max&auto=format`}
                  alt={item.alt || item.caption || ""}
                  loading="lazy"
                />
              ) : null}
              {item.caption ? (
                <figcaption className="projectModule__caption">{item.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </section>
    );
  }

  if (module._type === "projectEmbedSection") {
    const embedUrl = toEmbedUrl(module.embedUrl);

    return (
      <section key={module._key} className="projectModule projectModule--embed">
        {module.title ? <h2 className="projectModule__heading">{module.title}</h2> : null}
        {embedUrl ? (
          <div
            className="projectModule__embed"
            style={{aspectRatio: normalizeAspectRatio(module.aspectRatio)}}
          >
            <iframe
              src={embedUrl}
              title={module.title || "Embedded media"}
              loading="lazy"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : null}
      </section>
    );
  }

  return null;
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;

  const project = await client.fetch<Project | null>(
    PROJECT_BY_SLUG_QUERY,
    {slug},
    {next: {revalidate}}
  );

  if (!project) {
    notFound();
  }

  return (
    <div className="page projectPage">
      <section
        className="projectHero"
        style={{
          background: project.coverColor || "#e9e9e9",
          backgroundImage: project.coverImageUrl
            ? `url(${project.coverImageUrl}?w=2200&fit=max&auto=format)`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="projectHero__overlay">
          <span className="projectHero__client">{project.client}</span>
          <h1 className="projectHero__title">{project.title}</h1>
          <p className="projectHero__summary">{project.summary}</p>
        </div>
      </section>

      <section className="projectMeta">
        <div className="projectMeta__block">
          <h2 className="projectMeta__label">Servicios</h2>
          <p className="projectMeta__text">
            {(project.services || []).join(" / ") || "Sin servicios"}
          </p>
        </div>
        <div className="projectMeta__block">
          <h2 className="projectMeta__label">Tags</h2>
          <div className="projectMeta__tags">
            {(project.tags || []).map((tag) => (
              <span key={tag} className="projectTag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {project.contentModules && project.contentModules.length > 0 ? (
        <section className="projectContent">{project.contentModules.map(renderProjectModule)}</section>
      ) : null}

      {project.closingSection?.leftText ||
      (project.closingSection?.rightBlocks && project.closingSection.rightBlocks.length > 0) ? (
        <section className="projectClosing">
          <div className="projectClosing__left">{project.closingSection?.leftText}</div>
          <div className="projectClosing__right">
            {(project.closingSection?.rightBlocks || []).map((block) => (
              <section key={block._key} className="projectClosingBlock">
                <h2 className="projectClosingBlock__title">{block.title}</h2>
                <p className="projectClosingBlock__body">{block.body}</p>
              </section>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
