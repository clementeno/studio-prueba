import {defineArrayMember, defineField, defineType} from "sanity";

export const projectGallerySectionType = defineType({
  name: "projectGallerySection",
  title: "Gallery Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [defineArrayMember({type: "projectGalleryImage"})],
      validation: (rule) => rule.min(2),
    }),
    defineField({
      name: "columns",
      title: "Columns",
      type: "number",
      initialValue: 2,
      validation: (rule) => rule.min(2).max(4),
    }),
  ],
  preview: {
    select: {
      title: "title",
      images: "images",
      columns: "columns",
    },
    prepare: ({title, images, columns}) => ({
      title: title || "Gallery Section",
      subtitle: `${Array.isArray(images) ? images.length : 0} imagenes · ${columns || 2} columnas`,
    }),
  },
});
