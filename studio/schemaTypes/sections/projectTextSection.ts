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
    defineField({
      name: "textWidth",
      title: "Text Width",
      type: "string",
      options: {
        list: [
          {title: "Full width", value: "full"},
          {title: "Half width", value: "half"},
        ],
      },
      initialValue: "full",
    }),
  ],
  preview: {
    select: {
      title: "heading",
      body: "body",
      textWidth: "textWidth",
    },
    prepare: ({title, body, textWidth}) => ({
      title: title || "Text Section",
      subtitle: `${textWidth === "half" ? "Half" : "Full"} · ${
        body ? String(body).slice(0, 70) : "Sin texto"
      }`,
    }),
  },
});
