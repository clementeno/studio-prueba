import Link from "next/link";
import {client} from "../sanity/client";

type HomeProject = {
  _id: string;
  slug: string;
  client?: string;
  summary?: string;
  tags?: string[];
  services?: string[];
  coverColor?: string;
  coverImageUrl?: string;
};

const HOME_FEATURED_QUERY = `*[
  _type == "project" &&
  featured == true &&
  defined(slug.current)
] | order(featuredOrder asc){
  _id,
  "slug": slug.current,
  client,
  summary,
  tags,
  services,
  coverColor,
  "coverImageUrl": coverImage.asset->url
}`;

export default async function HomePage() {
  const featured = await client.fetch<HomeProject[]>(
    HOME_FEATURED_QUERY,
    {},
    {next: {revalidate: 30}}
  );

  return (
    <div className="page page--home">
      <div className="grid">
        {featured.map((p) => (
          <Link key={p._id} className="card" href={`/proyectos/${p.slug}`}>
            <div
              className="card__img"
              style={{
                background: p.coverColor || "#e9e9e9",
                backgroundImage: p.coverImageUrl ? `url(${p.coverImageUrl})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="card__overlay">
                <div className="card__client">{p.client}</div>
                <div className="card__center">
                  <div className="card__summary">{p.summary}</div>
                  <div className="card__tags">
                    {(p.tags || []).map((tag) => (
                      <span className="card__tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="card__services">
                  {(p.services || []).map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
