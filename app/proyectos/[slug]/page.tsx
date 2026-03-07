import { notFound } from "next/navigation";
import { projects } from "../../../data/projects";

export default function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = projects.find((item) => item.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="page projectPage">
      <section
        className="projectHero"
        style={{
          background: project.coverColor || "#e9e9e9",
          backgroundImage: project.coverImage
            ? `url(${project.coverImage.src})`
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
          <p className="projectMeta__text">{project.services.join(" / ")}</p>
        </div>
        <div className="projectMeta__block">
          <h2 className="projectMeta__label">Tags</h2>
          <div className="projectMeta__tags">
            {project.tags.map((tag) => (
              <span key={tag} className="projectTag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
