import {defineArrayMember, defineField, defineType} from "sanity";

export const contactPageType = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  fields: [
    defineField({
      name: "pageTitle",
      title: "Page Title",
      type: "string",
      initialValue: "Contacto",
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      initialValue: "hola@masmenos.studio",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contactItems",
      title: "Contact Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
            }),
            defineField({
              name: "value",
              title: "Value",
              type: "string",
            }),
            defineField({
              name: "url",
              title: "URL (optional)",
              type: "string",
              description:
                "Si existe, el item se muestra como link (ej: https://instagram.com/..., mailto:..., tel:...).",
            }),
          ],
          preview: {
            select: {
              label: "label",
              value: "value",
            },
            prepare: ({label, value}) => ({
              title: label || "Contact Item",
              subtitle: value || "Sin valor",
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({title: "Contact Page"}),
  },
});
