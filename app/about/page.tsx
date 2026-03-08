import {client} from "../../sanity/client";

type AboutSplitModule = {
  _type: "aboutSplitSection";
  _key: string;
  leftTitle?: string;
  leftBody?: string;
  leftCredits?: string;
  leftImageUrl?: string;
  leftMediaFileUrl?: string;
  leftMediaFileMimeType?: string;
  leftMediaAlt?: string;
  leftMediaFit?: "cover" | "contain";
  rightTitle?: string;
  rightBody?: string;
  rightImageUrl?: string;
  rightMediaFileUrl?: string;
  rightMediaFileMimeType?: string;
  rightMediaAlt?: string;
  rightMediaFit?: "cover" | "contain";
};

type AboutFullMediaModule = {
  _type: "aboutFullMediaSection";
  _key: string;
  label?: string;
  caption?: string;
  alt?: string;
  aspectRatio?: string;
  imageUrl?: string;
  mediaFileUrl?: string;
  mediaFileMimeType?: string;
};

type AboutModule = AboutSplitModule | AboutFullMediaModule;

type AboutPageData = {
  pageTitle?: string;
  modules?: AboutModule[];
};

const ABOUT_PAGE_QUERY = `*[
  _type == "aboutPage"
][0]{
  pageTitle,
  "modules": coalesce(modules[]{
    _type,
    _key,
    leftTitle,
    leftBody,
    leftCredits,
    leftMediaAlt,
    leftMediaFit,
    rightTitle,
    rightBody,
    rightMediaAlt,
    rightMediaFit,
    label,
    caption,
    alt,
    aspectRatio,
    "leftImageUrl": leftImage.asset->url,
    "leftMediaFileUrl": leftMediaFile.asset->url,
    "leftMediaFileMimeType": leftMediaFile.asset->mimeType,
    "rightImageUrl": rightImage.asset->url,
    "rightMediaFileUrl": rightMediaFile.asset->url,
    "rightMediaFileMimeType": rightMediaFile.asset->mimeType,
    "imageUrl": image.asset->url,
    "mediaFileUrl": mediaFile.asset->url,
    "mediaFileMimeType": mediaFile.asset->mimeType
  }, [])
}`;

export const revalidate = 30;

function splitParagraphs(value?: string) {
  return String(value || "")
    .split(/\n{2,}/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function getMediaKind(mimeType?: string, mediaUrl?: string) {
  const mime = (mimeType || "").toLowerCase();
  const url = (mediaUrl || "").toLowerCase();

  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("image/")) return "image";
  if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".mov")) return "video";
  if (url.endsWith(".gif")) return "image";

  return null;
}

