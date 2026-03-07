import {defineField, defineType} from "sanity";

export const projectClosingBlockType = defineType({
  name: "projectClosingBlock",
  title: "Closing Block",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
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
      title: "title",
      body: "body",
    },
    prepare: ({title, body}) => ({
      title: title || "Closing Block",
      subtitle: body ? String(body).slice(0, 90) : "Sin contenido",
    }),
  },
});
