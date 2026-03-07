import {defineArrayMember, defineField, defineType} from "sanity";

type RowSectionValue = {
  items?: Array<{width?: number}>;
} | null | undefined;

export const projectMediaRowSectionType = defineType({
  name: "projectMediaRowSection",
  title: "Media Row (12 columns)",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [defineArrayMember({type: "projectRowMediaItem"})],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  validation: (rule) =>
    rule.custom((value) => {
      const safeValue = value as RowSectionValue;

      if (!safeValue || !safeValue.items || safeValue.items.length === 0) return true;

      const total = safeValue.items.reduce((acc, item) => acc + (item.width || 0), 0);

      if (total > 12) {
        return "La suma de anchos de la fila no puede superar 12.";
      }

      return true;
    }),
  preview: {
    select: {
      title: "title",
      items: "items",
    },
    prepare: ({title, items}) => {
      const safeItems = Array.isArray(items) ? items : [];
      const widths = safeItems.map((item) => item.width || 12).join(" + ");
      const total = safeItems.reduce((acc, item) => acc + (item.width || 0), 0);

      return {
        title: title || "Media Row",
        subtitle: `${widths || "12"} = ${total || 0}/12`,
      };
    },
  },
});
