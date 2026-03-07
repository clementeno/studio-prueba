import {defineField, defineType} from "sanity";

export const projectImageSectionType = defineType({
  name: "projectImageSection",
  title: "Image Section",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
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
    defineField({
      name: "width",
      title: "Width",
      type: "string",
      options: {
        list: [
          {title: "Full", value: "full"},
          {title: "Narrow", value: "narrow"},
        ],
      },
      initialValue: "full",
    }),
  ],
  preview: {
    select: {
      title: "caption",
      media: "image",
      width: "width",
    },
    prepare: ({title, media, width}) => ({
      title: title || "Image Section",
      subtitle: width === "narrow" ? "Narrow" : "Full",
      media,
    }),
  },
});
