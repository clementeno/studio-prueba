import {defineField, defineType} from "sanity";

export const projectGalleryImageType = defineType({
  name: "projectGalleryImage",
  title: "Gallery Image",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description:
        "Recomendado: 1500x1000 px (o proporcional). Ideal <= 900 KB.",
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt",
      type: "string",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
  ],
  preview: {
    select: {
      title: "caption",
      media: "image",
    },
    prepare: ({title, media}) => ({
      title: title || "Gallery Image",
      media,
    }),
  },
});
