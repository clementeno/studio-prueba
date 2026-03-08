import {defineField, defineType} from "sanity";

export const aboutSplitSectionType = defineType({
  name: "aboutSplitSection",
  title: "About Split Section (2 + 2)",
  type: "object",
  fields: [
    defineField({
      name: "leftTitle",
      title: "Left Title",
      type: "string",
    }),
    defineField({
      name: "leftBody",
      title: "Left Body",
      type: "text",
      rows: 10,
      description: "Texto principal grande en la columna izquierda.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "leftCredits",
      title: "Left Credits",
      type: "text",
      rows: 10,
      description: "Créditos o lista (respeta saltos de línea).",
    }),
    defineField({
      name: "rightTitle",
      title: "Right Title",
      type: "string",
    }),
    defineField({
      name: "rightBody",
      title: "Right Body",
      type: "text",
      rows: 10,
      description: "Texto complementario de la columna derecha.",
    }),
    defineField({
      name: "rightImage",
      title: "Right Image",
      type: "image",
      description:
        "Imagen para columna derecha. Recomendado: 1800x2400 px o 1600x2000 px. Ideal <= 1.3 MB.",
      options: {hotspot: true},
    }),
    defineField({
      name: "rightMediaFile",
      title: "Right Media File (Video/GIF)",
      type: "file",
      description:
        "Opcional para loop visual. Recomendado: 1080x1350 px. Video ideal <= 5 MB (6-12s, sin audio). GIF ideal <= 8 MB.",
      options: {
        accept: "video/*,image/gif",
      },
    }),
    defineField({
      name: "rightMediaAlt",
      title: "Right Media Alt",
      type: "string",
    }),
    defineField({
      name: "rightMediaFit",
      title: "Right Media Fit",
      type: "string",
      options: {
        list: [
          {title: "Cover", value: "cover"},
          {title: "Contain", value: "contain"},
        ],
      },
      initialValue: "cover",
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      if (!value) return true;

      const hasRightContent =
        Boolean(value.rightBody && String(value.rightBody).trim()) ||
        Boolean(value.rightImage) ||
        Boolean(value.rightMediaFile);

      if (!hasRightContent) {
        return "Agrega contenido en la columna derecha (texto, imagen o media).";
      }

      return true;
    }),
  preview: {
    select: {
      leftTitle: "leftTitle",
      leftBody: "leftBody",
      media: "rightImage",
    },
    prepare: ({leftTitle, leftBody, media}) => ({
      title: leftTitle || "About Split Section",
      subtitle: leftBody ? String(leftBody).slice(0, 80) : "Sin texto",
      media,
    }),
  },
});