export default async function AboutPage() {
  const aboutPage = await client.fetch<AboutPageData | null>(
    ABOUT_PAGE_QUERY,
    {},
    {next: {revalidate}}
  );

  const pageTitle = aboutPage?.pageTitle || "About";
  const modules = aboutPage?.modules || [];

  return (
    <div className="page aboutPage">
      <h1 className="h1 aboutPage__title">{pageTitle}</h1>

      {modules.length === 0 ? (
        <p className="p">Configura el documento About Page en Sanity para cargar contenido.</p>
      ) : null}

      {modules.map((module) => {
        if (module._type === "aboutSplitSection") {
          const leftParagraphs = splitParagraphs(module.leftBody);
          const rightParagraphs = splitParagraphs(module.rightBody);
          const leftMediaKind = getMediaKind(
            module.leftMediaFileMimeType,
            module.leftMediaFileUrl
          );
          const rightMediaKind = getMediaKind(
            module.rightMediaFileMimeType,
            module.rightMediaFileUrl
          );

          return (
            <section key={module._key} className="aboutModule aboutModule--split">
              <div className="aboutSplit__leftCol">
                <div className="aboutSplit__leftSticky">
                  {module.leftTitle ? (
                    <h2 className="aboutSplit__sectionTitle">{module.leftTitle}</h2>
                  ) : null}

                  {leftParagraphs.length > 0 ? (
                    <div className="aboutSplit__leftBody">
                      {leftParagraphs.map((paragraph, index) => (
                        <p key={`${module._key}-left-${index}`} className="aboutSplit__lead">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : null}

                  {module.leftMediaFileUrl && leftMediaKind === "video" ? (
                    <video
                      className={`aboutSplit__media aboutSplit__media--${
                        module.leftMediaFit || "cover"
                      }`}
                      src={module.leftMediaFileUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : null}

                  {module.leftMediaFileUrl && leftMediaKind === "image" ? (
                    <img
                      className={`aboutSplit__media aboutSplit__media--${
                        module.leftMediaFit || "cover"
                      }`}
                      src={module.leftMediaFileUrl}
                      alt={module.leftMediaAlt || ""}
                      loading="lazy"
                    />
                  ) : null}

                  {!module.leftMediaFileUrl && module.leftImageUrl ? (
                    <img
                      className={`aboutSplit__media aboutSplit__media--${
                        module.leftMediaFit || "cover"
                      }`}
                      src={`${module.leftImageUrl}?w=2200&fit=max&auto=format`}
                      alt={module.leftMediaAlt || ""}
                      loading="lazy"
                    />
                  ) : null}

                  {module.leftCredits ? (
                    <div className="aboutSplit__creditsWrap">
                      <h3 className="aboutSplit__metaLabel">Créditos</h3>
                      <p className="aboutSplit__credits">{module.leftCredits}</p>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="aboutSplit__rightCol">
                {module.rightTitle ? (
                  <h2 className="aboutSplit__sectionTitle">{module.rightTitle}</h2>
                ) : null}

                {module.rightMediaFileUrl && rightMediaKind === "video" ? (
                  <video
                    className={`aboutSplit__media aboutSplit__media--${
                      module.rightMediaFit || "cover"
                    }`}
                    src={module.rightMediaFileUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                ) : null}

                {module.rightMediaFileUrl && rightMediaKind === "image" ? (
                  <img
                    className={`aboutSplit__media aboutSplit__media--${
                      module.rightMediaFit || "cover"
                    }`}
                    src={module.rightMediaFileUrl}
                    alt={module.rightMediaAlt || ""}
                    loading="lazy"
                  />
                ) : null}

                {!module.rightMediaFileUrl && module.rightImageUrl ? (
                  <img
                    className={`aboutSplit__media aboutSplit__media--${
                      module.rightMediaFit || "cover"
                    }`}
                    src={`${module.rightImageUrl}?w=2200&fit=max&auto=format`}
                    alt={module.rightMediaAlt || ""}
                    loading="lazy"
                  />
                ) : null}

                {rightParagraphs.map((paragraph, index) => (
                  <p key={`${module._key}-right-${index}`} className="aboutSplit__body">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          );
        }

        if (module._type === "aboutFullMediaSection") {
          const mediaKind = getMediaKind(module.mediaFileMimeType, module.mediaFileUrl);
          const hasCustomRatio =
            Boolean(module.aspectRatio) && module.aspectRatio !== "auto";

          return (
            <section key={module._key} className="aboutModule aboutModule--fullMedia">
              {module.label ? <h2 className="aboutFullMedia__label">{module.label}</h2> : null}

              <div
                className="aboutFullMedia__frame"
                style={hasCustomRatio ? {aspectRatio: module.aspectRatio} : undefined}
              >
                {module.mediaFileUrl && mediaKind === "video" ? (
                  <video
                    className="aboutFullMedia__asset"
                    src={module.mediaFileUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                ) : null}

                {module.mediaFileUrl && mediaKind === "image" ? (
                  <img
                    className="aboutFullMedia__asset"
                    src={module.mediaFileUrl}
                    alt={module.alt || module.caption || ""}
                    loading="lazy"
                  />
                ) : null}

                {!module.mediaFileUrl && module.imageUrl ? (
                  <img
                    className="aboutFullMedia__asset"
                    src={`${module.imageUrl}?w=3200&fit=max&auto=format`}
                    alt={module.alt || module.caption || ""}
                    loading="lazy"
                  />
                ) : null}
              </div>

              {module.caption ? <p className="aboutFullMedia__caption">{module.caption}</p> : null}
            </section>
          );
        }

        return null;
      })}
    </div>
  );
}
