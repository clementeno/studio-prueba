import {client} from "../../sanity/client";

type ContactItem = {
  _key: string;
  label?: string;
  value?: string;
  url?: string;
};

type ContactPageData = {
  pageTitle?: string;
  intro?: string;
  email?: string;
  contactItems?: ContactItem[];
};

const CONTACT_PAGE_QUERY = `*[
  _type == "contactPage"
][0]{
  pageTitle,
  intro,
  email,
  "contactItems": coalesce(contactItems[]{
    _key,
    label,
    value,
    url
  }, [])
}`;

export const revalidate = 30;

function splitParagraphs(value?: string) {
  return String(value || "")
    .split(/\n{2,}/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export default async function ContactoPage() {
  const contactPage = await client.fetch<ContactPageData | null>(
    CONTACT_PAGE_QUERY,
    {},
    {next: {revalidate}}
  );

  const pageTitle = contactPage?.pageTitle || "Contacto";
  const email = contactPage?.email || "hola@masmenos.studio";
  const introBlocks = splitParagraphs(contactPage?.intro);
  const items = contactPage?.contactItems || [];

  return (
    <div className="page contactPage">
      <h1 className="h1">{pageTitle}</h1>

      {introBlocks.length > 0 ? (
        <div className="contactPage__intro">
          {introBlocks.map((paragraph, index) => (
            <p key={`intro-${index}`} className="p">
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}

      <p className="p">
        Escríbenos a <a href={`mailto:${email}`}>{email}</a>
      </p>

      {items.length > 0 ? (
        <div className="contactPage__items">
          {items.map((item) => (
            <div key={item._key} className="contactPage__item">
              <p className="contactPage__itemLabel">{item.label || "Contacto"}</p>

              {item.url ? (
                <a className="contactPage__itemValue" href={item.url}>
                  {item.value || item.url}
                </a>
              ) : (
                <p className="contactPage__itemValue">{item.value || "-"}</p>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
