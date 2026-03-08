import {defineField, defineType} from "sanity";

export const aboutFullMediaSectionType = defineType({
  name: "aboutFullMediaSection",
  title: "About Full Media Section",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description:
        "Imagen full width. Recomendado: 3200x1800 px (16:9) o 3200x2000 px. Ideal <= 1.8 MB.",
      options: {hotspot: true},
    }),
    defineField({
      name: "mediaFile",
      title: "Media File (Video/GIF)",
      type: "file",
      description:
        "Opcional. Recomendado: 1920x1080 px. Video ideal <= 8 MB (6-14s, sin audio). GIF ideal <= 10 MB.",
      options: {
        accept: "video/*,image/gif",
      },
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
      name: "aspectRatio",
      title: "Aspect Ratio",
      type: "string",
      options: {
        list: [
          {title: "Auto", value: "auto"},
          {title: "16:9", value: "16 / 9"},
          {title: "4:3", value: "4 / 3"},
          {title: "1:1", value: "1 / 1"},
        ],
      },
      initialValue: "auto",
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      if (!value) return true;

      if (!value.image && !value.mediaFile) {
        return "Agrega una imagen o media file.";
      }

      return true;
    }),
  preview: {
    select: {
      label: "label",
      caption: "caption",
      media: "image",
    },
    prepare: ({label, caption, media}) => ({
      title: label || "About Full Media Section",
      subtitle: caption || "Sin caption",
      media,
    }),
  },
});
