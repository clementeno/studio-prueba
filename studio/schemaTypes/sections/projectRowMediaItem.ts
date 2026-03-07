import {defineField, defineType} from "sanity";

type RowMediaValue = {
  image?: {_type: string};
  mediaFile?: {_type: string};
} | null | undefined;

export const projectRowMediaItemType = defineType({
  name: "projectRowMediaItem",
  title: "Row Media Item",
  type: "object",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {hotspot: true},
    }),
    defineField({
      name: "mediaFile",
      title: "Media File (Video/GIF)",
      type: "file",
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
      name: "width",
      title: "Width (12-column grid)",
      type: "number",
      initialValue: 12,
      validation: (rule) => rule.required().min(1).max(12),
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      const safeValue = value as RowMediaValue;

      if (!safeValue) return true;

      if (!safeValue.image && !safeValue.mediaFile) {
        return "Agrega image o mediaFile.";
      }

      return true;
    }),
  preview: {
    select: {
      caption: "caption",
      width: "width",
      image: "image",
      mediaFile: "mediaFile",
    },
    prepare: ({caption, width, image, mediaFile}) => {
      const mediaType = image ? "Image" : mediaFile ? "Media file" : "No media";

      return {
        title: caption || `${mediaType} item`,
        subtitle: `Ancho: ${width || 12} / 12`,
        media: image,
      };
    },
  },
});
