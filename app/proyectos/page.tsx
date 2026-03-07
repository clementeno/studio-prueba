import {client} from "../../sanity/client";
import ProjectsGallery, {
  type GalleryProject,
  type ProjectsGallerySettings,
} from "./ProjectsGallery";

const PROJECTS_QUERY = `*[
  _type == "project" &&
  defined(slug.current)
] | order(coalesce(listingOrder, 9999) asc, _createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  summary,
  hoverDetail,
  "categories": coalesce(categories[]->{
    title,
    "slug": slug.current,
    order
  }, []),
  "legacyArchiveCategories": coalesce(archiveCategories, []),
  "previewMediaUrl": previewMedia.asset->url,
  "previewMediaMimeType": previewMedia.asset->mimeType,
  "coverImageUrl": coverImage.asset->url,
  coverColor
}`;

const PROJECTS_PAGE_QUERY = `*[
  _type == "projectsPage"
][0]{
  pageTitle,
  casesLabel,
  archivesLabel,
  defaultMode,
  allFilterLabel,
  "categories": coalesce(categories[]->{
    title,
    "slug": slug.current,
    order
  }, [])
}`;

export const revalidate = 30;

export default async function ProjectsPage() {
  const [projects, pageSettings] = await Promise.all([
    client.fetch<GalleryProject[]>(PROJECTS_QUERY, {}, {next: {revalidate}}),
    client.fetch<ProjectsGallerySettings | null>(
      PROJECTS_PAGE_QUERY,
      {},
      {next: {revalidate}}
    ),
  ]);

  return (
    <div className="page projectsPage">
      <ProjectsGallery projects={projects} settings={pageSettings || undefined} />
    </div>
  );
}
