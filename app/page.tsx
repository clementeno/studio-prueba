import Link from "next/link";
import {client} from "../sanity/client";
import HomeIntroOverlay from "../components/HomeIntroOverlay";

type HomeProject = {
  _id: string;
  slug: string;
  client?: string;
  homeSummary?: string;
  tags?: string[];
  services?: string[];
  coverColor?: string;
  coverImageUrl?: string;
};

type HomePageSettings = {
  featuredProjects?: HomeProject[];
};

const HOME_PAGE_QUERY = `*[
  _type == "homePage"
][0]{
  "featuredProjects": featuredProjects[]->{
    _id,
    "slug": slug.current,
    client,
    "homeSummary": coalesce(homeSummary, summary),
    tags,
    services,
    coverColor,
    "coverImageUrl": coverImage.asset->url
  }
}`;

const HOME_FALLBACK_QUERY = `*[
  _type == "project" &&
  featured == true &&
  defined(slug.current)
] | order(featuredOrder asc){
  _id,
  "slug": slug.current,
  client,
  "homeSummary": coalesce(homeSummary, summary),
  tags,
  services,
  coverColor,
  "coverImageUrl": coverImage.asset->url
}`;

export default async function HomePage() {
  const [homeSettings, fallbackFeatured] = await Promise.all([
    client.fetch<HomePageSettings | null>(
      HOME_PAGE_QUERY,
      {},
      {next: {revalidate: 30}}
    ),
    client.fetch<HomeProject[]>(
      HOME_FALLBACK_QUERY,
      {},
      {next: {revalidate: 30}}
    ),
  ]);

  const featured =
    homeSettings?.featuredProjects && homeSettings.featuredProjects.length > 0
      ? homeSettings.featuredProjects
      : fallbackFeatured;

  return (
    <div className="page page--home">
      <HomeIntroOverlay />
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
                  <div className="card__summary">{p.homeSummary}</div>
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
