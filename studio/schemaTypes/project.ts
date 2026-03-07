import {defineField, defineType} from "sanity";

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({name: "title", title: "Title", type: "string", validation: (r) => r.required()}),
    defineField({name: "slug", title: "Slug", type: "slug", options: {source: "title", maxLength: 96}, validation: (r) => r.required()}),
    defineField({name: "client", title: "Client", type: "string"}),
    defineField({name: "summary", title: "Summary", type: "text", rows: 3}),
    defineField({name: "services", title: "Services", type: "array", of: [{type: "string"}]}),
    defineField({name: "tags", title: "Tags", type: "array", of: [{type: "string"}]}),
    defineField({name: "year", title: "Year", type: "string"}),
    defineField({name: "featured", title: "Featured in Home", type: "boolean", initialValue: false}),
    defineField({name: "featuredOrder", title: "Featured Order", type: "number"}),
    defineField({name: "coverColor", title: "Cover Color", type: "string"}),
    defineField({name: "coverImage", title: "Cover Image", type: "image", options: {hotspot: true}}),
  ],
});
