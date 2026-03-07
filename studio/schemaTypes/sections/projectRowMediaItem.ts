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
      description:
        "Fila 12 columnas: width 12 -> 3200x1800 px, width 6 -> 1600x900 px, width 4 -> 1200x900 px. Ideal <= 1.5 MB.",
      options: {hotspot: true},
    }),
    defineField({
      name: "mediaFile",
      title: "Media File (Video/GIF)",
      type: "file",
      description:
        "Recomendado: 1600x900 px. Video ideal <= 8 MB (4-10s, sin audio). GIF ideal <= 6 MB.",
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
