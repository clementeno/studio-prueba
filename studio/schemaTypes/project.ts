import {defineArrayMember, defineField, defineType} from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {source: "title", maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({name: "client", title: "Client", type: "string"}),
    defineField({
      name: "year",
      title: "Year",
      type: "string",
    }),
    defineField({
      name: "homeSummary",
      title: "Home Summary",
      type: "text",
      rows: 3,
      description:
        "Texto breve SOLO para cards del Home. No se usa en Proyectos ni en detalle.",
    }),
    defineField({
      name: "hoverDetail",
      title: "Hover Detail (Casos de estudio)",
      type: "string",
      description:
        "Texto breve de una linea que aparece al hover en la modalidad Casos de estudio.",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{type: "projectCategory"}],
        }),
      ],
    }),
    defineField({
      name: "archiveCategories",
      title: "Legacy Archive Categories",
      type: "array",
      description:
        "Opcional para migracion. En proyectos nuevos usa el campo Categories con referencias.",
      of: [defineArrayMember({type: "string"})],
    }),
    defineField({
      name: "previewMedia",
      title: "Preview Media (Video/GIF)",
      type: "file",
      description:
        "Opcional para cards (reemplaza coverImage). Recomendado: 1200x900 px. Video ideal <= 4 MB (4-8s, sin audio). GIF ideal <= 6 MB.",
      options: {
        accept: "video/*,image/gif",
      },
    }),
    defineField({
      name: "listingOrder",
      title: "Listing Order",
      type: "number",
      description:
        "Orden manual para listados de Proyectos. Menor numero aparece primero.",
    }),
    defineField({
      name: "services",
      title: "Services",
      type: "array",
      of: [defineArrayMember({type: "string"})],
    }),
    defineField({
      name: "sector",
      title: "Sector",
      type: "string",
      description: "Ej: Civic et public, Cultural, Tech, etc.",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [defineArrayMember({type: "string"})],
    }),
    defineField({
      name: "featured",
      title: "Featured in Home",
      type: "boolean",
      initialValue: false,
    }),
    defineField({name: "featuredOrder", title: "Featured Order", type: "number"}),
    defineField({name: "coverColor", title: "Cover Color", type: "string"}),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      description:
        "Imagen principal de Home/Detalle. Recomendado: 3200x1800 px (16:9). Ideal <= 1.5 MB.",
      options: {hotspot: true},
    }),
    defineField({
      name: "heroPosition",
      title: "Hero Position",
      type: "string",
      description: "Controla el recorte de la imagen principal en detalle.",
      options: {
        list: [
          {title: "Center", value: "center center"},
          {title: "Top", value: "center top"},
          {title: "Bottom", value: "center bottom"},
          {title: "Left", value: "left center"},
          {title: "Right", value: "right center"},
        ],
      },
      initialValue: "center center",
    }),
    defineField({
      name: "contentModules",
      title: "Content Modules (Project Detail)",
      type: "array",
      of: [
        defineArrayMember({type: "projectMediaRowSection"}),
        defineArrayMember({type: "projectTextSection"}),
        defineArrayMember({type: "projectImageSection"}),
        defineArrayMember({type: "projectVideoSection"}),
        defineArrayMember({type: "projectGallerySection"}),
        defineArrayMember({type: "projectEmbedSection"}),
      ],
    }),
    defineField({
      name: "closingSection",
      title: "Closing Section (Final Text + Credits)",
      type: "projectClosingSection",
      description:
        "Seccion final en dos columnas: texto largo izquierda y creditos/bloques derecha.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      client: "client",
      media: "coverImage",
    },
    prepare: ({title, client, media}) => ({
      title: title || "Project",
      subtitle: client || "Sin cliente",
      media,
    }),
  },
});
