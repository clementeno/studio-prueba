import Link from "next/link";
import { projects } from "../../data/projects";

export default function ProjectsPage() {
  return (
    <div className="page">
      <h1 className="h1">Proyectos</h1>

      <div className="projectList">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/proyectos/${project.slug}`}
            className="projectItem"
          >
            <div className="projectItem__top">
              <span className="projectItem__title">{project.title}</span>
              <span className="projectItem__year">{project.year}</span>
            </div>
            <p className="projectItem__summary">{project.summary}</p>
            <div className="projectItem__tags">
              {project.tags.map((tag) => (
                <span className="projectTag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
