import {defineField, defineType} from "sanity";

export const projectVideoSectionType = defineType({
  name: "projectVideoSection",
  title: "Video Section",
  type: "object",
  fields: [
    defineField({
      name: "videoFile",
      title: "Video File",
      type: "file",
      options: {
        accept: "video/*",
      },
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "Usa URL externa si no subes archivo.",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "autoplay",
      title: "Autoplay",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "loop",
      title: "Loop",
      type: "boolean",
      initialValue: true,
    }),
  ],
  validation: (rule) =>
    rule.custom((value: {videoFile?: unknown; videoUrl?: string} | undefined) => {
      if (!value?.videoFile && !value?.videoUrl) {
        return "Agrega videoFile o videoUrl.";
      }

      return true;
    }),
  preview: {
    select: {
      caption: "caption",
      videoUrl: "videoUrl",
      hasVideoFile: "videoFile.asset._ref",
    },
    prepare: ({caption, videoUrl, hasVideoFile}) => ({
      title: caption || "Video Section",
      subtitle: hasVideoFile ? "Archivo de video" : videoUrl || "Sin video",
    }),
  },
});
