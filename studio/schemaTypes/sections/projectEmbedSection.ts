import {defineField, defineType} from "sanity";

export const projectEmbedSectionType = defineType({
  name: "projectEmbedSection",
  title: "Embed Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "embedUrl",
      title: "Embed URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "aspectRatio",
      title: "Aspect Ratio",
      type: "string",
      options: {
        list: [
          {title: "16:9", value: "16/9"},
          {title: "4:3", value: "4/3"},
          {title: "1:1", value: "1/1"},
        ],
      },
      initialValue: "16/9",
    }),
  ],
  preview: {
    select: {
      title: "title",
      embedUrl: "embedUrl",
      aspectRatio: "aspectRatio",
    },
    prepare: ({title, embedUrl, aspectRatio}) => ({
      title: title || "Embed Section",
      subtitle: `${aspectRatio || "16/9"} · ${embedUrl || "Sin URL"}`,
    }),
  },
});
