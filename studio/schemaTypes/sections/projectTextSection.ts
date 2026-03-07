import {defineField, defineType} from "sanity";

export const projectTextSectionType = defineType({
  name: "projectTextSection",
  title: "Text Section",
  type: "object",
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "text",
      rows: 8,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      body: "body",
    },
    prepare: ({title, body}) => ({
      title: title || "Text Section",
      subtitle: body ? String(body).slice(0, 80) : "Sin texto",
    }),
  },
});
